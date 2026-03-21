const { formatWhatsAppPhone } = require("../utils/helpers")

const buildReminderPreview = (appointment) =>
    `Reminder: ${appointment.name} is scheduled on ${appointment.date} at ${appointment.time}.`

const buildConfirmationPreview = (appointment) =>
    `Confirmed: ${appointment.name} is booked for ${appointment.date} at ${appointment.time}.`

const buildPlanExpiryPreview = (user) =>
    `Plan alert: ${user.subscription.planName} renews on ${user.subscription.nextPaymentDate || "soon"}.`

const previewNotificationPayload = (user, appointment) => ({
    whatsappTo: formatWhatsAppPhone(user.phone || user.businessSettings?.whatsappNumber),
    reminder: appointment ? buildReminderPreview(appointment) : null,
    confirmation: appointment ? buildConfirmationPreview(appointment) : null,
    planExpiry: buildPlanExpiryPreview(user)
})

module.exports = {
    previewNotificationPayload
}
