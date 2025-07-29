"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import TopNavigation from "./TopNavigation"
import "./Layout.css"

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="layout">
      <TopNavigation toggleSidebar={toggleSidebar} />
      <div className="layout-content">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>{children}</main>
      </div>
    </div>
  )
}

export default Layout
