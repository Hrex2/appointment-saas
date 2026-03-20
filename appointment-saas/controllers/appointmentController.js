// controllers/appointmentController.js

/**
 * PURPOSE:
 * Contains business logic (MAIN BRAIN)
 * INPUT:
 * - request data from routes
 * OUTPUT:
 * - response to user (JSON or WhatsApp reply)
 */
/**
 * PURPOSE:
 * Business logic (secured with user-based data)
 */

const Appointment = require("../models/Appointment")

// 🟢 CREATE APPOINTMENT
exports.createAppointment = async (req, res) => {
    try {
        const { name, date, time } = req.body

        const newAppointment = new Appointment({
            name,
            date,
            time,
            email: req.user.email // 🔥 attach from JWT
        })

        await newAppointment.save()

        res.json({
            message: "Appointment Created",
            id: newAppointment._id
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// 🔵 GET APPOINTMENT (ONLY OWN)
exports.getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            email: req.user.email // 🔒 restrict access
        })

        if (!appointment) {
            return res.status(404).json({ message: "Not found" })
        }

        res.json(appointment)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// 🟡 UPDATE APPOINTMENT (ONLY OWN)
exports.updateAppointment = async (req, res) => {
    try {
        const { date, time } = req.body

        const updated = await Appointment.findOneAndUpdate(
            {
                _id: req.params.id,
                email: req.user.email // 🔒 secure
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

// 🔴 CANCEL APPOINTMENT (ONLY OWN)
exports.cancelAppointment = async (req, res) => {
    try {
        const cancelled = await Appointment.findOneAndUpdate(
            {
                _id: req.params.id,
                email: req.user.email // 🔒 secure
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

// 🔵 GET ALL USER APPOINTMENTS
exports.getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            email: req.user.email // 🔥 only logged-in user's data
        }).sort({ createdAt: -1 }) // latest first

        res.json(appointments)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}