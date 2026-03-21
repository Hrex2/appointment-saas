const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const controller = require("../controllers/businessController")

router.get("/", auth, controller.getBusinessSettings)
router.put("/", auth, controller.updateBusinessSettings)

module.exports = router
