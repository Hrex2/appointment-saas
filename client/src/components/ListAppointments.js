import React, { useEffect, useState } from "react"
import { getAllAppointments } from "../api/appointmentApi"

const statusClassName = (status) => {
    const normalized = (status || "pending").toLowerCase()

    if (normalized.includes("cancel")) {
        return "pill pill-cancelled"
    }

    if (normalized.includes("confirm") || normalized.includes("schedule")) {
        return "pill pill-confirmed"
    }

    return "pill pill-pending"
}

const ListAppointments = ({ refreshKey = 0 }) => {

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            setError("")
            const res = await getAllAppointments()
            setAppointments(res.data)
        } catch (err) {
            console.error(err)
            setError("We couldn't load appointments right now.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [refreshKey])

    if (loading) {
        return <p className="message message-muted">Loading appointments...</p>
    }

    if (error) {
        return <p className="message message-error">{error}</p>
    }

    if (appointments.length === 0) {
        return (
            <p className="message message-muted">
                No appointments found yet. Create one below to get started.
            </p>
        )
    }

    return (
        <div className="appointments-grid">
            {appointments.map((appt) => (
                <article className="appointment-item" key={appt._id}>
                    <div className="appointment-main">
                        <span className="appointment-name">{appt.name}</span>
                        <span className="appointment-meta">
                            {appt.date} at {appt.time}
                        </span>
                        <span className="appointment-meta">ID: {appt._id}</span>
                    </div>
                    <span className={statusClassName(appt.status)}>{appt.status || "Pending"}</span>
                </article>
            ))}
        </div>
    )
}

export default ListAppointments
