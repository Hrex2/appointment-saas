import api from "./api"

export const getUsers = () => api.get("/users")

export const saveUser = (data) => api.post("/users", data)
