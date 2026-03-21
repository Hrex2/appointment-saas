const Appointment = require("../models/Appointment")
const User = require("../models/User")
const {
    buildAppointmentDates,
    buildAppointmentIdentifierClauses,
    generateSixDigitCode,
    isAppointmentActive,
    normalizeEmail,
    normalizePhone
} = require("../utils/helpers")

const resolveCurrentUser = async (req) => {
    if (req.user?.userId) {
        const byId = await User.findById(req.user.userId)
        if (byId) {
            return byId
        }
    }

    if (req.user?.email) {
        return User.findOne({ email: normalizeEmail(req.user.email) })
    }

    return null
}

const createUniqueAppointmentCode = async () => {
    let appointmentCode
    let exists = true

    while (exists) {
        appointmentCode = generateSixDigitCode()
        exists = await Appointment.exists({ appointmentCode })
    }

    return appointmentCode
}

const buildQuery = (userId, query = {}) => {
    const filter = { userId }
    const {
        status,
        scope,
        search,
        from,
        to,
        date
    } = query

    if (status && status !== "all") {
        filter.status = status
    }

    if (date) {
        filter.date = date
    }

    if (from || to) {
        filter.startAt = {}

        if (from) {
            filter.startAt.$gte = new Date(from)
        }

        if (to) {
            filter.startAt.$lte = new Date(to)
        }
    }

    if (scope === "today") {
        filter.date = new Date().toISOString().slice(0, 10)
    }

    if (scope === "upcoming") {
        filter.startAt = {
            ...(filter.startAt || {}),
            $gte: new Date()
        }
        filter.status = { $nin: ["cancelled", "completed", "no-show"] }
    }

    if (scope === "completed") {
        filter.status = "completed"
    }

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { customerPhone: { $regex: search, $options: "i" } },
            { appointmentCode: { $regex: search, $options: "i" } }
        ]
    }

    return filter
}

const assertPlanUsage = (user) => {
    const usage = user.subscription?.usage || {}
    const limit = Number(usage.appointmentLimit || 25)
    const count = Number(usage.appointmentCount || 0)

    if (limit !== 999999 && count >= limit) {
        const error = new Error("Appointment limit reached for your current plan")
        error.statusCode = 403
        throw error
    }
}

const assertSlotAvailable = async ({ userId, slotKey, excludeId }) => {
    if (!slotKey) {
        return
    }

    const conflict = await Appointment.findOne({
        userId,
        slotKey,
        _id: excludeId ? { $ne: excludeId } : { $exists: true },
        status: { $nin: ["cancelled", "no-show"] }
    })

    if (conflict && isAppointmentActive(conflict.status)) {
        const error = new Error("This time slot is already booked")
        error.statusCode = 409
        throw error
    }
}

const serializeAppointment = (appointment) => ({
    id: appointment._id,
    appointmentCode: appointment.appointmentCode,
    name: appointment.name,
    customerPhone: appointment.customerPhone,
    service: appointment.service,
    notes: appointment.notes,
    date: appointment.date,
    time: appointment.time,
    durationMinutes: appointment.durationMinutes,
    fee: appointment.fee,
    status: appointment.status,
    startAt: appointment.startAt,
    endAt: appointment.endAt,
    createdAt: appointment.createdAt
})

exports.createAppointment = async (req, res) => {
    try {
        const currentUser = await resolveCurrentUser(req)

        if (!currentUser) {
            return res.status(401).json({ message: "User not found" })
        }

        assertPlanUsage(currentUser)

        const {
            name,
            customerPhone = "",
            date,
            time,
            service = "Consultation",
            notes = "",
            durationMinutes = 30,
            fee = currentUser.businessSettings?.fee || 0,
            status = "confirmed",
            source = "dashboard"
        } = req.body

        const dateParts = buildAppointmentDates({ date, time, durationMinutes })
        await assertSlotAvailable({ userId: currentUser._id, slotKey: dateParts.slotKey })

        const appointmentCode = await createUniqueAppointmentCode()

        const newAppointment = new Appointment({
            userId: currentUser._id,
            appointmentCode,
            email: currentUser.email || currentUser.phone,
            name,
            customerPhone: normalizePhone(customerPhone),
            service,
            notes,
            durationMinutes: Number(durationMinutes || 30),
            fee: Number(fee || 0),
            status,
            source,
            ...dateParts
        })

        await newAppointment.save()

        currentUser.subscription.usage.appointmentCount =
            Number(currentUser.subscription?.usage?.appointmentCount || 0) + 1
        await currentUser.save()

        res.json({
            message: "Appointment created successfully",
            appointment: serializeAppointment(newAppointment)
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({ error: err.message })
    }
}

exports.getAppointment = async (req, res) => {
    try {
        const currentUser = await resolveCurrentUser(req)

        if (!currentUser) {
            return res.status(401).json({ message: "User not found" })
        }

        const identifierClauses = buildAppointmentIdentifierClauses(req.params.id)
        const appointment = await Appointment.findOne({
            userId: currentUser._id,
            $or: identifierClauses
        })

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" })
        }

        res.json(serializeAppointment(appointment))
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.updateAppointment = async (req, res) => {
    try {
        const currentUser = await resolveCurrentUser(req)

        if (!currentUser) {
            return res.status(401).json({ message: "User not found" })
        }

        const identifierClauses = buildAppointmentIdentifierClauses(req.params.id)
        const appointment = await Appointment.findOne({
            userId: currentUser._id,
            $or: identifierClauses
        })

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" })
        }

        const nextDate = req.body.date || appointment.date
        const nextTime = req.body.time || appointment.time
        const nextDuration = req.body.durationMinutes || appointment.durationMinutes
        const dateParts = buildAppointmentDates({
            date: nextDate,
            time: nextTime,
            durationMinutes: nextDuration
        })

        await assertSlotAvailable({
            userId: currentUser._id,
            slotKey: dateParts.slotKey,
            excludeId: appointment._id
        })

        appointment.name = req.body.name || appointment.name
        appointment.customerPhone = normalizePhone(req.body.customerPhone || appointment.customerPhone)
        appointment.service = req.body.service || appointment.service
        appointment.notes = req.body.notes || appointment.notes
        appointment.durationMinutes = Number(nextDuration)
        appointment.fee = Number(req.body.fee ?? appointment.fee)
        appointment.status = req.body.status || appointment.status
        Object.assign(appointment, dateParts)

        await appointment.save()

        res.json({
            message: "Appointment updated successfully",
            appointment: serializeAppointment(appointment)
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({ error: err.message })
    }
}

exports.cancelAppointment = async (req, res) => {
    try {
        const currentUser = await resolveCurrentUser(req)

        if (!currentUser) {
            return res.status(401).json({ message: "User not found" })
        }

        const identifierClauses = buildAppointmentIdentifierClauses(req.params.id)
        const cancelled = await Appointment.findOneAndUpdate(
            {
                userId: currentUser._id,
                $or: identifierClauses
            },
            { status: "cancelled" },
            { new: true }
        )

        if (!cancelled) {
            return res.status(404).json({ message: "Appointment not found" })
        }

        res.json({
            message: "Appointment cancelled successfully",
            appointment: serializeAppointment(cancelled)
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getUserAppointments = async (req, res) => {
    try {
        const currentUser = await resolveCurrentUser(req)

        if (!currentUser) {
            return res.status(401).json({ message: "User not found" })
        }

        const appointments = await Appointment.find(buildQuery(currentUser._id, req.query)).sort({ startAt: 1, createdAt: -1 })

        res.json(appointments.map(serializeAppointment))
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
