import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sendOtp, verifyOtp } from "../api/authApi"

const Login = () => {
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [phone, setPhone] = useState("")
    const [channel, setChannel] = useState("whatsapp")
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const navigate = useNavigate()

    const handleSendOtp = async () => {
        if (!email) {
            setError("Enter your email to start login.")
            return
        }

        if (channel === "whatsapp" && !phone) {
            setError("Enter your WhatsApp phone to receive the OTP there.")
            return
        }

        try {
            setLoading(true)
            setError("")
            setMessage("")
            const res = await sendOtp({ email, phone, channel })
            setMessage(res.data.message || "OTP sent.")
            setStep(2)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.error || err.response?.data?.message || "We couldn't send the OTP right now. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp || !phone) {
            setError("Enter both the OTP and the WhatsApp-enabled phone number.")
            return
        }

        try {
            setLoading(true)
            setError("")
            setMessage("")

            const res = await verifyOtp({
                email,
                otp,
                phone
            })

            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", JSON.stringify(res.data.user || {}))
            localStorage.setItem("userRole", res.data.user?.role || "user")
            setMessage("Login successful. Redirecting to your dashboard.")
            navigate("/")
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.error || err.response?.data?.message || "The OTP was invalid or expired. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="app-shell auth-shell">
            <div className="auth-card">
                <p className="eyebrow">Appointment SaaS</p>
                <h1 className="hero-title">Sign in with WhatsApp-first OTP.</h1>
                <p className="hero-copy">
                    Admins can create user accounts, and users can receive login codes directly on WhatsApp.
                </p>

                <div className="stack-lg" style={{ marginTop: "28px" }}>
                    <div className="stack">
                        <label className="field-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            className="field"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="stack">
                        <label className="field-label" htmlFor="phone">WhatsApp phone</label>
                        <input
                            id="phone"
                            className="field"
                            placeholder="whatsapp:+91XXXXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    {step === 1 && (
                        <div className="stack">
                            <label className="field-label" htmlFor="channel">OTP delivery</label>
                            <select
                                id="channel"
                                className="field"
                                value={channel}
                                onChange={(e) => setChannel(e.target.value)}
                            >
                                <option value="whatsapp">WhatsApp</option>
                                <option value="email">Email</option>
                            </select>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="stack">
                            <label className="field-label" htmlFor="otp">One-time password</label>
                            <input
                                id="otp"
                                className="field"
                                placeholder="Enter the OTP you received"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                    )}

                    {message && <p className="message message-success">{message}</p>}
                    {error && <p className="message message-error">{error}</p>}

                    <div className="button-row">
                        {step === 1 ? (
                            <button className="btn btn-primary" onClick={handleSendOtp} disabled={loading}>
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        ) : (
                            <>
                                <button className="btn btn-primary" onClick={handleVerifyOtp} disabled={loading}>
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setStep(1)
                                        setOtp("")
                                        setError("")
                                        setMessage("")
                                    }}
                                    disabled={loading}
                                >
                                    Edit details
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
