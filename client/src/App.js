import React from "react"
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom"

import ProtectedRoute from "./components/ProtectedRoute"
import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"
import Dashboard from "./pages/Dashboard"
import LoginPage from "./pages/LoginPage"
import BusinessSettings from "./pages/BusinessSettings"
import AppointmentSettings from "./pages/AppointmentSettings"
import CalendarView from "./pages/CalendarView"
import ProfilePage from "./pages/ProfilePage"

const DashboardLayout = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#070b14] text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),transparent_35%)]" />
            <div className="relative flex min-h-screen">
                <Sidebar />
                <div className="flex min-h-screen flex-1 flex-col">
                    <Topbar />
                    <main className="flex-1 px-4 pb-6 pt-24 sm:px-6 lg:px-10">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="business-settings" element={<BusinessSettings />} />
                    <Route path="appointment-settings" element={<AppointmentSettings />} />
                    <Route path="calendar" element={<CalendarView />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
