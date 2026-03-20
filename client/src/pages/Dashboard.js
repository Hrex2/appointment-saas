import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import CreateAppointment from "../components/CreateAppointment"
import ViewAppointment from "../components/ViewAppointment"
import UpdateAppointment from "../components/UpdateAppointment"
import CancelAppointment from "../components/CancelAppointment"
import ListAppointments from "../components/ListAppointments"
import AdminUserManager from "../components/AdminUserManager"

const Dashboard = () => {
    const navigate = useNavigate()
    const [refreshKey, setRefreshKey] = useState(0)
    const [role, setRole] = useState("user")

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
            return
        }

        setRole(localStorage.getItem("userRole") || "user")
    }, [navigate])

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("userRole")
        navigate("/login")
    }

    const refreshAppointments = () => {
        setRefreshKey((current) => current + 1)
    }

    return (
        <div className="app-shell">
            <div className="dashboard-shell">
                <section className="dashboard-hero">
                    <div>
                        <p className="eyebrow">Appointments</p>
                        <h1 className="hero-title">Manage your schedule with less friction.</h1>
                        <p className="hero-copy">
                            Review upcoming bookings, create new appointments, and handle updates
                            from one clean workspace.
                        </p>
                    </div>

                    <div className="button-row">
                        <button className="btn btn-secondary" onClick={refreshAppointments}>
                            Refresh list
                        </button>
                        <button className="btn btn-primary" onClick={logout}>
                            Logout
                        </button>
                    </div>
                </section>

                <div className="dashboard-grid">
                    <section className="panel panel-wide">
                        <h2 className="panel-title">All appointments</h2>
                        <p className="panel-copy">
                            Your live appointment feed refreshes after create, update, and cancel actions.
                        </p>
                        <ListAppointments refreshKey={refreshKey} />
                    </section>

                    {role === "admin" && (
                        <section className="panel panel-wide">
                            <h2 className="panel-title">User accounts</h2>
                            <p className="panel-copy">
                                Create or update user accounts so other people can sign in with their own email and WhatsApp number.
                            </p>
                            <AdminUserManager />
                        </section>
                    )}

                    <section className="panel panel-half">
                        <h2 className="panel-title">Create appointment</h2>
                        <p className="panel-copy">Capture a new booking and instantly surface its ID.</p>
                        <CreateAppointment onSuccess={refreshAppointments} />
                    </section>

                    <section className="panel panel-half">
                        <h2 className="panel-title">View appointment</h2>
                        <p className="panel-copy">Look up a booking by ID when you need details fast.</p>
                        <ViewAppointment />
                    </section>

                    <section className="panel panel-half">
                        <h2 className="panel-title">Update appointment</h2>
                        <p className="panel-copy">Reschedule an existing booking without leaving the page.</p>
                        <UpdateAppointment onSuccess={refreshAppointments} />
                    </section>

                    <section className="panel panel-half">
                        <h2 className="panel-title">Cancel appointment</h2>
                        <p className="panel-copy">Cancel by appointment ID and keep the dashboard in sync.</p>
                        <CancelAppointment onSuccess={refreshAppointments} />
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
