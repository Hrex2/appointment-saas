import api from "./api"

export const sendOtp = ({ email, phone, channel }) => {
    return api.post("/auth/send-otp", { email, phone, channel })
}

export const verifyOtp = ({ email, otp, phone }) => {
    return api.post("/auth/verify-otp", { email, otp, phone })
}
