// middleware/logger.js

/**
 * PURPOSE:
 * Logs every request
 * HELPS DEBUG:
 * - what input came
 * - which route hit
 */

module.exports = (req, res, next) => {
    const body = { ...req.body }

    // Avoid logging sensitive auth payloads into production logs.
    if (typeof body.otp !== "undefined") {
        body.otp = "[REDACTED]"
    }

    console.log(`Request: ${req.method} ${req.url}`)
    console.log("Body:", body)
    next()
}
