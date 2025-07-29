"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"

const Vendors = () => {
  const [vendors, setVendors] = useState([])
  const [filteredVendors, setFilteredVendors] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const mockVendors = [
      {
        id: "VEN-001",
        name: "Office Supplies Inc",
        contact: "John Manager",
        email: "john@officesupplies.com",
        phone: "+1-555-0100",
        status: "Active",
      },
      {
        id: "VEN-002",
        name: "Tech Equipment Ltd",
        contact: "Sarah Tech",
        email: "sarah@techequip.com",
        phone: "+1-555-0200",
        status: "Active",
      },
    ]
    setVendors(mockVendors)
    setFilteredVendors(mockVendors)
  }, [])

  useEffect(() => {
    const filtered = vendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contact.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredVendors(filtered)
  }, [searchTerm, vendors])

  const columns = [
    { key: "id", header: "Vendor ID" },
    { key: "name", header: "Company Name" },
    { key: "contact", header: "Contact Person" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
  ]

  return (
    <div className="vendors-page">
      <div className="page-header">
        <h1>Vendors</h1>
        <button className="primary-btn">➕ Add Vendor</button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search vendors..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable columns={columns} data={filteredVendors} onEdit={() => {}} onDelete={() => {}} />
    </div>
  )
}

export default Vendors
