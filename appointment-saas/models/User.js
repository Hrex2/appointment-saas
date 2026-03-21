const mongoose = require("mongoose")

const emptyToUndefined = (value) => {
    if (value === null || typeof value === "undefined") {
        return undefined
    }

    if (typeof value === "string" && value.trim() === "") {
        return undefined
    }

    return value
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        set: emptyToUndefined
    },
    phone: {
        type: String,
        set: emptyToUndefined
    },
    name: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    otp: String,
    otpExpiry: Date,
    step: {
        type: String,
        default: "start"
    },
    tempName: String,
    tempDate: String
}, { timestamps: true })

userSchema.index(
    { email: 1 },
    {
        unique: true,
        partialFilterExpression: {
            email: { $exists: true, $type: "string" }
        }
    }
)

userSchema.index(
    { phone: 1 },
    {
        unique: true,
        partialFilterExpression: {
            phone: { $exists: true, $type: "string" }
        }
    }
)

module.exports = mongoose.model("User", userSchema)
