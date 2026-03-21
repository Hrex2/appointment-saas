const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const controller = require("../controllers/subscriptionController")

router.get("/plans", controller.listPlans)
router.get("/me", auth, controller.getMySubscription)
router.post("/checkout", auth, controller.createCheckout)
router.post("/change", auth, controller.changePlan)

module.exports = router
