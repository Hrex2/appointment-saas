import api from "./api"

export const sendOtp = ({ email, phone, channel = "whatsapp" }) =>
    api.post("/auth/send-otp", { email, phone, channel })

export const verifyOtp = ({ email, otp, phone }) =>
    api.post("/auth/verify-otp", { email, otp, phone })
