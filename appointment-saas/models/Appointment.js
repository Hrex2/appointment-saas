/**
 * PURPOSE:
 * Store appointment with user reference
 */

const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true // ✅ ensure every appointment belongs to a user
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["booked", "cancelled", "changed"], // ✅ restrict values
        default: "booked"
    }
}, { timestamps: true })

module.exports = mongoose.model("Appointment", appointmentSchema)