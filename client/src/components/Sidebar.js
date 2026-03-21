import React from "react"
import { CalendarDays, CreditCard, LayoutDashboard, Settings2, UserCircle2 } from "lucide-react"
import { NavLink } from "react-router-dom"

const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/business-settings", label: "Business Settings", icon: Settings2 },
    { to: "/appointment-settings", label: "Appointment Settings", icon: CreditCard },
    { to: "/calendar", label: "Calendar View", icon: CalendarDays },
    { to: "/profile", label: "Profile", icon: UserCircle2 }
]

const Sidebar = () => {
    return (
        <aside className="hidden w-80 shrink-0 border-r border-white/10 bg-black/20 p-6 backdrop-blur-2xl lg:block">
            <div className="glass-card neon-border flex h-full flex-col p-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.38em] text-cyan-300">Neon SaaS</p>
                    <h1 className="mt-3 text-3xl font-semibold text-white">Appointment OS</h1>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        Manage bookings, customers, automation, and subscriptions from one high-contrast command center.
                    </p>
                </div>

                <nav className="mt-10 flex flex-1 flex-col gap-3">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/"}
                            className={({ isActive }) =>
                                [
                                    "group flex items-center gap-4 rounded-2xl border px-4 py-3 transition duration-200",
                                    isActive
                                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-neon"
                                        : "border-white/5 bg-white/5 text-slate-300 hover:border-cyan-400/20 hover:bg-white/10"
                                ].join(" ")
                            }
                        >
                            <span className="rounded-xl bg-white/5 p-2">
                                <Icon className="h-5 w-5" />
                            </span>
                            <span className="text-sm font-medium">{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm text-emerald-100">
                    <p className="font-semibold">Automation Ready</p>
                    <p className="mt-2 text-emerald-100/80">
                        WhatsApp confirmations, reminders, and plan expiry alerts are wired into the platform architecture.
                    </p>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
