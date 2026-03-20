// components/UpdateAppointment.js

import React, { useState } from "react"
import { updateAppointment } from "../api/appointmentApi"

/**
 * PURPOSE:
 * Change date/time
 */

const UpdateAppointment = () => {

    const [id, setId] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")

    const handleUpdate = async () => {
        await updateAppointment(id, { date, time })
        alert("Updated!")
    }

    return (
        <div>
            <h2>Update Appointment</h2>

            <input placeholder="ID" onChange={(e) => setId(e.target.value)} />
            <input placeholder="New Date" onChange={(e) => setDate(e.target.value)} />
            <input placeholder="New Time" onChange={(e) => setTime(e.target.value)} />

            <button onClick={handleUpdate}>Update</button>
        </div>
    )
}

export default UpdateAppointment