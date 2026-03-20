// middleware/logger.js

/**
 * PURPOSE:
 * Logs every request
 * HELPS DEBUG:
 * - what input came
 * - which route hit
 */

module.exports = (req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`)
    console.log("Body:", req.body)
    next()
}