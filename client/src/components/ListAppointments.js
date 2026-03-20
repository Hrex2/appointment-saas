import React, { useEffect, useState } from "react"
import axios from "axios"

const ListAppointments = () => {

    const [appointments, setAppointments] = useState([])

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token")

            const res = await axios.get(
                "http://localhost:5000/api/appointments",
                {
                    headers: {
                        Authorization: token
                    }
                }
            )

            setAppointments(res.data)

        } catch (err) {
            console.error(err)
            alert("Error fetching appointments")
        }
    }

    // 🔥 Run automatically when component loads
    useEffect(() => {
        fetchAppointments()
    }, [])

    return (
        <div>
            <h2>My Appointments</h2>

            {appointments.length === 0 ? (
                <p>No appointments found</p>
            ) : (
                <ul>
                    {appointments.map((appt) => (
                        <li key={appt._id}>
                            {appt.name} - {appt.date} - {appt.time} ({appt.status})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default ListAppointments