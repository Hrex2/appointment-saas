// components/CancelAppointment.js

import React, { useState } from "react"
import { cancelAppointment } from "../api/appointmentApi"

/**
 * PURPOSE:
 * Cancel appointment
 */

const CancelAppointment = () => {

    const [id, setId] = useState("")

    const handleCancel = async () => {
        await cancelAppointment(id)
        alert("Cancelled")
    }

    return (
        <div>
            <h2>Cancel Appointment</h2>

            <input placeholder="ID" onChange={(e) => setId(e.target.value)} />
            <button onClick={handleCancel}>Cancel</button>
        </div>
    )
}

export default CancelAppointment