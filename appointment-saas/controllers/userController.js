const User = require("../models/User")
const { normalizeEmail, normalizePhone } = require("../utils/helpers")

exports.listUsers = async (_req, res) => {
    try {
        const users = await User.find({})
            .select("name email phone role subscription.planName subscription.status createdAt")
            .sort({ createdAt: -1 })

        res.json(users)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.createOrUpdateUser = async (req, res) => {
    try {
        const {
            name = "",
            email = "",
            phone = "",
            role = "user"
        } = req.body

        const normalizedEmail = normalizeEmail(email)
        const normalizedPhone = normalizePhone(phone)

        if (!normalizedEmail && !normalizedPhone) {
            return res.status(400).json({ message: "Email or phone is required" })
        }

        let user = null

        if (normalizedEmail) {
            user = await User.findOne({ email: normalizedEmail })
        }

        if (!user && normalizedPhone) {
            user = await User.findOne({ phone: normalizedPhone })
        }

        if (!user) {
            user = new User({
                subscription: {
                    planKey: "free",
                    planName: "Free",
                    tierLevel: 0,
                    status: "active",
                    usage: {
                        appointmentCount: 0,
                        appointmentLimit: 25
                    }
                }
            })
        }

        if (normalizedEmail) {
            user.email = normalizedEmail
        }

        if (normalizedPhone) {
            user.phone = normalizedPhone
        }

        user.name = name.trim()
        user.role = role === "admin" ? "admin" : "user"

        await user.save()

        res.json({
            message: "User saved successfully",
            user
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
