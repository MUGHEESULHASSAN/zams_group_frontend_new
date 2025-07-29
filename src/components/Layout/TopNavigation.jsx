"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NotificationDropdown from "../Dropdowns/NotificationDropdown"
import ProfileDropdown from "../Dropdowns/ProfileDropdown"
import { useAuth } from "../../context/AuthContext" // Import useAuth
import "./TopNavigation.css"

const TopNavigation = ({ toggleSidebar }) => {
  const navigate = useNavigate()
  const { user } = useAuth() // Get user from AuthContext
  const [notifications] = useState([
    { id: 1, message: "New order received", time: "5 min ago", type: "info" },
    { id: 2, message: "Low stock alert: Product A", time: "10 min ago", type: "warning" },
    { id: 3, message: "Payment received", time: "1 hour ago", type: "success" },
  ])

  const handleRefreshData = () => {
    // Simulate data refresh
    window.location.reload()
  }

  const handleAnalyticsReports = () => {
    navigate("/reports")
  }

  return (
    <nav className="top-navigation">
      <div className="nav-left">
        {user && ( // Only show menu toggle if user is logged in
          <button className="menu-toggle" onClick={toggleSidebar}>
            <span className="hamburger"></span>
          </button>
        )}
        <h1 className="app-title">ERP System</h1>
      </div>

      <div className="nav-right">
        {user ? ( // Conditionally render based on authentication status
          <>
            <button className="nav-button" onClick={handleRefreshData} title="Refresh Data">
              <span className="icon">🔄</span>
            </button>

            <button className="nav-button" onClick={handleAnalyticsReports} title="Analytics Reports">
              <span className="icon">📊</span>
            </button>

            <NotificationDropdown notifications={notifications} />
            <ProfileDropdown />
          </>
        ) : (
          <div className="auth-nav-buttons">
            <button className="primary-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="secondary-btn" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default TopNavigation
