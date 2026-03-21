import api from "./api"

export const getBusinessSettings = () => api.get("/business")
export const updateBusinessSettings = (payload) => api.put("/business", payload)
