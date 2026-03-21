const User = require("../models/User")
const { normalizeEmail } = require("../utils/helpers")
const { previewNotificationPayload } = require("../services/notificationService")

const resolveCurrentUser = async (req) => {
    if (req.user?.userId) {
        return User.findById(req.user.userId)
    }

    if (req.user?.email) {
        return User.findOne({ email: normalizeEmail(req.user.email) })
    }

    return null
}

exports.getProfile = async (req, res) => {
    try {
        const user = await resolveCurrentUser(req)

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt
            },
            businessSettings: user.businessSettings,
            subscription: user.subscription,
            notifications: previewNotificationPayload(user)
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
