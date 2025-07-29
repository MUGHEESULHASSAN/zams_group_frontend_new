"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import LeaveRequestForm from "./LeaveRequestForm" // Import the new form

const mockEmployees = [
  { id: "EMP-001", name: "Alice Johnson" },
  { id: "EMP-002", name: "Bob Smith" },
  { id: "EMP-003", name: "Carol Wilson" },
  { id: "EMP-004", name: "David Lee" },
]

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState(null)
  const [viewingRequest, setViewingRequest] = useState(null) // New state for viewing

  useEffect(() => {
    const mockRequests = [
      {
        id: "LEAVE-001",
        employeeId: "EMP-001",
        employee: "Alice Johnson",
        type: "Vacation",
        startDate: "2024-02-01",
        endDate: "2024-02-05",
        days: 5,
        reason: "Family trip",
        status: "Pending",
      },
      {
        id: "LEAVE-002",
        employeeId: "EMP-002",
        employee: "Bob Smith",
        type: "Sick Leave",
        startDate: "2024-01-20",
        endDate: "2024-01-22",
        days: 3,
        reason: "Flu",
        status: "Approved",
      },
      {
        id: "LEAVE-003",
        employeeId: "EMP-003",
        employee: "Carol Wilson",
        type: "Annual Leave",
        startDate: "2024-03-01",
        endDate: "2024-03-05",
        days: 5,
        reason: "Personal time",
        status: "Approved",
      },
      {
        id: "LEAVE-004",
        employeeId: "EMP-004",
        employee: "David Lee",
        type: "Unpaid Leave",
        startDate: "2024-03-10",
        endDate: "2024-03-12",
        days: 3,
        reason: "Personal matters",
        status: "Pending",
      },
    ]
    setLeaveRequests(mockRequests)
    setFilteredRequests(mockRequests)
  }, [])

  useEffect(() => {
    const filtered = leaveRequests.filter(
      (request) =>
        request.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.status.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredRequests(filtered)
  }, [searchTerm, leaveRequests])

  const columns = [
    { key: "id", header: "Request ID" },
    { key: "employee", header: "Employee" },
    { key: "type", header: "Leave Type" },
    { key: "startDate", header: "Start Date" },
    { key: "endDate", header: "End Date" },
    { key: "days", header: "Days" },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (value, row) => (
        <div className="action-buttons">
          {row.status === "Pending" && (
            <>
              <button className="action-btn approve-btn" onClick={() => handleApproveRequest(row.id)} title="Approve">
                ✔️
              </button>
              <button className="action-btn reject-btn" onClick={() => handleRejectRequest(row.id)} title="Reject">
                ✖️
              </button>
            </>
          )}
          <button className="action-btn edit-btn" onClick={() => handleEditLeaveRequest(row)} title="Edit">
            ✏️
          </button>
          <button className="action-btn delete-btn" onClick={() => handleDeleteLeaveRequest(row)} title="Delete">
            🗑️
          </button>
        </div>
      ),
      className: "actions-column", // Apply actions-column class for consistent styling
    },
  ]

  const handleNewLeaveRequest = () => {
    setEditingRequest(null)
    setViewingRequest(null)
    setIsModalOpen(true)
  }

  const handleEditLeaveRequest = (request) => {
    setEditingRequest(request)
    setViewingRequest(null) // Ensure not in view-only mode
    setIsModalOpen(true)
  }

  const handleDeleteLeaveRequest = (request) => {
    if (window.confirm(`Are you sure you want to delete leave request ${request.id}?`)) {
      setLeaveRequests(leaveRequests.filter((r) => r.id !== request.id))
    }
  }

  const handleSaveLeaveRequest = (requestData) => {
    if (editingRequest) {
      // Update existing request
      setLeaveRequests(leaveRequests.map((req) => (req.id === editingRequest.id ? { ...req, ...requestData } : req)))
    } else {
      // Add new request
      const newRequest = {
        id: `LEAVE-${String(leaveRequests.length + 1).padStart(3, "0")}`,
        ...requestData,
      }
      setLeaveRequests([...leaveRequests, newRequest])
    }
    setIsModalOpen(false)
    setEditingRequest(null)
    setViewingRequest(null)
  }

  const handleApproveRequest = (id) => {
    setLeaveRequests(leaveRequests.map((req) => (req.id === id ? { ...req, status: "Approved" } : req)))
    alert(`Leave request ${id} approved!`)
  }

  const handleRejectRequest = (id) => {
    setLeaveRequests(leaveRequests.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req)))
    alert(`Leave request ${id} rejected!`)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingRequest(null)
    setViewingRequest(null)
  }

  return (
    <div className="leave-page">
      <div className="page-header">
        <h1>Leave Management</h1>
        <button className="primary-btn" onClick={handleNewLeaveRequest}>
          ➕ New Leave Request
        </button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search leave requests..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable
        columns={columns}
        data={filteredRequests}
        // onEdit and onDelete are handled by custom render in columns
        // onView is not directly used here as edit button opens the form
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRequest ? "Edit Leave Request" : "Submit Leave Request"}
        size="medium"
      >
        <LeaveRequestForm
          request={editingRequest}
          onSave={handleSaveLeaveRequest}
          onCancel={handleCloseModal}
          employees={mockEmployees} // Pass mock employees to the form
        />
      </Modal>
    </div>
  )
}

export default LeaveManagement
