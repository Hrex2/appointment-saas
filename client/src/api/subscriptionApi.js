import api from "./api"

export const listPlans = () => api.get("/subscriptions/plans")
export const getMySubscription = () => api.get("/subscriptions/me")
export const createCheckout = (planKey) => api.post("/subscriptions/checkout", { planKey })
export const changePlan = (planKey) => api.post("/subscriptions/change", { planKey })
