import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CalendarClock, MessageCircleHeart, Sparkles } from "lucide-react"
import { getDashboardOverview } from "../api/dashboardApi"
import { listAppointments } from "../api/appointmentApi"
import AppointmentCard from "../components/AppointmentCard"

const Dashboard = () => {
    const [overview, setOverview] = useState({ metrics: [], upcomingAppointments: [], automationPreview: {} })
    const [recentAppointments, setRecentAppointments] = useState([])

    useEffect(() => {
        const load = async () => {
            const [overviewResponse, appointmentsResponse] = await Promise.all([
                getDashboardOverview(),
                listAppointments({ scope: "upcoming" })
            ])

            setOverview(overviewResponse.data)
            setRecentAppointments(appointmentsResponse.data.slice(0, 4))
        }

        load().catch(console.error)
    }, [])

    return (
        <div className="space-y-6">
            <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card neon-border overflow-hidden p-8"
            >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">Analytics + automation</p>
                        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
                            A high-contrast appointment command center for teams that run on reminders and revenue.
                        </h1>
                        <p className="mt-4 text-base leading-7 text-slate-400">
                            Track bookings, no-shows, revenue performance, and subscription usage while keeping WhatsApp automation within easy reach.
                        </p>
                    </div>

                    <div className="grid gap-3 text-sm text-slate-300">
                        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
                            Plan status: <span className="font-semibold text-cyan-200">{overview.automationPreview?.planStatus || "active"}</span>
                        </div>
                        <div className="rounded-2xl border border-pink-400/20 bg-pink-400/10 px-4 py-3">
                            Follow-ups: <span className="font-semibold text-pink-100">{overview.automationPreview?.followUpsEnabled ? "Enabled" : "Locked on higher tiers"}</span>
                        </div>
                    </div>
                </div>
            </motion.section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {overview.metrics.map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="soft-card p-5"
                    >
                        <p className="text-sm text-slate-400">{metric.label}</p>
                        <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
                    </motion.div>
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
                <div className="glass-card p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Upcoming appointment logs</h2>
                            <p className="mt-2 text-sm text-slate-400">Default dashboard feed with live booking visibility.</p>
                        </div>
                        <CalendarClock className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div className="space-y-4">
                        {recentAppointments.map((appointment) => (
                            <AppointmentCard key={appointment.id} appointment={appointment} />
                        ))}
                        {!recentAppointments.length && (
                            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center text-slate-400">
                                No upcoming appointments yet.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="soft-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                                <MessageCircleHeart className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">WhatsApp automation</h3>
                                <p className="text-sm text-slate-400">Confirmation, reminder, and plan expiry notification channels.</p>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3 text-sm text-slate-300">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Booking confirmations route through the WhatsApp flow.</div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Reminder-ready architecture is available for Basic and above plans.</div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Follow-up messaging unlocks on Pro and Premium.</div>
                        </div>
                    </div>

                    <div className="soft-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-pink-400/10 p-3 text-pink-300">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Monetization layer</h3>
                                <p className="text-sm text-slate-400">Plans, usage caps, and Stripe-ready upgrade flows.</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-400">
                            Upgrade flows are already connected to the backend plan catalog, with Stripe checkout support when price ids and secret keys are configured.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Dashboard
