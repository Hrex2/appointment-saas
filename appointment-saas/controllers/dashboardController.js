const Appointment = require("../models/Appointment")
const User = require("../models/User")
const { normalizeEmail } = require("../utils/helpers")

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

exports.getDashboardOverview = async (req, res) => {
    try {
        const currentUser = await resolveCurrentUser(req)

        if (!currentUser) {
            return res.status(401).json({ message: "User not found" })
        }

        const now = new Date()
        const today = now.toISOString().slice(0, 10)

        const appointments = await Appointment.find({ userId: currentUser._id })

        const totalAppointments = appointments.length
        const todaysBookings = appointments.filter((appt) => appt.date === today).length
        const noShows = appointments.filter((appt) => appt.status === "no-show").length
        const completedRevenue = appointments
            .filter((appt) => appt.status === "completed")
            .reduce((total, appt) => total + Number(appt.fee || 0), 0)

        res.json({
            metrics: [
                { label: "Total Appointments", value: totalAppointments },
                { label: "Today's Bookings", value: todaysBookings },
                { label: "Revenue", value: completedRevenue },
                { label: "No-shows", value: noShows }
            ],
            upcomingAppointments: appointments
                .filter((appt) => appt.startAt && appt.startAt >= now && appt.status !== "cancelled")
                .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
                .slice(0, 5),
            automationPreview: {
                remindersEnabled: currentUser.subscription?.planKey !== "free",
                followUpsEnabled: ["pro", "premium"].includes(currentUser.subscription?.planKey),
                planStatus: currentUser.subscription?.status || "active"
            }
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
