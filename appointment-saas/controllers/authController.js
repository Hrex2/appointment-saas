const User = require("../models/User")
const { sendOTP } = require("../services/emailService")
const { sendWhatsAppOTP } = require("../services/whatsappOtpService")
const jwt = require("jsonwebtoken")
const { normalizeEmail, normalizePhone } = require("../utils/helpers")

const generateOTP = () => Math.floor(100000 + Math.random() * 900000)
const isAdminBypassEnabled = () => process.env.ADMIN_BYPASS_ENABLED === "true"
const isAdminBypassUser = (email) =>
    isAdminBypassEnabled() &&
    normalizeEmail(email) === normalizeEmail(process.env.ADMIN_EMAIL) &&
    process.env.ADMIN_BYPASS_CODE

const issueAuthPayload = (user) => {
    const token = jwt.sign(
        { email: user.email, userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    return {
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    }
}

const linkUserByPhone = async (user, phone) => {
    const normalizedPhone = normalizePhone(phone)

    if (!normalizedPhone) {
        return user
    }

    const phoneOwner = await User.findOne({ phone: normalizedPhone })

    if (!phoneOwner || String(phoneOwner._id) === String(user._id)) {
        user.phone = normalizedPhone
        return user
    }

    if (phoneOwner.email && normalizeEmail(phoneOwner.email) !== normalizeEmail(user.email)) {
        throw new Error("This phone number is already linked to another account")
    }

    phoneOwner.email = user.email
    phoneOwner.phone = normalizedPhone
    phoneOwner.otp = null
    phoneOwner.otpExpiry = null

    if (!phoneOwner.name && user.name) {
        phoneOwner.name = user.name
    }

    await phoneOwner.save()
    await User.deleteOne({ _id: user._id })

    return phoneOwner
}

const findOrCreateUserForOtp = async (email, phone) => {
    const normalizedEmail = normalizeEmail(email)
    const normalizedPhone = normalizePhone(phone)

    let user = null

    if (normalizedEmail) {
        user = await User.findOne({ email: normalizedEmail })
    }

    if (!user && normalizedPhone) {
        user = await User.findOne({ phone: normalizedPhone })
        if (user && normalizedEmail && !user.email) {
            user.email = normalizedEmail
        }
    }

    if (!user) {
        user = new User({
            email: normalizedEmail || undefined,
            phone: normalizedPhone || undefined
        })
    }

    return user
}

exports.sendOtp = async (req, res) => {
    try {
        const { email = "", phone = "", channel = "whatsapp" } = req.body
        console.log("sendOtp:start", { email, phone, channel })

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        if (isAdminBypassUser(email)) {
            console.log("sendOtp:admin-bypass-available", { email })
            return res.json({ message: "Admin bypass enabled" })
        }

        const otp = generateOTP()
        const user = await findOrCreateUserForOtp(email, phone)

        user.otp = otp
        user.otpExpiry = Date.now() + 5 * 60 * 1000

        if (!user.role) {
            user.role = normalizeEmail(email) === normalizeEmail(process.env.ADMIN_EMAIL) ? "admin" : "user"
        }

        await user.save()

        if (channel === "whatsapp") {
            if (!phone) {
                return res.status(400).json({ message: "WhatsApp phone is required for WhatsApp OTP" })
            }

            await sendWhatsAppOTP(phone, otp)
            return res.json({ message: "OTP sent to WhatsApp" })
        }

        await sendOTP(email, otp)
        res.json({ message: "OTP sent to email" })
    } catch (err) {
        console.error("sendOtp error:", err)
        res.status(500).json({ error: err.message })
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp, phone } = req.body
        console.log("verifyOtp:start", { email, hasPhone: !!phone })

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP required" })
        }

        if (isAdminBypassUser(email) && otp === process.env.ADMIN_BYPASS_CODE) {
            let user = await User.findOne({ email: normalizeEmail(email) })

            if (!user) {
                user = new User({
                    email: normalizeEmail(email),
                    role: "admin"
                })
            }

            user = await linkUserByPhone(user, phone)
            user.role = "admin"
            await user.save()

            return res.json(issueAuthPayload(user))
        }

        const user = await User.findOne({ email: normalizeEmail(email) })

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        if (user.otp != otp) {
            return res.status(400).json({ message: "Invalid OTP" })
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP expired" })
        }

        user.otp = null
        user.otpExpiry = null

        const linkedUser = await linkUserByPhone(user, phone)

        if (normalizeEmail(linkedUser.email) === normalizeEmail(process.env.ADMIN_EMAIL)) {
            linkedUser.role = "admin"
        }

        await linkedUser.save()

        res.json(issueAuthPayload(linkedUser))
    } catch (err) {
        console.error("verifyOtp error:", err)
        res.status(500).json({ error: err.message })
    }
}
