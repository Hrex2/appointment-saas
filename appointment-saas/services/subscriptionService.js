const Stripe = require("stripe")
const { getAllPlans, getPlanByKey } = require("./planService")

const hasStripe = () =>
    Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLIC_KEY)

const getStripeClient = () => {
    if (!hasStripe()) {
        return null
    }

    return new Stripe(process.env.STRIPE_SECRET_KEY)
}

const createCheckoutSession = async ({ planKey, user }) => {
    const plan = await getPlanByKey(planKey)

    if (!plan) {
        throw new Error("Plan not found")
    }

    if (plan.key === "free") {
        return {
            mode: "internal",
            url: `${process.env.APP_URL || "http://localhost:3000"}/profile?plan=free`
        }
    }

    const stripe = getStripeClient()
    if (!stripe || !plan.stripePriceId) {
        return {
            mode: "pending-configuration",
            url: `${process.env.APP_URL || "http://localhost:3000"}/profile?upgrade=${plan.key}`
        }
    }

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: user.email,
        success_url: `${process.env.APP_URL || "http://localhost:3000"}/profile?checkout=success`,
        cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/profile?checkout=cancelled`,
        line_items: [
            {
                price: plan.stripePriceId,
                quantity: 1
            }
        ],
        metadata: {
            planKey: plan.key,
            userId: String(user._id)
        }
    })

    return {
        mode: "stripe",
        url: session.url
    }
}

const serializePlans = async () => {
    const plans = await getAllPlans()
    return plans.map((plan) => ({
        id: plan._id,
        key: plan.key,
        name: plan.name,
        tierLevel: plan.tierLevel,
        priceMonthly: plan.priceMonthly,
        currency: plan.currency,
        appointmentLimit: plan.appointmentLimit,
        features: plan.features,
        reminderAutomation: plan.reminderAutomation,
        followUps: plan.followUps,
        analyticsAccess: plan.analyticsAccess
    }))
}

module.exports = {
    createCheckoutSession,
    serializePlans
}
