import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

// 🔥 CHANGE THIS to your deployed backend
const API = "https://appointment-saas-gjwu.onrender.com"

const Login = () => {

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [phone, setPhone] = useState("")
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    // STEP 1: SEND OTP
    const sendOtp = async () => {

        if (!email) {
            alert("Enter email first")
            return
        }

        try {
            setLoading(true)

            await axios.post(`${API}/api/auth/send-otp`, { email })

            alert("OTP sent to email")
            setStep(2)

        } catch (err) {
            console.error(err)
            alert("Error sending OTP")
        } finally {
            setLoading(false)
        }
    }

    // STEP 2: VERIFY OTP
    const verifyOtp = async () => {

        if (!otp || !phone) {
            alert("Enter OTP and phone")
            return
        }

        try {
            setLoading(true)

            const res = await axios.post(
                `${API}/api/auth/verify-otp`,
                {
                    email,
                    otp,
                    phone
                }
            )

            localStorage.setItem("token", res.data.token)

            alert("Login success")
            navigate("/")

        } catch (err) {
            console.error(err)
            alert("Invalid OTP or error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>Login</h2>

            {/* STEP 1 */}
            {step === 1 && (
                <>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: "10px", width: "250px" }}
                    />

                    <br /><br />

                    <button onClick={sendOtp} disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
                <>
                    <input
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{ padding: "10px", width: "250px" }}
                    />

                    <br /><br />

                    <input
                        placeholder="Phone (whatsapp:+91XXXXXXXXXX)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ padding: "10px", width: "250px" }}
                    />

                    <br /><br />

                    <button onClick={verifyOtp} disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </>
            )}
        </div>
    )
}

export default Login
