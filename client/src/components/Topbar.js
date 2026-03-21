import React from "react"
import { Bell, Search } from "lucide-react"
import { useLocation } from "react-router-dom"
import ProfileDropdown from "./ProfileDropdown"

const pageTitles = {
    "/": "Appointment dashboard",
    "/business-settings": "Business settings",
    "/appointment-settings": "Appointment settings",
    "/calendar": "Calendar view",
    "/profile": "Profile & subscription"
}

const Topbar = () => {
    const location = useLocation()
    const user = JSON.parse(localStorage.getItem("sessionUser") || "null")

    return (
        <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[#070b14]/70 px-4 py-4 backdrop-blur-2xl lg:left-80 lg:px-10">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Control Center</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{pageTitles[location.pathname] || "Appointment SaaS"}</h2>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:flex">
                        <Search className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-400">Search customers, plans, or appointments</span>
                    </div>

                    <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-200">
                        <Bell className="h-5 w-5" />
                    </button>

                    <ProfileDropdown user={user} />
                </div>
            </div>
        </header>
    )
}

export default Topbar
