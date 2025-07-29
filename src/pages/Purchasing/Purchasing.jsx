"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"

const Purchasing = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const mockOrders = [
      {
        id: "PO-001",
        vendor: "Office Supplies Inc",
        date: "2024-01-15",
        total: 2500,
        status: "Pending",
        deliveryDate: "2024-01-25",
      },
      {
        id: "PO-002",
        vendor: "Tech Equipment Ltd",
        date: "2024-01-14",
        total: 15000,
        status: "Approved",
        deliveryDate: "2024-01-30",
      },
    ]
    setPurchaseOrders(mockOrders)
    setFilteredOrders(mockOrders)
  }, [])

  useEffect(() => {
    const filtered = purchaseOrders.filter(
      (order) =>
        order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredOrders(filtered)
  }, [searchTerm, purchaseOrders])

  const columns = [
    { key: "id", header: "PO Number" },
    { key: "vendor", header: "Vendor" },
    { key: "date", header: "Order Date" },
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
    { key: "deliveryDate", header: "Delivery Date" },
  ]

  return (
    <div className="purchasing-page">
      <div className="page-header">
        <h1>Purchase Orders</h1>
        <button className="primary-btn">➕ Create PO</button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search purchase orders..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable columns={columns} data={filteredOrders} onEdit={() => {}} onDelete={() => {}} />
    </div>
  )
}

export default Purchasing
