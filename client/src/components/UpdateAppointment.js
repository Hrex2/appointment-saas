import React, { useState } from "react"
import { updateAppointment } from "../api/appointmentApi"

const UpdateAppointment = ({ onSuccess }) => {

    const [id, setId] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const handleUpdate = async () => {
        if (!id || !date || !time) {
            setError("Enter the appointment ID, a new date, and a new time.")
            return
        }

        try {
            setLoading(true)
            setError("")
            setMessage("")
            await updateAppointment(id, { date, time })
            setMessage("Appointment updated successfully.")
            setId("")
            setDate("")
            setTime("")

            if (onSuccess) {
                onSuccess()
            }
        } catch (err) {
            console.error(err)
            setError("The appointment could not be updated. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="stack-lg">
            <div className="stack">
                <label className="field-label" htmlFor="update-id">Appointment ID</label>
                <input
                    id="update-id"
                    className="field"
                    placeholder="Enter appointment ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
            </div>

            <div className="field-row">
                <div className="stack">
                    <label className="field-label" htmlFor="update-date">New date</label>
                    <input
                        id="update-date"
                        className="field"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="stack">
                    <label className="field-label" htmlFor="update-time">New time</label>
                    <input
                        id="update-time"
                        className="field"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
            </div>

            {message && <p className="message message-success">{message}</p>}
            {error && <p className="message message-error">{error}</p>}

            <div className="button-row">
                <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
                    {loading ? "Updating..." : "Update appointment"}
                </button>
            </div>
        </div>
    )
}

export default UpdateAppointment
