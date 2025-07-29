"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"

const Requisitions = () => {
  const [requisitions, setRequisitions] = useState([])
  const [filteredRequisitions, setFilteredRequisitions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const mockRequisitions = [
      {
        id: "REQ-001",
        requestor: "Marketing Dept",
        date: "2024-01-18",
        items: 8,
        total: 1200,
        status: "Pending",
      },
      {
        id: "REQ-002",
        requestor: "IT Dept",
        date: "2024-01-19",
        items: 3,
        total: 5000,
        status: "Approved",
      },
    ]
    setRequisitions(mockRequisitions)
    setFilteredRequisitions(mockRequisitions)
  }, [])

  const columns = [
    { key: "id", header: "Requisition ID" },
    { key: "requestor", header: "Requestor" },
    { key: "date", header: "Request Date" },
    { key: "items", header: "Items" },
    {
      key: "total",
      header: "Total",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
  ]

  return (
    <div className="requisitions-page">
      <div className="page-header">
        <h1>Requisitions</h1>
        <button className="primary-btn">➕ New Requisition</button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search requisitions..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable columns={columns} data={filteredRequisitions} onEdit={() => {}} onDelete={() => {}} />
    </div>
  )
}

export default Requisitions
