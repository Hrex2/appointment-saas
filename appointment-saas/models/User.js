// models/User.js

/**
 * PURPOSE:
 * Store user login data
 * INPUT:
 * - email
 * - otp
 * - otp expiry
 */
/**
 * PURPOSE:
 * Store user login + WhatsApp number
 */

const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true // ✅ allows null values
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        default: ""
    },

    // 🔐 OTP (for website login)
    otp: String,
    otpExpiry: Date,

    // 🤖 Chatbot state
    step: {
        type: String,
        default: "start"
    },

    // 🧠 Temporary data for booking
    tempName: String,
    tempDate: String

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
