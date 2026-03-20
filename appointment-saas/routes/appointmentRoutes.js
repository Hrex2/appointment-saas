/**
 * PURPOSE:
 * Defines API endpoints
 * CONNECTS:
 * Routes → Controllers
 */

const express = require("express")
const router = express.Router()

const controller = require("../controllers/appointmentController")
const auth = require("../middleware/authMiddleware") // ✅ import middleware

// 🔐 Protected Routes
router.get("/", auth, controller.getUserAppointments)
// Create
router.post("/", auth, controller.createAppointment)

// Get
router.get("/:id", auth, controller.getAppointment)

// Update
router.put("/:id", auth, controller.updateAppointment)

// Cancel
router.delete("/:id", auth, controller.cancelAppointment)

module.exports = router