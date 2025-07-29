"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Attempt to load user from localStorage on initial load
    const storedUser = localStorage.getItem("erp_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username, password) => {
    // Simulate API call for login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "admin" && password === "password") {
          const userData = { username, role: "admin" }
          localStorage.setItem("erp_user", JSON.stringify(userData))
          setUser(userData)
          resolve({ success: true, message: "Login successful!" })
        } else {
          reject({ success: false, message: "Invalid credentials" })
        }
      }, 500)
    })
  }

  const register = async (username, email, password) => {
    // Simulate API call for registration
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In a real app, you'd check if username/email already exists
        // For this demo, we'll just "register" successfully
        console.log(`Registering user: ${username}, ${email}, ${password}`)
        resolve({ success: true, message: "Registration successful! Please log in." })
      }, 500)
    })
  }

  const logout = () => {
    localStorage.removeItem("erp_user")
    setUser(null)
    navigate("/login") // Redirect to login page after logout
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
