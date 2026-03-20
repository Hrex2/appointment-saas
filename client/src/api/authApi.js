import api from "./api"

export const sendOtp = (email) => {
    return api.post("/auth/send-otp", { email })
}

export const verifyOtp = ({ email, otp, phone }) => {
    return api.post("/auth/verify-otp", { email, otp, phone })
}
