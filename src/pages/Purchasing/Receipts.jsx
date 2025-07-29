"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"

const Receipts = () => {
  const [receipts, setReceipts] = useState([])
  const [filteredReceipts, setFilteredReceipts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const mockReceipts = [
      {
        id: "REC-001",
        poNumber: "PO-001",
        vendor: "Office Supplies Inc",
        receivedDate: "2024-01-20",
        items: 15,
        status: "Complete",
      },
      {
        id: "REC-002",
        poNumber: "PO-002",
        vendor: "Tech Equipment Ltd",
        receivedDate: "2024-01-22",
        items: 5,
        status: "Partial",
      },
    ]
    setReceipts(mockReceipts)
    setFilteredReceipts(mockReceipts)
  }, [])

  const columns = [
    { key: "id", header: "Receipt ID" },
    { key: "poNumber", header: "PO Number" },
    { key: "vendor", header: "Vendor" },
    { key: "receivedDate", header: "Received Date" },
    { key: "items", header: "Items" },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
  ]

  return (
    <div className="receipts-page">
      <div className="page-header">
        <h1>Receipts</h1>
        <button className="primary-btn">➕ Record Receipt</button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search receipts..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable columns={columns} data={filteredReceipts} onEdit={() => {}} onDelete={() => {}} />
    </div>
  )
}

export default Receipts
