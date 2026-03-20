const mongoose = require("mongoose")

const normalizeEmail = (value = "") => value.trim().toLowerCase()

const buildLegacyIdentityClauses = (user) => {
    const clauses = []

    if (user?._id) {
        clauses.push({ userId: user._id })
    }

    if (user?.email) {
        clauses.push({ email: normalizeEmail(user.email) })
    }

    if (user?.phone) {
        clauses.push({ email: user.phone })
    }

    return clauses
}

const buildAppointmentIdentifierClauses = (identifier) => {
    const trimmed = String(identifier || "").trim()
    const clauses = []

    if (/^\d{6}$/.test(trimmed)) {
        clauses.push({ appointmentCode: trimmed })
    }

    if (mongoose.Types.ObjectId.isValid(trimmed)) {
        clauses.push({ _id: trimmed })
    }

    return clauses
}

const generateSixDigitCode = () =>
    String(Math.floor(100000 + Math.random() * 900000))

module.exports = {
    normalizeEmail,
    buildLegacyIdentityClauses,
    buildAppointmentIdentifierClauses,
    generateSixDigitCode
}
