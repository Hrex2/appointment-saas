import React, { useState } from "react"
import { getAppointment } from "../api/appointmentApi"

const ViewAppointment = () => {

    const [id, setId] = useState("")
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchData = async () => {
        if (!id) {
            alert("Please enter an ID")
            return
        }

        try {
            setLoading(true)
            setError("")

            const res = await getAppointment(id)
            setData(res.data)

        } catch (err) {
            console.error(err)
            setError("Appointment not found or error occurred")
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>View Appointment</h2>

            <input
                placeholder="Enter ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />

            <button onClick={fetchData}>
                {loading ? "Loading..." : "Search"}
            </button>

            {/* ❌ Error */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* ✅ Data */}
            {data && (
                <div>
                    <p><strong>Name:</strong> {data.name}</p>
                    <p><strong>Date:</strong> {data.date}</p>
                    <p><strong>Time:</strong> {data.time}</p>
                    <p><strong>Status:</strong> {data.status}</p>
                </div>
            )}
        </div>
    )
}

export default ViewAppointment