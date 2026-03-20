import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import CreateAppointment from "../components/CreateAppointment"
import ViewAppointment from "../components/ViewAppointment"
import UpdateAppointment from "../components/UpdateAppointment"
import CancelAppointment from "../components/CancelAppointment"
import ListAppointments from "../components/ListAppointments"

const Dashboard = () => {

    const navigate = useNavigate()

    // 🔐 Check auth on load
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
        }
    }, [navigate])

    const logout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>📅 Appointment Dashboard</h1>

            <button 
                onClick={logout}
                style={{ marginBottom: "20px" }}
            >
                Logout
            </button>

            <hr />

            {/* 📋 All Appointments */}
            <h2>All Appointments</h2>
            <ListAppointments />

            <hr />

            {/* ➕ Create */}
            <h2>Create Appointment</h2>
            <CreateAppointment />

            <hr />

            {/* 🔍 View */}
            <h2>View Appointment</h2>
            <ViewAppointment />

            <hr />

            {/* ✏️ Update */}
            <h2>Update Appointment</h2>
            <UpdateAppointment />

            <hr />

            {/* ❌ Cancel */}
            <h2>Cancel Appointment</h2>
            <CancelAppointment />
        </div>
    )
}

export default Dashboard
