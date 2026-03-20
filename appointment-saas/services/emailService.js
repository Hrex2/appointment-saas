// services/emailService.js

/**
 * PURPOSE:
 * Send OTP to user's email
 */

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
    console.log("emailService:sendOTP:start", {
        email,
        hasResendApiKey: !!process.env.RESEND_API_KEY,
        hasResendFromEmail: !!process.env.RESEND_FROM_EMAIL
    })

    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: [email],
        subject: "Your OTP Code",
        html: `<p>Your OTP is <strong>${otp}</strong></p>`,
        text: `Your OTP is ${otp}`
    });

    if (error) {
        throw new Error(`Resend error: ${error.message}`);
    }

    console.log("emailService:sendOTP:success", {
        email,
        emailId: data?.id
    })
};

module.exports = { sendOTP };
