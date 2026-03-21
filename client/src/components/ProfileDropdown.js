import React, { useEffect, useRef, useState } from "react"
import { ChevronDown, LogOut, User2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const ProfileDropdown = ({ user }) => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const containerRef = useRef(null)

    useEffect(() => {
        const handleOutside = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleOutside)
        return () => document.removeEventListener("mousedown", handleOutside)
    }, [])

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("sessionUser")
        navigate("/login")
    }

    return (
        <div className="relative" ref={containerRef}>
            <button
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-left transition hover:border-cyan-400/30 hover:bg-white/10"
                onClick={() => setOpen((value) => !value)}
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-purple-500/30 text-cyan-100">
                    <User2 className="h-5 w-5" />
                </div>
                <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-white">{user?.name || "Account"}</p>
                    <p className="text-xs text-slate-400">{user?.email || "Manage profile"}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {open && (
                <div className="absolute right-0 z-40 mt-3 w-64 rounded-3xl border border-white/10 bg-[#08111d]/95 p-3 shadow-2xl backdrop-blur-xl">
                    <Link
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5"
                        onClick={() => setOpen(false)}
                        to="/profile"
                    >
                        <User2 className="h-4 w-4" />
                        View Profile
                    </Link>
                    <button
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-pink-100 transition hover:bg-pink-500/10"
                        onClick={logout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileDropdown
