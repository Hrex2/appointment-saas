import React, { useState } from "react"
import { createAppointment } from "../api/appointmentApi"

const CreateAppointment = ({ onSuccess }) => {

    const [form, setForm] = useState({
        name: "",
        date: "",
        time: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [result, setResult] = useState(null)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if (!form.name || !form.date || !form.time) {
            setError("Complete all fields before creating an appointment.")
            return
        }

        try {
            setLoading(true)
            setError("")
            const res = await createAppointment(form)
            setResult(res.data)
            setForm({ name: "", date: "", time: "" })

            if (onSuccess) {
                onSuccess()
            }
        } catch (err) {
            console.error(err)
            setError("The appointment could not be created. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="stack-lg">
            <div className="stack">
                <label className="field-label" htmlFor="create-name">Patient or booking name</label>
                <input
                    id="create-name"
                    className="field"
                    name="name"
                    placeholder="Alex Johnson"
                    value={form.name}
                    onChange={handleChange}
                />
            </div>

            <div className="field-row">
                <div className="stack">
                    <label className="field-label" htmlFor="create-date">Date</label>
                    <input
                        id="create-date"
                        className="field"
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                    />
                </div>

                <div className="stack">
                    <label className="field-label" htmlFor="create-time">Time</label>
                    <input
                        id="create-time"
                        className="field"
                        type="time"
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {error && <p className="message message-error">{error}</p>}

            {result && (
                <div className="result-card">
                    <strong>Appointment created</strong>
                    <div className="result-grid">
                        <span><strong>ID:</strong> {result.id || result._id}</span>
                        <span><strong>Name:</strong> {result.name || form.name}</span>
                    </div>
                </div>
            )}

            <div className="button-row">
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Creating..." : "Create appointment"}
                </button>
            </div>
        </div>
    )
}

export default CreateAppointment
