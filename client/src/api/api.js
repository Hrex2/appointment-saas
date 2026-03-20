import axios from "axios"

const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/+$/, "")

const api = axios.create({
    baseURL: `${baseUrl}/api`
})

// Automatically attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

export default api
