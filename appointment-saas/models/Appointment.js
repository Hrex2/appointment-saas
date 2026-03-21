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
    email: String,
    name: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        default: ""
    },
    service: {
        type: String,
        default: "Consultation"
    },
    notes: {
        type: String,
        default: ""
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    durationMinutes: {
        type: Number,
        default: 30
    },
    fee: {
        type: Number,
        default: 0
    },
    startAt: {
        type: Date,
        index: true
    },
    endAt: Date,
    slotKey: {
        type: String,
        index: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled", "no-show", "booked", "changed"],
        default: "confirmed"
    },
    source: {
        type: String,
        enum: ["dashboard", "whatsapp", "api"],
        default: "dashboard"
    },
    reminderSent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

appointmentSchema.index({ userId: 1, startAt: 1 })

module.exports = mongoose.model("Appointment", appointmentSchema)
