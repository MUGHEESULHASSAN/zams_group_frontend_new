"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "./Sidebar.css"

const Sidebar = ({ isOpen }) => {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }))
  }

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    {
      label: "Sales",
      icon: "💰",
      key: "sales",
      submenu: [
        { path: "/sales", label: "Orders" },
        { path: "/customers", label: "Customers" },
        { path: "/opportunities", label: "Opportunities" },
        { path: "/quotes", label: "Quotes" },
      ],
    },
    { path: "/inventory", label: "Inventory", icon: "📦" },
    {
      label: "Purchasing",
      icon: "🛒",
      key: "purchasing",
      submenu: [
        { path: "/purchasing", label: "Purchase Orders" },
        { path: "/vendors", label: "Vendors" },
        { path: "/receipts", label: "Receipts" },
        { path: "/requisitions", label: "Requisitions" },
      ],
    },
    {
      label: "Human Resources",
      icon: "👥",
      key: "hr",
      submenu: [
        { path: "/hr", label: "Employees" },
        { path: "/departments", label: "Departments" },
        { path: "/leave", label: "Leave Management" },
      ],
    },
    {
      label: "Finance",
      icon: "💳",
      key: "finance",
      submenu: [
        { path: "/finance", label: "Transactions" },
        { path: "/invoices", label: "Invoices" },
      ],
    },
    { path: "/reports", label: "Reports", icon: "📊" },
    { path: "/calendar", label: "Calendar", icon: "📅" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ]

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-content">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item">
            {item.submenu ? (
              <>
                <button
                  className={`menu-link submenu-toggle ${expandedMenus[item.key] ? "expanded" : ""}`}
                  onClick={() => toggleMenu(item.key)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                  <span className="arrow">▼</span>
                </button>
                {expandedMenus[item.key] && (
                  <div className="submenu">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className={`submenu-link ${location.pathname === subItem.path ? "active" : ""}`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link to={item.path} className={`menu-link ${location.pathname === item.path ? "active" : ""}`}>
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
