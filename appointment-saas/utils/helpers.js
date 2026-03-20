const mongoose = require("mongoose")

const normalizeEmail = (value = "") => value.trim().toLowerCase()

const normalizePhone = (value = "") => {
    const trimmed = String(value || "").trim()

    if (!trimmed) {
        return ""
    }

    if (trimmed.startsWith("whatsapp:")) {
        const normalized = trimmed.slice("whatsapp:".length).replace(/\s+/g, "")
        return `whatsapp:${normalized}`
    }

    return trimmed.replace(/\s+/g, "")
}

const formatWhatsAppPhone = (value = "") => {
    const normalizedPhone = normalizePhone(value)

    if (!normalizedPhone) {
        return ""
    }

    return normalizedPhone.startsWith("whatsapp:")
        ? normalizedPhone
        : `whatsapp:${normalizedPhone}`
}

const buildLegacyIdentityClauses = (user) => {
    const clauses = []

    if (user?._id) {
        clauses.push({ userId: user._id })
    }

    if (user?.email) {
        clauses.push({ email: normalizeEmail(user.email) })
    }

    if (user?.phone) {
        clauses.push({ email: normalizePhone(user.phone) })
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
    normalizePhone,
    formatWhatsAppPhone,
    buildLegacyIdentityClauses,
    buildAppointmentIdentifierClauses,
    generateSixDigitCode
}
