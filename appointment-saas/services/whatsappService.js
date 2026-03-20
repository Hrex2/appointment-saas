// services/whatsappService.js

/**
 * PURPOSE:
 * Handle WhatsApp chatbot logic
 * INPUT:
 * - message from user
 * OUTPUT:
 * - reply message
 */

/**
 * PURPOSE:
 * Handle WhatsApp conversation
 */
const User = require("../models/User")
const Appointment = require("../models/Appointment")

// 🧠 Helpers
const isValidDate = (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

const isValidTime = (time) => {
    return /^\d{1,2}:\d{2}(AM|PM)$/i.test(time)
}

exports.handleMessage = async (phone, msg) => {

    msg = msg.trim()

    let user = await User.findOne({ phone })

    // 🆕 New user
    if (!user) {
        user = await User.create({
            phone,
            name: "",
            step: "ask_name"
        })
        return "👋 Welcome! What is your name?"
    }

    // 🔹 Ask name
    if (user.step === "ask_name") {
        user.name = msg
        user.step = "menu"
        await user.save()

        return `✅ Welcome ${user.name}!

Choose:
1. Book Appointment
2. View Appointments
3. Cancel Appointment`
    }

    // 🔹 MENU
    if (user.step === "menu") {

        if (msg === "1") {
            user.step = "ask_appt_name"
            await user.save()
            return "📝 Enter appointment name:"
        }

        if (msg === "2") {
            const list = await Appointment.find({ email: user.phone })

            if (list.length === 0) return "No appointments found"

            let reply = "📋 Your Appointments:\n"
            list.forEach(a => {
                reply += `\nID: ${a._id}\n${a.name} - ${a.date} ${a.time} (${a.status})\n`
            })

            return reply
        }

        if (msg === "3") {
            user.step = "ask_cancel_id"
            await user.save()
            return "Enter appointment ID to cancel:"
        }

        return "❌ Invalid option. Choose 1, 2 or 3."
    }

    // 🔹 Appointment Name
    if (user.step === "ask_appt_name") {
        user.tempName = msg
        user.step = "ask_date"
        await user.save()
        return "📅 Enter date (YYYY-MM-DD):"
    }

    // 🔹 Date validation
    if (user.step === "ask_date") {

        if (!isValidDate(msg)) {
            return "❌ Invalid date format.\nUse: YYYY-MM-DD"
        }

        user.tempDate = msg
        user.step = "ask_time"
        await user.save()

        return "⏰ Enter time (e.g. 10:00AM):"
    }

    // 🔹 Time + DOUBLE BOOKING CHECK
    if (user.step === "ask_time") {

        if (!isValidTime(msg)) {
            return "❌ Invalid time format.\nExample: 10:00AM"
        }

        // 🔥 Prevent double booking
        const existing = await Appointment.findOne({
            date: user.tempDate,
            time: msg,
            status: "booked"
        })

        if (existing) {
            return "⚠️ This time slot is already booked.\nTry another time."
        }

        // ✅ Create appointment
        const appt = new Appointment({
            email: user.phone,
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

        return `✅ Appointment Booked!
ID: ${appt._id}

Back to menu:
1. Book
2. View
3. Cancel`
    }

    // 🔹 CANCEL
    if (user.step === "ask_cancel_id") {

        const cancelled = await Appointment.findOneAndUpdate(
            { _id: msg, email: user.phone },
            { status: "cancelled" },
            { new: true }
        )

        user.step = "menu"
        await user.save()

        if (!cancelled) return "❌ Appointment not found"

        return `❌ Appointment cancelled successfully

Back to menu:
1. Book
2. View
3. Cancel`
    }

    return "Type HI to start"
}
