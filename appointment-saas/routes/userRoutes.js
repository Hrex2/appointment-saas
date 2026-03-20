const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const admin = require("../middleware/adminMiddleware")
const { listUsers, createOrUpdateUser } = require("../controllers/userController")

router.get("/", auth, admin, listUsers)
router.post("/", auth, admin, createOrUpdateUser)

module.exports = router
