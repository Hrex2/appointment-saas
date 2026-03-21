import React, { useEffect, useState } from "react"
import { CreditCard, Sparkles, UserCircle2 } from "lucide-react"
import { getProfile } from "../api/profileApi"
import { createCheckout, listPlans } from "../api/subscriptionApi"

const ProfilePage = () => {
    const [profile, setProfile] = useState(null)
    const [plans, setPlans] = useState([])
    const [message, setMessage] = useState("")

    const load = async () => {
        const [profileResponse, plansResponse] = await Promise.all([
            getProfile(),
            listPlans()
        ])
        setProfile(profileResponse.data)
        setPlans(plansResponse.data)
    }

    useEffect(() => {
        load().catch(console.error)
    }, [])

    const handleUpgrade = async (planKey) => {
        const session = await createCheckout(planKey)
        if (session.data.url) {
            window.open(session.data.url, "_blank", "noopener,noreferrer")
            setMessage("Checkout flow opened in a new tab.")
        }
    }

    if (!profile) {
        return <div className="glass-card p-8 text-slate-300">Loading profile...</div>
    }

    const { user, subscription, notifications } = profile

    return (
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-6">
                <div className="glass-card neon-border p-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-3xl bg-cyan-400/10 p-4 text-cyan-300">
                            <UserCircle2 className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-white">{user.name || "Account owner"}</h1>
                            <p className="text-sm text-slate-400">{user.email || "No email"}</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4 text-sm text-slate-300">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">WhatsApp number: {user.phone || "Not linked yet"}</div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Account created: {new Date(user.createdAt).toLocaleDateString()}</div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Role: {user.role}</div>
                    </div>
                </div>

                <div className="soft-card p-6">
                    <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-pink-300" />
                        <h2 className="text-lg font-semibold text-white">Subscription snapshot</h2>
                    </div>
                    <div className="mt-5 space-y-3 text-sm text-slate-300">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Plan: {subscription.planName}</div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Tier level: {subscription.tierLevel}</div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Status: {subscription.status}</div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            Next payment date: {subscription.nextPaymentDate ? new Date(subscription.nextPaymentDate).toLocaleDateString() : "Free plan"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="glass-card p-6">
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-cyan-300" />
                        <div>
                            <h2 className="text-xl font-semibold text-white">Plans and monetization</h2>
                            <p className="text-sm text-slate-400">Upgrade or downgrade with Stripe-ready checkout sessions and backend usage limits.</p>
                        </div>
                    </div>

                    {message && (
                        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                            {message}
                        </div>
                    )}

                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        {plans.map((plan) => (
                            <div key={plan.key} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xl font-semibold text-white">{plan.name}</p>
                                        <p className="mt-1 text-sm text-slate-400">Tier {plan.tierLevel}</p>
                                    </div>
                                    <div className="rounded-2xl bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-200">
                                        {plan.priceMonthly === 0 ? "Free" : `₹${plan.priceMonthly}/mo`}
                                    </div>
                                </div>

                                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                                    {plan.features.map((feature) => (
                                        <li key={feature}>• {feature}</li>
                                    ))}
                                    <li>• Appointment limit: {plan.appointmentLimit === 999999 ? "Unlimited" : plan.appointmentLimit}</li>
                                </ul>

                                <button className="button-primary mt-5 w-full" onClick={() => handleUpgrade(plan.key)}>
                                    {subscription.planKey === plan.key ? "Current plan" : "Upgrade"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="soft-card p-6">
                    <h2 className="text-lg font-semibold text-white">Notification system</h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-300">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">WhatsApp destination: {notifications.whatsappTo || "Configure a number in settings"}</div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Plan expiry alert preview: {notifications.planExpiry}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
