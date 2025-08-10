"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import OrderForm from "./OrderForm"
import "./Sales.css"

const Sales = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [visibleColumns, setVisibleColumns] = useState([
    "id",
    "customer",
    "transactionDate",
    "items",
    "total",
    "status",
  ])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    // Simulate loading orders data
    const mockOrders = [
      {
        id: "ORD-001",
        customer: "John Smith",
        transactionDate: "2024-01-15",
        memo: "",
        warehouse: "Warehouse 1",
        dueDate: "2024-02-15",
        referenceNo: "REF-123",
        customerRep: "Alice",
        paymentTerms: "Net 30",
        items: [
          {
            item: "Item A",
            account: "Account 1",
            unitType: "kg",
            quantity: 2,
            unitPrice: 250,
            disc: 5,
            tax: 10,
            grossAmount: 500,
          },
        ],
        total: 500,
        totalGross: 500,
        status: "Pending",
      },
      {
        id: "ORD-002",
        customer: "Jane Doe",
        transactionDate: "2024-01-14",
        memo: "Urgent order",
        warehouse: "Warehouse 2",
        dueDate: "2024-01-20",
        referenceNo: "REF-124",
        customerRep: "Bob",
        paymentTerms: "COD",
        items: [
          {
            item: "Item B",
            account: "Account 2",
            unitType: "pcs",
            quantity: 1,
            unitPrice: 850,
            disc: 0,
            tax: 100,
            grossAmount: 950,
          },
        ],
        total: 950,
        totalGross: 950,
        status: "Completed",
      },
    ]
    setOrders(mockOrders)
    setFilteredOrders(mockOrders)
  }, [])

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredOrders(filtered)
  }, [searchTerm, orders])

  const columns = [
    { key: "id", header: "Order ID" },
    { key: "customer", header: "Customer" },
    { key: "transactionDate", header: "Transaction Date" },
    { key: "items", header: "Items", render: (items) => items.length }, // Display number of items
    {
      key: "total",
      header: "Total",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
    { key: "memo", header: "Memo" },
    { key: "warehouse", header: "Warehouse" },
    { key: "dueDate", header: "Due Date" },
    { key: "referenceNo", header: "Reference No" },
    { key: "customerRep", header: "Customer Rep" },
    { key: "paymentTerms", header: "Payment Terms" },
    { key: "totalGross", header: "Total Gross" },
  ]

  const handleNewOrder = () => {
    setEditingOrder(null)
    setIsModalOpen(true)
  }

  const handleEditOrder = (order) => {
    setEditingOrder(order)
    setIsModalOpen(true)
  }

  const handleDeleteOrder = (order) => {
    if (window.confirm(`Are you sure you want to delete order ${order.id}?`)) {
      setOrders(orders.filter((o) => o.id !== order.id))
    }
  }

  const handleSaveOrder = (orderData) => {
    if (editingOrder) {
      // Update existing order
      setOrders(
        orders.map((order) =>
          order.id === editingOrder.id ? { ...order, ...orderData } : order
        )
      )
    } else {
      // Add new order
      const newOrder = {
        id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
        ...orderData,
        date: new Date().toISOString().split("T")[0],
      }
      setOrders([...orders, newOrder])
    }
    setIsModalOpen(false)
  }

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((item) => item !== column)
        : [...prev, column]
    )
  }

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  return (
    <div className="sales-page">
      <div className="page-header">
        <h1>Sales Orders</h1>
        <button className="primary-btn" onClick={handleNewOrder}>
          ➕ New Order
        </button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search orders..." value={searchTerm} onChange={setSearchTerm} />
        
        {/* Filter Button and Dropdown */}
        <div className="filter-button-container">
          <button className="filter-btn" onClick={toggleDropdown}>
            Filter Columns
          </button>
          {isDropdownOpen && (
            <div className="filter-dropdown">
              {columns.map((col) => (
                <div key={col.key}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.key)}
                    onChange={() => handleColumnToggle(col.key)}
                  />
                  <label>{col.header}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="table-container overflow-x-auto">
        <DataTable
          columns={columns.filter((col) => visibleColumns.includes(col.key))}
          data={filteredOrders}
          onEdit={handleEditOrder}
          onDelete={handleDeleteOrder}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOrder ? "Edit Order" : "New Order"}
        size="large"
      >
        <OrderForm
          order={editingOrder}
          onSave={handleSaveOrder}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Sales
