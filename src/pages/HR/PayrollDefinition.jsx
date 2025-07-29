"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import PayrollForm from "./PayrollForm"

const PayrollDefinition = () => {
  const [payrollDefinitions, setPayrollDefinitions] = useState([])
  const [filteredDefinitions, setFilteredDefinitions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDefinition, setEditingDefinition] = useState(null)

  useEffect(() => {
    // Mock payroll definitions data
    const mockDefinitions = [
      {
        id: "PAY-001",
        designation: "Software Engineer",
        department: "Information Technology",
        basicSalary: 60000,
        allowances: {
          housing: 15000,
          transport: 5000,
          medical: 3000,
          meal: 2000,
        },
        deductions: {
          tax: 8000,
          insurance: 1500,
          providentFund: 3000,
        },
        overtime: {
          rate: 25,
          type: "hourly",
        },
        bonus: {
          annual: 10000,
          performance: 5000,
        },
        totalPackage: 88500,
        status: "Active",
      },
      {
        id: "PAY-002",
        designation: "Marketing Manager",
        department: "Marketing",
        basicSalary: 85000,
        allowances: {
          housing: 20000,
          transport: 8000,
          medical: 5000,
          meal: 3000,
        },
        deductions: {
          tax: 12000,
          insurance: 2000,
          providentFund: 4250,
        },
        overtime: {
          rate: 40,
          type: "hourly",
        },
        bonus: {
          annual: 15000,
          performance: 8000,
        },
        totalPackage: 126750,
        status: "Active",
      },
    ]
    setPayrollDefinitions(mockDefinitions)
    setFilteredDefinitions(mockDefinitions)
  }, [])

  useEffect(() => {
    const filtered = payrollDefinitions.filter(
      (definition) =>
        definition.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        definition.department.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredDefinitions(filtered)
  }, [searchTerm, payrollDefinitions])

  const columns = [
    { key: "id", header: "ID" },
    { key: "designation", header: "Designation" },
    { key: "department", header: "Department" },
    {
      key: "basicSalary",
      header: "Basic Salary",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "totalPackage",
      header: "Total Package",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
  ]

  const handleSaveDefinition = (definitionData) => {
    if (editingDefinition) {
      setPayrollDefinitions(
        payrollDefinitions.map((definition) =>
          definition.id === editingDefinition.id ? { ...definition, ...definitionData } : definition,
        ),
      )
    } else {
      const newDefinition = {
        id: `PAY-${String(payrollDefinitions.length + 1).padStart(3, "0")}`,
        ...definitionData,
      }
      setPayrollDefinitions([...payrollDefinitions, newDefinition])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="payroll-definition">
      <div className="page-header">
        <h2>Payroll Definition</h2>
        <button
          className="primary-btn"
          onClick={() => {
            setEditingDefinition(null)
            setIsModalOpen(true)
          }}
        >
          ➕ Add Payroll Definition
        </button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search payroll definitions..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable
        columns={columns}
        data={filteredDefinitions}
        onEdit={(definition) => {
          setEditingDefinition(definition)
          setIsModalOpen(true)
        }}
        onDelete={(definition) => {
          if (window.confirm(`Delete payroll definition for ${definition.designation}?`)) {
            setPayrollDefinitions(payrollDefinitions.filter((d) => d.id !== definition.id))
          }
        }}
        onView={(definition) => {
          setEditingDefinition(definition)
          setIsModalOpen(true)
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDefinition ? "Edit Payroll Definition" : "Add Payroll Definition"}
        size="large"
      >
        <PayrollForm
          definition={editingDefinition}
          onSave={handleSaveDefinition}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default PayrollDefinition
