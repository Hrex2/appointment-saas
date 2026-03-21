const User = require("../models/User")
const { normalizeEmail } = require("../utils/helpers")
const { createCheckoutSession, serializePlans } = require("../services/subscriptionService")
const { getPlanByKey } = require("../services/planService")

const resolveCurrentUser = async (req) => {
    if (req.user?.userId) {
        return User.findById(req.user.userId)
    }

    if (req.user?.email) {
        return User.findOne({ email: normalizeEmail(req.user.email) })
    }

    return null
}

exports.listPlans = async (_req, res) => {
    try {
        res.json(await serializePlans())
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getMySubscription = async (req, res) => {
    try {
        const user = await resolveCurrentUser(req)

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        res.json(user.subscription)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.createCheckout = async (req, res) => {
    try {
        const user = await resolveCurrentUser(req)
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const { planKey } = req.body
        const session = await createCheckoutSession({ planKey, user })
        res.json(session)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.changePlan = async (req, res) => {
    try {
        const user = await resolveCurrentUser(req)
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const { planKey } = req.body
        const plan = await getPlanByKey(planKey)

        if (!plan) {
            return res.status(404).json({ message: "Plan not found" })
        }

        const now = new Date()
        const nextPaymentDate = plan.priceMonthly > 0
            ? new Date(now.getTime() + 30 * 24 * 60 * 60000)
            : null

        user.subscription = {
            ...user.subscription.toObject(),
            planKey: plan.key,
            planName: plan.name,
            tierLevel: plan.tierLevel,
            status: "active",
            nextPaymentDate,
            currentPeriodEnd: nextPaymentDate,
            usage: {
                appointmentCount: user.subscription?.usage?.appointmentCount || 0,
                appointmentLimit: plan.appointmentLimit
            }
        }

        await user.save()

        res.json({
            message: "Plan updated successfully",
            subscription: user.subscription
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
