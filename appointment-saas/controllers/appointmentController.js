const Appointment = require("../models/Appointment")
const User = require("../models/User")
const {
    buildAppointmentIdentifierClauses,
    buildLegacyIdentityClauses,
    generateSixDigitCode,
    normalizeEmail
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

const buildUserAppointmentFilter = (user) => {
    const identityClauses = buildLegacyIdentityClauses(user)
    return identityClauses.length === 1 ? identityClauses[0] : { $or: identityClauses }
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

exports.createAppointment = async (req, res) => {
    try {
        const { name, date, time } = req.body
        const currentUser = await resolveCurrentUser(req)

        if (!currentUser) {
            return res.status(401).json({ message: "User not found" })
        }

        const appointmentCode = await createUniqueAppointmentCode()

        const newAppointment = new Appointment({
            userId: currentUser._id,
            appointmentCode,
            email: currentUser.email || currentUser.phone,
            name,
            date,
            time
        })

        await newAppointment.save()

        res.json({
            message: "Appointment Created",
            id: newAppointment.appointmentCode,
            appointmentCode: newAppointment.appointmentCode,
            name: newAppointment.name
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
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
            $and: [
                buildUserAppointmentFilter(currentUser),
                { $or: identifierClauses }
            ]
        })

        if (!appointment) {
            return res.status(404).json({ message: "Not found" })
        }

        res.json(appointment)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.updateAppointment = async (req, res) => {
    try {
        const { date, time } = req.body
        const currentUser = await resolveCurrentUser(req)

        if (!currentUser) {
            return res.status(401).json({ message: "User not found" })
        }

        const updated = await Appointment.findOneAndUpdate(
            {
                $and: [
                    buildUserAppointmentFilter(currentUser),
                    { $or: buildAppointmentIdentifierClauses(req.params.id) }
                ]
            },
            { date, time, status: "changed" },
            { new: true }
        )

        if (!updated) {
            return res.status(404).json({ message: "Not found" })
        }

        res.json(updated)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.cancelAppointment = async (req, res) => {
    try {
        const currentUser = await resolveCurrentUser(req)

        if (!currentUser) {
            return res.status(401).json({ message: "User not found" })
        }

        const cancelled = await Appointment.findOneAndUpdate(
            {
                $and: [
                    buildUserAppointmentFilter(currentUser),
                    { $or: buildAppointmentIdentifierClauses(req.params.id) }
                ]
            },
            { status: "cancelled" },
            { new: true }
        )

        if (!cancelled) {
            return res.status(404).json({ message: "Not found" })
        }

        res.json(cancelled)
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

        const appointments = await Appointment.find(
            buildUserAppointmentFilter(currentUser)
        ).sort({ createdAt: -1 })

        res.json(appointments)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
