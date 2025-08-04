"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth()

  const isAuthenticated =
    currentUser || localStorage.getItem("isAuthenticated") === "true"

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default PrivateRoute

