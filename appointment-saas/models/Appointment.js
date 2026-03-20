const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    appointmentCode: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String
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
        enum: ["booked", "cancelled", "changed"],
        default: "booked"
    }
}, { timestamps: true })

module.exports = mongoose.model("Appointment", appointmentSchema)
