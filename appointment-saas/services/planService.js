const Plan = require("../models/Plan")

const DEFAULT_PLANS = [
    {
        key: "free",
        name: "Free",
        tierLevel: 0,
        priceMonthly: 0,
        appointmentLimit: 25,
        features: ["25 monthly appointments", "Dashboard access", "Manual reminders"],
        reminderAutomation: false,
        followUps: false,
        analyticsAccess: true
    },
    {
        key: "basic",
        name: "Basic",
        tierLevel: 1,
        priceMonthly: 999,
        appointmentLimit: 150,
        features: ["150 monthly appointments", "WhatsApp reminders", "Calendar automation"],
        reminderAutomation: true,
        followUps: false,
        analyticsAccess: true
    },
    {
        key: "pro",
        name: "Pro",
        tierLevel: 2,
        priceMonthly: 2499,
        appointmentLimit: 999999,
        features: ["Unlimited appointments", "Automation flows", "Advanced analytics"],
        reminderAutomation: true,
        followUps: true,
        analyticsAccess: true
    },
    {
        key: "premium",
        name: "Premium",
        tierLevel: 3,
        priceMonthly: 4999,
        appointmentLimit: 999999,
        features: ["Unlimited appointments", "Priority support", "Follow-up campaigns"],
        reminderAutomation: true,
        followUps: true,
        analyticsAccess: true
    }
]

const ensureDefaultPlans = async () => {
    await Promise.all(
        DEFAULT_PLANS.map((plan) =>
            Plan.findOneAndUpdate(
                { key: plan.key },
                { $set: plan },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )
        )
    )
}

const getPlanByKey = async (key) => {
    await ensureDefaultPlans()
    return Plan.findOne({ key, active: true })
}

const getAllPlans = async () => {
    await ensureDefaultPlans()
    return Plan.find({ active: true }).sort({ tierLevel: 1 })
}

module.exports = {
    DEFAULT_PLANS,
    ensureDefaultPlans,
    getPlanByKey,
    getAllPlans
}
