"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom" // Import useNavigate
import SearchBar from "../../components/Common/SearchBar"
import "./Reports.css"

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate() // Initialize useNavigate

  const reportCategories = [
    {
      title: "Financial Reports",
      reports: [
        { name: "Profit & Loss Statement", description: "Monthly P&L analysis" },
        { name: "Balance Sheet", description: "Current financial position" },
        { name: "Cash Flow Report", description: "Cash flow analysis" },
        { name: "Budget vs Actual", description: "Budget performance report" },
      ],
    },
    {
      title: "Sales Reports",
      reports: [
        { name: "Sales Summary", description: "Overall sales performance" },
        { name: "Customer Analysis", description: "Customer behavior insights" },
        { name: "Product Performance", description: "Top selling products" },
        { name: "Sales Forecast", description: "Future sales projections" },
      ],
    },
    {
      title: "Inventory Reports",
      reports: [
        { name: "Stock Levels", description: "Current inventory status" },
        { name: "Low Stock Alert", description: "Items needing reorder" },
        { name: "Inventory Valuation", description: "Total inventory value" },
        { name: "Movement Analysis", description: "Inventory turnover rates" },
      ],
    },
    {
      title: "HR Reports",
      reports: [
        { name: "Employee Summary", description: "Staff overview report" },
        {
          name: "Attendance Report",
          description: "Employee attendance tracking and analytics",
          path: "/hr/attendance-reports",
        }, // Added path
        { name: "Payroll Summary", description: "Salary and benefits overview" },
        { name: "Performance Review", description: "Employee performance metrics" },
      ],
    },
  ]

  const handleGenerateReport = (reportName) => {
    alert(`Generating ${reportName}...`)
  }

  const handleViewReport = (reportPath) => {
    if (reportPath) {
      navigate(reportPath)
    } else {
      alert("View functionality not implemented for this report yet.")
    }
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
        <button className="primary-btn">📊 Create Custom Report</button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search reports..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="reports-grid">
        {reportCategories.map((category, index) => (
          <div key={index} className="report-category">
            <h2 className="category-title">{category.title}</h2>
            <div className="reports-list">
              {category.reports.map((report, reportIndex) => (
                <div key={reportIndex} className="report-card">
                  <div className="report-info">
                    <h3 className="report-name">{report.name}</h3>
                    <p className="report-description">{report.description}</p>
                  </div>
                  <div className="report-actions">
                    <button className="secondary-btn" onClick={() => handleGenerateReport(report.name)}>
                      Generate
                    </button>
                    <button className="primary-btn" onClick={() => handleViewReport(report.path)}>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Reports
