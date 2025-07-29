"use client"

import { useState } from "react"
import SearchBar from "../../components/Common/SearchBar"
import "./Settings.css"

const Settings = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const settingsCategories = [
    {
      title: "General Settings",
      icon: "⚙️",
      settings: [
        { name: "Company Information", description: "Update company details" },
        { name: "System Preferences", description: "Configure system defaults" },
        { name: "Date & Time Format", description: "Set date and time preferences" },
        { name: "Currency Settings", description: "Configure currency options" },
      ],
    },
    {
      title: "User Management",
      icon: "👥",
      settings: [
        { name: "User Accounts", description: "Manage user accounts" },
        { name: "Roles & Permissions", description: "Configure user roles" },
        { name: "Access Control", description: "Set access permissions" },
        { name: "Password Policy", description: "Configure password requirements" },
      ],
    },
    {
      title: "Notifications",
      icon: "🔔",
      settings: [
        { name: "Email Notifications", description: "Configure email alerts" },
        { name: "System Alerts", description: "Set up system notifications" },
        { name: "Report Scheduling", description: "Schedule automated reports" },
        { name: "Reminder Settings", description: "Configure reminders" },
      ],
    },
    {
      title: "Security",
      icon: "🔒",
      settings: [
        { name: "Two-Factor Authentication", description: "Enable 2FA security" },
        { name: "Session Management", description: "Configure session settings" },
        { name: "Audit Logs", description: "View system audit logs" },
        { name: "Backup Settings", description: "Configure data backups" },
      ],
    },
  ]

  const handleSettingClick = (settingName) => {
    alert(`Opening ${settingName} configuration...`)
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search settings..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="settings-grid">
        {settingsCategories.map((category, index) => (
          <div key={index} className="settings-category">
            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <h2 className="category-title">{category.title}</h2>
            </div>
            <div className="settings-list">
              {category.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="setting-item" onClick={() => handleSettingClick(setting.name)}>
                  <div className="setting-info">
                    <h3 className="setting-name">{setting.name}</h3>
                    <p className="setting-description">{setting.description}</p>
                  </div>
                  <div className="setting-arrow">›</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Settings
