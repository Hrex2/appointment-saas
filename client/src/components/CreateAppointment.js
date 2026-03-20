// components/CreateAppointment.js

import React, { useState } from "react"
import { createAppointment } from "../api/appointmentApi"

/**
 * PURPOSE:
 * Take input from user
 * Send to backend
 * Show appointment ID
 */

const CreateAppointment = () => {

    const [form, setForm] = useState({
        name: "",
        date: "",
        time: ""
    })

    const [result, setResult] = useState(null)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        const res = await createAppointment(form)
        setResult(res.data)
    }

    return (
        <div>
            <h2>Create Appointment</h2>

            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="date" placeholder="Date" onChange={handleChange} />
            <input name="time" placeholder="Time" onChange={handleChange} />

            <button onClick={handleSubmit}>Create</button>

            {result && (
                <p>Appointment ID: {result.id}</p>
            )}
        </div>
    )
}

export default CreateAppointment