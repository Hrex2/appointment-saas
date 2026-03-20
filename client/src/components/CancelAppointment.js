import React, { useState } from "react"
import { cancelAppointment } from "../api/appointmentApi"

const CancelAppointment = ({ onSuccess }) => {

    const [id, setId] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const handleCancel = async () => {
        if (!id) {
            setError("Enter an appointment ID before cancelling.")
            return
        }

        try {
            setLoading(true)
            setError("")
            setMessage("")
            await cancelAppointment(id)
            setMessage("Appointment cancelled successfully.")
            setId("")

            if (onSuccess) {
                onSuccess()
            }
        } catch (err) {
            console.error(err)
            setError("The appointment could not be cancelled. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="stack-lg">
            <div className="stack">
                <label className="field-label" htmlFor="cancel-id">Appointment ID</label>
                <input
                    id="cancel-id"
                    className="field"
                    placeholder="Enter appointment ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
            </div>

            {message && <p className="message message-success">{message}</p>}
            {error && <p className="message message-error">{error}</p>}

            <div className="button-row">
                <button className="btn btn-danger" onClick={handleCancel} disabled={loading}>
                    {loading ? "Cancelling..." : "Cancel appointment"}
                </button>
            </div>
        </div>
    )
}

export default CancelAppointment
