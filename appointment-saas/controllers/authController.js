const User = require("../models/User")
const { sendOTP } = require("../services/emailService")
const jwt = require("jsonwebtoken")
const { normalizeEmail } = require("../utils/helpers")

const generateOTP = () => Math.floor(100000 + Math.random() * 900000)
const isAdminBypassEnabled = () => process.env.ADMIN_BYPASS_ENABLED === "true"
const isAdminBypassUser = (email) =>
    isAdminBypassEnabled() &&
    normalizeEmail(email) === normalizeEmail(process.env.ADMIN_EMAIL) &&
    process.env.ADMIN_BYPASS_CODE

const linkUserByPhone = async (user, phone) => {
    if (!phone) {
        return user
    }

    const phoneOwner = await User.findOne({ phone })

    if (!phoneOwner || String(phoneOwner._id) === String(user._id)) {
        user.phone = phone
        return user
    }

    if (phoneOwner.email && normalizeEmail(phoneOwner.email) !== normalizeEmail(user.email)) {
        throw new Error("This phone number is already linked to another account")
    }

    phoneOwner.email = user.email
    phoneOwner.phone = phone
    phoneOwner.otp = null
    phoneOwner.otpExpiry = null

    if (!phoneOwner.name && user.name) {
        phoneOwner.name = user.name
    }

    await phoneOwner.save()
    await User.deleteOne({ _id: user._id })

    return phoneOwner
}

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        console.log("sendOtp:start", { email })

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        if (isAdminBypassUser(email)) {
            console.log("sendOtp:admin-bypass-available", { email })
            return res.json({ message: "Admin bypass enabled" })
        }

        const otp = generateOTP()
        console.log("sendOtp:otp-generated")

        let user = await User.findOne({ email: normalizeEmail(email) })
        console.log("sendOtp:user-looked-up", { exists: !!user })

        if (!user) {
            user = new User({ email: normalizeEmail(email) })
            console.log("sendOtp:user-created")
        }

        user.otp = otp
        user.otpExpiry = Date.now() + 5 * 60 * 1000

        await user.save()
        console.log("sendOtp:user-saved")

        await sendOTP(email, otp)
        console.log("sendOtp:email-sent")

        res.json({ message: "OTP sent" })
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
            console.log("verifyOtp:admin-bypass-success", { email })

            let user = await User.findOne({ email: normalizeEmail(email) })

            if (!user) {
                user = new User({ email: normalizeEmail(email) })
            }

            user = await linkUserByPhone(user, phone)
            await user.save()

            const token = jwt.sign(
                { email: user.email, userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            )

            return res.json({
                message: "Admin bypass login successful",
                token
            })
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
        await linkedUser.save()

        const token = jwt.sign(
            { email: linkedUser.email, userId: linkedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.json({
            message: "Login successful",
            token
        })
    } catch (err) {
        console.error("verifyOtp error:", err)
        res.status(500).json({ error: err.message })
    }
}
