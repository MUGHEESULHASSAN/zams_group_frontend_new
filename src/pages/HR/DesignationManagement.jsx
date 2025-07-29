"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import DesignationForm from "./DesignationForm"

const DesignationManagement = () => {
  const [designations, setDesignations] = useState([])
  const [filteredDesignations, setFilteredDesignations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDesignation, setEditingDesignation] = useState(null)

  useEffect(() => {
    // Mock designations data
    const mockDesignations = [
      {
        id: "DES-001",
        title: "Software Engineer",
        department: "Information Technology",
        level: "Junior",
        minSalary: 50000,
        maxSalary: 70000,
        description: "Develops and maintains software applications",
        requirements: "Bachelor's degree in Computer Science, 1-2 years experience",
        responsibilities: "Code development, testing, debugging, documentation",
        status: "Active",
        employeeCount: 8,
      },
      {
        id: "DES-002",
        title: "Senior Software Engineer",
        department: "Information Technology",
        level: "Senior",
        minSalary: 80000,
        maxSalary: 120000,
        description: "Leads software development projects and mentors junior developers",
        requirements: "Bachelor's degree in Computer Science, 5+ years experience",
        responsibilities: "Project leadership, code review, architecture design, mentoring",
        status: "Active",
        employeeCount: 4,
      },
      {
        id: "DES-003",
        title: "Marketing Manager",
        department: "Marketing",
        level: "Manager",
        minSalary: 70000,
        maxSalary: 100000,
        description: "Manages marketing campaigns and strategies",
        requirements: "Bachelor's degree in Marketing, 3+ years experience",
        responsibilities: "Campaign management, team leadership, strategy development",
        status: "Active",
        employeeCount: 2,
      },
    ]
    setDesignations(mockDesignations)
    setFilteredDesignations(mockDesignations)
  }, [])

  useEffect(() => {
    const filtered = designations.filter(
      (designation) =>
        designation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        designation.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        designation.level.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredDesignations(filtered)
  }, [searchTerm, designations])

  const columns = [
    { key: "id", header: "ID" },
    { key: "title", header: "Designation Title" },
    { key: "department", header: "Department" },
    { key: "level", header: "Level" },
    {
      key: "minSalary",
      header: "Min Salary",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "maxSalary",
      header: "Max Salary",
      render: (value) => `$${value.toLocaleString()}`,
    },
    { key: "employeeCount", header: "Employees" },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
  ]

  const handleSaveDesignation = (designationData) => {
    if (editingDesignation) {
      setDesignations(
        designations.map((designation) =>
          designation.id === editingDesignation.id ? { ...designation, ...designationData } : designation,
        ),
      )
    } else {
      const newDesignation = {
        id: `DES-${String(designations.length + 1).padStart(3, "0")}`,
        ...designationData,
        employeeCount: 0,
      }
      setDesignations([...designations, newDesignation])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="designation-management">
      <div className="page-header">
        <h2>Designation Management</h2>
        <button
          className="primary-btn"
          onClick={() => {
            setEditingDesignation(null)
            setIsModalOpen(true)
          }}
        >
          ➕ Add Designation
        </button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search designations..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable
        columns={columns}
        data={filteredDesignations}
        onEdit={(designation) => {
          setEditingDesignation(designation)
          setIsModalOpen(true)
        }}
        onDelete={(designation) => {
          if (designation.employeeCount > 0) {
            alert(`Cannot delete designation. ${designation.employeeCount} employees are assigned to this designation.`)
            return
          }
          if (window.confirm(`Delete designation ${designation.title}?`)) {
            setDesignations(designations.filter((d) => d.id !== designation.id))
          }
        }}
        onView={(designation) => {
          setEditingDesignation(designation)
          setIsModalOpen(true)
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDesignation ? "Edit Designation" : "Add Designation"}
        size="large"
      >
        <DesignationForm
          designation={editingDesignation}
          onSave={handleSaveDesignation}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default DesignationManagement
