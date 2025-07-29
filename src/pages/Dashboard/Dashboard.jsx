"use client"

import { useState, useEffect } from "react"
import "./Dashboard.css"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    lowStockItems: 0,
    pendingInvoices: 0,
  })

  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    // Simulate loading dashboard data
    setStats({
      totalSales: 125000,
      totalOrders: 342,
      lowStockItems: 15,
      pendingInvoices: 23,
    })

    setRecentActivities([
      { id: 1, action: "New order created", time: "2 minutes ago", type: "order" },
      { id: 2, action: "Payment received", time: "15 minutes ago", type: "payment" },
      { id: 3, action: "Low stock alert", time: "1 hour ago", type: "alert" },
      { id: 4, action: "New customer registered", time: "2 hours ago", type: "customer" },
    ])
  }, [])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your business today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card sales">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p className="stat-value">${stats.totalSales.toLocaleString()}</p>
            <span className="stat-change positive">+12% from last month</span>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
            <span className="stat-change positive">+8% from last month</span>
          </div>
        </div>

        <div className="stat-card inventory">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Low Stock Items</h3>
            <p className="stat-value">{stats.lowStockItems}</p>
            <span className="stat-change negative">Needs attention</span>
          </div>
        </div>

        <div className="stat-card invoices">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Pending Invoices</h3>
            <p className="stat-value">{stats.pendingInvoices}</p>
            <span className="stat-change neutral">Review required</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-activities">
          <h2>Recent Activities</h2>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`activity-item ${activity.type}`}>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="quick-action-btn">
              <span className="action-icon">➕</span>
              New Order
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">👥</span>
              Add Customer
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">📦</span>
              Add Product
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">📊</span>
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
