"use client"

import { useState, useRef, useEffect } from "react"
import "./Dropdown.css"

const NotificationDropdown = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="nav-button notification-button" onClick={() => setIsOpen(!isOpen)} title="Notifications">
        <span className="icon">🔔</span>
        {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
      </button>

      {isOpen && (
        <div className="dropdown-menu notification-dropdown">
          <div className="dropdown-header">
            <h3>Notifications</h3>
          </div>
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className={`notification-item ${notification.type}`}>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{notification.time}</div>
                </div>
              ))
            ) : (
              <div className="no-notifications">No new notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
