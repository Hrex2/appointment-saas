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
const isRestartCommand = (msg = "") => {
    const normalized = String(msg || "").trim().toLowerCase()
    return ["hi", "hello", "menu", "start", "restart", "reset"].includes(normalized)
}

const text = {
    welcomeNew:
        "Welcome! What is your name?\n" +
        "स्वागत है! आपका नाम क्या है?\n" +
        "ਜੀ ਆਇਆਂ ਨੂੰ! ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    welcomeBack: (name) =>
        `Welcome back ${name}!\n` +
        `वापसी पर स्वागत है ${name}!\n` +
        `ਵਾਪਸੀ ਤੇ ਸਵਾਗਤ ਹੈ ${name}!\n\n` +
        `Choose / चुनें / ਚੁਣੋ:\n` +
        `1. Book Appointment / अपॉइंटमेंट बुक करें / ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ\n` +
        `2. View Appointments / अपॉइंटमेंट देखें / ਅਪਾਇੰਟਮੈਂਟ ਵੇਖੋ\n` +
        `3. Cancel Appointment / अपॉइंटमेंट रद्द करें / ਅਪਾਇੰਟਮੈਂਟ ਰੱਦ ਕਰੋ`,
    welcomeNamed: (name) =>
        `Welcome ${name}!\n` +
        `स्वागत है ${name}!\n` +
        `ਜੀ ਆਇਆਂ ਨੂੰ ${name}!\n\n` +
        `Choose / चुनें / ਚੁਣੋ:\n` +
        `1. Book Appointment / अपॉइंटमेंट बुक करें / ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ\n` +
        `2. View Appointments / अपॉइंटमेंट देखें / ਅਪਾਇੰਟਮੈਂਟ ਵੇਖੋ\n` +
        `3. Cancel Appointment / अपॉइंटमेंट रद्द करें / ਅਪਾਇੰਟਮੈਂਟ ਰੱਦ ਕਰੋ`,
    invalidMenu:
        "Invalid option. Choose 1, 2 or 3.\n" +
        "गलत विकल्प। 1, 2 या 3 चुनें।\n" +
        "ਗਲਤ ਵਿਕਲਪ। 1, 2 ਜਾਂ 3 ਚੁਣੋ।",
    askAppointmentName:
        "Enter appointment name:\n" +
        "अपॉइंटमेंट का नाम लिखें:\n" +
        "ਅਪਾਇੰਟਮੈਂਟ ਦਾ ਨਾਮ ਲਿਖੋ:",
    askDate:
        "Enter date (YYYY-MM-DD):\n" +
        "तारीख लिखें (YYYY-MM-DD):\n" +
        "ਤਾਰੀਖ ਲਿਖੋ (YYYY-MM-DD):",
    invalidDate:
        "Invalid date format. Use YYYY-MM-DD.\n" +
        "गलत तारीख प्रारूप। YYYY-MM-DD इस्तेमाल करें।\n" +
        "ਗਲਤ ਤਾਰੀਖ ਫਾਰਮੈਟ। YYYY-MM-DD ਵਰਤੋ।",
    askTime:
        "Enter time (e.g. 10:00AM):\n" +
        "समय लिखें (जैसे 10:00AM):\n" +
        "ਸਮਾਂ ਲਿਖੋ (ਜਿਵੇਂ 10:00AM):",
    invalidTime:
        "Invalid time format. Example: 10:00AM.\n" +
        "गलत समय प्रारूप। उदाहरण: 10:00AM.\n" +
        "ਗਲਤ ਸਮਾਂ ਫਾਰਮੈਟ। ਉਦਾਹਰਨ: 10:00AM.",
    slotBooked:
        "This time slot is already booked. Try another time.\n" +
        "यह समय पहले से बुक है। दूसरा समय चुनें।\n" +
        "ਇਹ ਸਮਾਂ ਪਹਿਲਾਂ ਹੀ ਬੁੱਕ ਹੈ। ਹੋਰ ਸਮਾਂ ਚੁਣੋ।",
    askCancelId:
        "Enter appointment ID to cancel:\n" +
        "रद्द करने के लिए अपॉइंटमेंट ID लिखें:\n" +
        "ਰੱਦ ਕਰਨ ਲਈ ਅਪਾਇੰਟਮੈਂਟ ID ਲਿਖੋ:",
    appointmentNotFound:
        "Appointment not found.\n" +
        "अपॉइंटमेंट नहीं मिली।\n" +
        "ਅਪਾਇੰਟਮੈਂਟ ਨਹੀਂ ਮਿਲੀ।",
    noAppointments:
        "No appointments found.\n" +
        "कोई अपॉइंटमेंट नहीं मिली।\n" +
        "ਕੋਈ ਅਪਾਇੰਟਮੈਂਟ ਨਹੀਂ ਮਿਲੀ।",
    typeHi:
        "Type HI to start.\n" +
        "शुरू करने के लिए HI लिखें।\n" +
        "ਸ਼ੁਰੂ ਕਰਨ ਲਈ HI ਲਿਖੋ।"
}

