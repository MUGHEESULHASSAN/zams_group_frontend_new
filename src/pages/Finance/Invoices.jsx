"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"

const Invoices = () => {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const mockInvoices = [
      {
        id: "INV-001",
        customer: "ABC Corp",
        date: "2024-01-15",
        dueDate: "2024-02-15",
        amount: 5000.0,
        status: "Paid",
      },
      {
        id: "INV-002",
        customer: "XYZ Ltd",
        date: "2024-01-18",
        dueDate: "2024-02-18",
        amount: 3500.0,
        status: "Pending",
      },
    ]
    setInvoices(mockInvoices)
    setFilteredInvoices(mockInvoices)
  }, [])

  const columns = [
    { key: "id", header: "Invoice ID" },
    { key: "customer", header: "Customer" },
    { key: "date", header: "Invoice Date" },
    { key: "dueDate", header: "Due Date" },
    {
      key: "amount",
      header: "Amount",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
  ]

  return (
    <div className="invoices-page">
      <div className="page-header">
        <h1>Invoices</h1>
        <button className="primary-btn">➕ Create Invoice</button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search invoices..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable columns={columns} data={filteredInvoices} onEdit={() => {}} onDelete={() => {}} />
    </div>
  )
}

export default Invoices
