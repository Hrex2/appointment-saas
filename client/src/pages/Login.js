import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sendOtp, verifyOtp } from "../api/authApi"

const Login = () => {

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [phone, setPhone] = useState("")
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const navigate = useNavigate()

    const handleSendOtp = async () => {
        if (!email) {
            setError("Enter your email to receive a one-time password.")
            return
        }

        try {
            setLoading(true)
            setError("")
            setMessage("")
            await sendOtp(email)
            setMessage("OTP sent. Check your inbox and continue with verification.")
            setStep(2)
        } catch (err) {
            console.error(err)
            setError("We couldn't send the OTP right now. Please try again.")
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
            setMessage("Login successful. Redirecting to your dashboard.")
            navigate("/")
        } catch (err) {
            console.error(err)
            setError("The OTP was invalid or expired. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="app-shell auth-shell">
            <div className="auth-card">
                <p className="eyebrow">Appointment SaaS</p>
                <h1 className="hero-title">Sign in with a quick OTP flow.</h1>
                <p className="hero-copy">
                    Use your email to receive a one-time password, then confirm your phone number
                    to reach the dashboard.
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

                    {step === 2 && (
                        <>
                            <div className="stack">
                                <label className="field-label" htmlFor="otp">One-time password</label>
                                <input
                                    id="otp"
                                    className="field"
                                    placeholder="Enter the OTP from your email"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
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
                        </>
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
                                        setPhone("")
                                        setError("")
                                        setMessage("")
                                    }}
                                    disabled={loading}
                                >
                                    Edit email
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
