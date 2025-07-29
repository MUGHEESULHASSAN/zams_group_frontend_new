"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
