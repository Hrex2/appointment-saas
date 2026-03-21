const mongoose = require("mongoose")

const planSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    tierLevel: {
        type: Number,
        required: true
    },
    priceMonthly: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: "INR"
    },
    appointmentLimit: {
        type: Number,
        default: 25
    },
    features: {
        type: [String],
        default: []
    },
    reminderAutomation: {
        type: Boolean,
        default: false
    },
    followUps: {
        type: Boolean,
        default: false
    },
    analyticsAccess: {
        type: Boolean,
        default: true
    },
    stripePriceId: String,
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Plan", planSchema)
