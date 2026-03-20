/**
 * PURPOSE:
 * Protect routes using JWT
 */

const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: "No token" })
    }

    // ✅ Support "Bearer <token>"
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded // attach user info
        next()

    } catch (err) {
        return res.status(401).json({ message: "Invalid token" })
    }
}
