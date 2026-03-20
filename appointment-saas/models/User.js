const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    phone: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    otp: String,
    otpExpiry: Date,
    step: {
        type: String,
        default: "start"
    },
    tempName: String,
    tempDate: String
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
