const User = require("../models/User")
const { normalizeEmail, normalizePhone } = require("../utils/helpers")

const resolveCurrentUser = async (req) => {
    if (req.user?.userId) {
        return User.findById(req.user.userId)
    }

    if (req.user?.email) {
        return User.findOne({ email: normalizeEmail(req.user.email) })
    }

    return null
}

exports.getBusinessSettings = async (req, res) => {
    try {
        const user = await resolveCurrentUser(req)

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        res.json(user.businessSettings || {})
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.updateBusinessSettings = async (req, res) => {
    try {
        const user = await resolveCurrentUser(req)

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const {
            businessName = "",
            phoneNumber = "",
            whatsappNumber = "",
            workingHours = {},
            fee = 0,
            address = ""
        } = req.body

        user.businessSettings = {
            businessName: businessName.trim(),
            phoneNumber: normalizePhone(phoneNumber),
            whatsappNumber: normalizePhone(whatsappNumber),
            workingHours: {
                start: workingHours.start || "09:00",
                end: workingHours.end || "18:00",
                timezone: workingHours.timezone || "Asia/Kolkata",
                days: Array.isArray(workingHours.days) && workingHours.days.length
                    ? workingHours.days
                    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            },
            fee: Number(fee || 0),
            address: address.trim()
        }

        await user.save()

        res.json({
            message: "Business settings updated successfully",
            businessSettings: user.businessSettings
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
