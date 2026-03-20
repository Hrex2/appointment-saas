const User = require("../models/User")
const Appointment = require("../models/Appointment")
const {
    buildAppointmentIdentifierClauses,
    buildLegacyIdentityClauses,
    generateSixDigitCode,
    normalizePhone
} = require("../utils/helpers")

const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date)
const isValidTime = (time) => /^\d{1,2}:\d{2}(AM|PM)$/i.test(time)

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

exports.handleMessage = async (phone, msg) => {
    phone = normalizePhone(phone)
    msg = msg.trim()

    let user = await User.findOne({ phone })

    if (!user) {
        user = await User.create({
            phone,
            name: "",
            step: "ask_name"
        })
        return "Welcome! What is your name?"
    }

    if (user.step === "ask_name") {
        user.name = msg
        user.step = "menu"
        await user.save()

        return `Welcome ${user.name}!\n\nChoose:\n1. Book Appointment\n2. View Appointments\n3. Cancel Appointment`
    }

    if (user.step === "menu") {
        if (msg === "1") {
            user.step = "ask_appt_name"
            await user.save()
            return "Enter appointment name:"
        }

        if (msg === "2") {
            const list = await Appointment.find(buildUserAppointmentFilter(user)).sort({ createdAt: -1 })

            if (list.length === 0) return "No appointments found"

            let reply = "Your Appointments:\n"
            list.forEach((a) => {
                reply += `\nID: ${a.appointmentCode || a._id}\n${a.name} - ${a.date} ${a.time} (${a.status})\n`
            })

            return reply
        }

        if (msg === "3") {
            user.step = "ask_cancel_id"
            await user.save()
            return "Enter appointment ID to cancel:"
        }

        return "Invalid option. Choose 1, 2 or 3."
    }

    if (user.step === "ask_appt_name") {
        user.tempName = msg
        user.step = "ask_date"
        await user.save()
        return "Enter date (YYYY-MM-DD):"
    }

    if (user.step === "ask_date") {
        if (!isValidDate(msg)) {
            return "Invalid date format.\nUse: YYYY-MM-DD"
        }

        user.tempDate = msg
        user.step = "ask_time"
        await user.save()

        return "Enter time (e.g. 10:00AM):"
    }

    if (user.step === "ask_time") {
        if (!isValidTime(msg)) {
            return "Invalid time format.\nExample: 10:00AM"
        }

        const existing = await Appointment.findOne({
            date: user.tempDate,
            time: msg,
            status: "booked"
        })

        if (existing) {
            return "This time slot is already booked.\nTry another time."
        }

        const appt = new Appointment({
            userId: user._id,
            appointmentCode: await createUniqueAppointmentCode(),
            email: user.email || user.phone,
            name: user.tempName,
            date: user.tempDate,
            time: msg,
            status: "booked"
        })

        await appt.save()

        user.step = "menu"
        user.tempName = ""
        user.tempDate = ""
        await user.save()

        return `Appointment Booked!\nID: ${appt.appointmentCode || appt._id}\n\nBack to menu:\n1. Book\n2. View\n3. Cancel`
    }

    if (user.step === "ask_cancel_id") {
        const cancelled = await Appointment.findOneAndUpdate(
            {
                $and: [
                    buildUserAppointmentFilter(user),
                    { $or: buildAppointmentIdentifierClauses(msg) }
                ]
            },
            { status: "cancelled" },
            { new: true }
        )

        user.step = "menu"
        await user.save()

        if (!cancelled) return "Appointment not found"

        return "Appointment cancelled successfully\n\nBack to menu:\n1. Book\n2. View\n3. Cancel"
    }

    return "Type HI to start"
}
