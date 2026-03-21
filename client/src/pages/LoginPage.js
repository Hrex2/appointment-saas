import React, { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { MessageSquareMore, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { sendOtp, verifyOtp } from "../api/authApi"

const waves = [0, 1, 2]

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const glowVariants = useMemo(() => [
        "rgba(56,189,248,0.20)",
        "rgba(168,85,247,0.18)",
        "rgba(236,72,153,0.14)"
    ], [])

    const handleSendOtp = async () => {
        try {
            setLoading(true)
            setError("")
            setMessage("")
            await sendOtp({ email, phone, channel: "whatsapp" })
            setOtpSent(true)
            setMessage("OTP sent to your WhatsApp number.")
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || "Unable to send OTP")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        try {
            setLoading(true)
            setError("")
            setMessage("")
            const response = await verifyOtp({ email, otp, phone })
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("sessionUser", JSON.stringify(response.data.user))
            setMessage("Login successful. Redirecting to your dashboard...")
            setTimeout(() => navigate("/"), 700)
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || "Unable to verify OTP")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04070d] px-4 py-10">
            <div className="absolute inset-0 bg-neon-grid bg-grid opacity-30" />

            {waves.map((wave) => (
                <motion.div
                    key={wave}
                    animate={{ scale: [1, 1.18, 1], opacity: [0.26, 0.1, 0.22] }}
                    className="absolute h-[28rem] w-[28rem] rounded-full blur-3xl"
                    style={{
                        left: `${12 + wave * 24}%`,
                        top: `${10 + wave * 14}%`,
                        background: `radial-gradient(circle, ${glowVariants[wave]}, transparent 65%)`
                    }}
                    transition={{ duration: otpSent ? 1.2 : 5.5, repeat: Infinity, delay: wave * 0.6 }}
                />
            ))}

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card neon-border relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 p-8"
            >
                <div className="mb-8 flex items-center gap-3">
                    <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                        <MessageSquareMore className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">Dark Neon SaaS</p>
                        <h1 className="mt-2 text-3xl font-semibold text-white">WhatsApp OTP login</h1>
                    </div>
                </div>

                <p className="mb-6 text-sm leading-6 text-slate-400">
                    Secure your business dashboard with WhatsApp OTP verification, neon motion cues, and subscription-ready account sessions.
                </p>

                <div className="space-y-5">
                    <div>
                        <label className="label-shell">Email</label>
                        <input className="input-shell" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="founder@brand.com" />
                    </div>
                    <div>
                        <label className="label-shell">WhatsApp number</label>
                        <input className="input-shell" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="whatsapp:+919876543210" />
                    </div>

                    {otpSent && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <label className="label-shell">OTP</label>
                            <input className="input-shell" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter the 6-digit OTP" />
                        </motion.div>
                    )}

                    {message && (
                        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-2xl border border-pink-400/20 bg-pink-400/10 px-4 py-3 text-sm text-pink-100">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        {!otpSent ? (
                            <button className="button-primary flex-1" disabled={loading} onClick={handleSendOtp}>
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        ) : (
                            <>
                                <button className="button-primary flex-1" disabled={loading} onClick={handleVerifyOtp}>
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>
                                <button className="button-secondary" disabled={loading} onClick={() => setOtpSent(false)}>
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2 text-cyan-200">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-medium">Included UX details</span>
                    </div>
                    <p className="mt-2 leading-6 text-slate-400">
                        Animated neon waves pulse on OTP send, and successful verification transitions directly into the protected dashboard shell.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default LoginPage