const buildBookedMessage = (appointmentCode) =>
    `Appointment booked.\n` +
    `ID: ${appointmentCode}\n\n` +
    `अपॉइंटमेंट बुक हो गई।\n` +
    `ID: ${appointmentCode}\n\n` +
    `ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਹੋ ਗਈ।\n` +
    `ID: ${appointmentCode}\n\n` +
    `1. Book\n2. View\n3. Cancel`

const buildCancelledMessage =
    "Appointment cancelled successfully.\n" +
    "अपॉइंटमेंट सफलतापूर्वक रद्द हो गई।\n" +
    "ਅਪਾਇੰਟਮੈਂਟ ਸਫਲਤਾਪੂਰਵਕ ਰੱਦ ਹੋ ਗਈ।\n\n" +
    "1. Book\n2. View\n3. Cancel"

const buildAppointmentsReply = (list) => {
    let reply =
        "Your Appointments / आपकी अपॉइंटमेंट / ਤੁਹਾਡੀਆਂ ਅਪਾਇੰਟਮੈਂਟਾਂ:\n"

    list.forEach((a) => {
        reply += `\nID: ${a.appointmentCode || a._id}\n${a.name} - ${a.date} ${a.time} (${a.status})\n`
    })

    return reply
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
        return text.welcomeNew
    }

    if (isRestartCommand(msg)) {
        if (!user.name) {
            user.step = "ask_name"
            user.tempName = ""
            user.tempDate = ""
            await user.save()
            return text.welcomeNew
        }

        user.step = "menu"
        user.tempName = ""
        user.tempDate = ""
        await user.save()

        return text.welcomeBack(user.name)
    }

    if (user.step === "ask_name") {
        user.name = msg
        user.step = "menu"
        await user.save()

        return text.welcomeNamed(user.name)
    }

    if (user.step === "menu") {
        if (msg === "1") {
            user.step = "ask_appt_name"
            await user.save()
            return text.askAppointmentName
        }

        if (msg === "2") {
            const list = await Appointment.find(buildUserAppointmentFilter(user)).sort({ createdAt: -1 })

            if (list.length === 0) return text.noAppointments

            return buildAppointmentsReply(list)
        }

        if (msg === "3") {
            user.step = "ask_cancel_id"
            await user.save()
            return text.askCancelId
        }

        return text.invalidMenu
    }

    if (user.step === "ask_appt_name") {
        user.tempName = msg
        user.step = "ask_date"
        await user.save()
        return text.askDate
    }

    if (user.step === "ask_date") {
        if (!isValidDate(msg)) {
            return text.invalidDate
        }

        user.tempDate = msg
        user.step = "ask_time"
        await user.save()

        return text.askTime
    }

    if (user.step === "ask_time") {
        if (!isValidTime(msg)) {
            return text.invalidTime
        }

        const existing = await Appointment.findOne({
            date: user.tempDate,
            time: msg,
            status: "booked"
        })

        if (existing) {
            return text.slotBooked
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

        return buildBookedMessage(appt.appointmentCode || appt._id)
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

        if (!cancelled) return text.appointmentNotFound

        return buildCancelledMessage
    }

    return text.typeHi
}
