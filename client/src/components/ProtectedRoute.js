// src/components/ProtectedRoute.js

/**
 * PURPOSE:
 * Protect pages (Dashboard)
 * CHECK:
 * - if token exists → allow
 * - else → redirect to login
 */

import React from "react"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {

    const token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/login" />
    }

    return children
}

export default ProtectedRoute