import api from "./api"

// CREATE
export const createAppointment = (data) => {
    return api.post("/appointments", data)
}

// GET
export const getAppointment = (id) => {
    return api.get(`/appointments/${id}`)
}

// UPDATE
export const updateAppointment = (id, data) => {
    return api.put(`/appointments/${id}`, data)
}

// DELETE
export const cancelAppointment = (id) => {
    return api.delete(`/appointments/${id}`)
}

export const getAllAppointments = () => {
    return axios.get(BASE_URL, {
        headers: {
            Authorization: localStorage.getItem("token")
        }
    })
}