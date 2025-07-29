"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const mockDepartments = [
      {
        id: "DEPT-001",
        name: "Marketing",
        manager: "Alice Johnson",
        employees: 8,
        budget: 150000,
        status: "Active",
      },
      {
        id: "DEPT-002",
        name: "IT",
        manager: "Bob Smith",
        employees: 12,
        budget: 300000,
        status: "Active",
      },
    ]
    setDepartments(mockDepartments)
    setFilteredDepartments(mockDepartments)
  }, [])

  const columns = [
    { key: "id", header: "Department ID" },
    { key: "name", header: "Department Name" },
    { key: "manager", header: "Manager" },
    { key: "employees", header: "Employees" },
    {
      key: "budget",
      header: "Budget",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
  ]

  return (
    <div className="departments-page">
      <div className="page-header">
        <h1>Departments</h1>
        <button className="primary-btn">➕ Add Department</button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search departments..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable columns={columns} data={filteredDepartments} onEdit={() => {}} onDelete={() => {}} />
    </div>
  )
}

export default Departments
