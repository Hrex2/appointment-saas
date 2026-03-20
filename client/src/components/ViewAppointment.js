import React, { useState } from "react"
import { getAppointment } from "../api/appointmentApi"

const ViewAppointment = () => {
    const [id, setId] = useState("")
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchData = async () => {
        if (!id) {
            setError("Enter an appointment code to search.")
            return
        }

        try {
            setLoading(true)
            setError("")
            const res = await getAppointment(id)
            setData(res.data)
        } catch (err) {
            console.error(err)
            setError("Appointment not found or unavailable.")
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="stack-lg">
            <div className="stack">
                <label className="field-label" htmlFor="view-id">Appointment code</label>
                <input
                    id="view-id"
                    className="field"
                    placeholder="Enter 6-digit appointment code"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
            </div>

            <div className="button-row">
                <button className="btn btn-primary" onClick={fetchData} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {error && <p className="message message-error">{error}</p>}

            {data && (
                <div className="result-card">
                    <strong>Appointment details</strong>
                    <div className="result-grid">
                        <span><strong>Code:</strong> {data.appointmentCode || data._id}</span>
                        <span><strong>Name:</strong> {data.name}</span>
                        <span><strong>Date:</strong> {data.date}</span>
                        <span><strong>Time:</strong> {data.time}</span>
                        <span><strong>Status:</strong> {data.status}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewAppointment
