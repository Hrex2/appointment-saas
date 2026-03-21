const express = require("express")
const router = express.Router()

const controller = require("../controllers/appointmentController")
const auth = require("../middleware/authMiddleware")

router.get("/", auth, controller.getUserAppointments)
router.post("/", auth, controller.createAppointment)
router.get("/:id", auth, controller.getAppointment)
router.put("/:id", auth, controller.updateAppointment)
router.delete("/:id", auth, controller.cancelAppointment)

module.exports = router
