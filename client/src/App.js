import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Route */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    )
}

export default App