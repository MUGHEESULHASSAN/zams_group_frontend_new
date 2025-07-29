"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext" // Import useAuth
import "./Dropdown.css"

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth() // Get user and logout from AuthContext

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSettings = () => {
    navigate("/settings")
    setIsOpen(false)
  }

  const handleProfile = () => {
    navigate("/profile")
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout() // Call logout from AuthContext
    setIsOpen(false)
  }

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="nav-button profile-button" onClick={() => setIsOpen(!isOpen)} title="Profile">
        <span className="icon">👤</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu profile-dropdown">
          <div className="dropdown-header">
            <div className="profile-info">
              <div className="profile-name">{user ? user.username : "Guest"}</div>
              <div className="profile-email">{user ? user.email || "N/A" : "guest@company.com"}</div>
            </div>
          </div>
          <div className="dropdown-items">
            <button className="dropdown-item" onClick={handleProfile}>
              <span className="item-icon">👤</span>
              Profile
            </button>
            <button className="dropdown-item" onClick={handleSettings}>
              <span className="item-icon">⚙️</span>
              Settings
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout" onClick={handleLogout}>
              <span className="item-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
