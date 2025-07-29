"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import AttendanceForm from "./AttendanceForm"
import "./AttendanceRegister.css"

const mockLeaveRequests = [
  {
    id: "LEAVE-001",
    employeeId: "EMP-001",
    employee: "Alice Johnson",
    type: "Vacation",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    days: 5,
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
    status: "Approved",
  },
]

const AttendanceRegister = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [viewMode, setViewMode] = useState("daily") // daily, monthly, employee

  useEffect(() => {
    // Mock attendance data
    const mockAttendance = [
      {
        id: "ATT-001",
        employeeId: "EMP-001",
        employeeName: "Alice Johnson",
        date: "2024-01-15",
        checkIn: "09:00",
        checkOut: "17:30",
        breakTime: "01:00",
        workingHours: "7.5",
        overtime: "0",
        status: "Present",
        notes: "",
        leaveRequestId: null,
      },
      {
        id: "ATT-002",
        employeeId: "EMP-002",
        employeeName: "Bob Smith",
        date: "2024-01-15",
        checkIn: "09:15",
        checkOut: "18:00",
        breakTime: "01:00",
        workingHours: "7.75",
        overtime: "0.25",
        status: "Late",
        notes: "Late arrival",
        leaveRequestId: null,
      },
      {
        id: "ATT-003",
        employeeId: "EMP-003",
        employeeName: "Carol Wilson",
        date: "2024-01-15",
        checkIn: "",
        checkOut: "",
        breakTime: "",
        workingHours: "0",
        overtime: "0",
        status: "Absent",
        notes: "Sick leave",
        leaveRequestId: null,
      },
      {
        id: "ATT-004",
        employeeId: "EMP-002",
        employeeName: "Bob Smith",
        date: "2024-01-20",
        checkIn: "",
        checkOut: "",
        breakTime: "",
        workingHours: "0",
        overtime: "0",
        status: "On Leave",
        notes: "Sick leave as per request LEAVE-002",
        leaveRequestId: "LEAVE-002", // Linked to a leave request
      },
      {
        id: "ATT-005",
        employeeId: "EMP-002",
        employeeName: "Bob Smith",
        date: "2024-01-21",
        checkIn: "",
        checkOut: "",
        breakTime: "",
        workingHours: "0",
        overtime: "0",
        status: "On Leave",
        notes: "Sick leave as per request LEAVE-002",
        leaveRequestId: "LEAVE-002", // Linked to a leave request
      },
      {
        id: "ATT-006",
        employeeId: "EMP-002",
        employeeName: "Bob Smith",
        date: "2024-01-22",
        checkIn: "",
        checkOut: "",
        breakTime: "",
        workingHours: "0",
        overtime: "0",
        status: "On Leave",
        notes: "Sick leave as per request LEAVE-002",
        leaveRequestId: "LEAVE-002", // Linked to a leave request
      },
      {
        id: "ATT-007",
        employeeId: "EMP-003",
        employeeName: "Carol Wilson",
        date: "2024-03-01",
        checkIn: "",
        checkOut: "",
        breakTime: "",
        workingHours: "0",
        overtime: "0",
        status: "On Leave",
        notes: "Annual leave as per request LEAVE-003",
        leaveRequestId: "LEAVE-003", // Linked to a leave request
      },
    ]
    setAttendanceRecords(mockAttendance)
    setFilteredRecords(mockAttendance)
  }, [])

  useEffect(() => {
    let filtered = attendanceRecords

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by date
    if (selectedDate && viewMode === "daily") {
      filtered = filtered.filter((record) => record.date === selectedDate)
    }

    // Filter by employee
    if (selectedEmployee) {
      filtered = filtered.filter((record) => record.employeeId === selectedEmployee)
    }

    setFilteredRecords(filtered)
  }, [searchTerm, selectedDate, selectedEmployee, attendanceRecords, viewMode])

  const columns = [
    { key: "employeeId", header: "Employee ID" },
    { key: "employeeName", header: "Employee Name" },
    { key: "date", header: "Date" },
    { key: "checkIn", header: "Check In" },
    { key: "checkOut", header: "Check Out" },
    { key: "workingHours", header: "Working Hours" },
    { key: "overtime", header: "Overtime" },
    {
      key: "status",
      header: "Status",
      render: (value, row) => (
        <span className={`status-badge ${value.toLowerCase().replace(" ", "-")}`}>
          {value}
          {value === "On Leave" && row.leaveRequestId && (
            <span className="leave-link" title={`Linked to Leave Request: ${row.leaveRequestId}`}>
              {" "}
              (🔗)
            </span>
          )}
        </span>
      ),
    },
  ]

  const handleMarkAttendance = () => {
    setEditingRecord(null)
    setIsModalOpen(true)
  }

  const handleSaveAttendance = (attendanceData) => {
    if (editingRecord) {
      setAttendanceRecords(
        attendanceRecords.map((record) => (record.id === editingRecord.id ? { ...record, ...attendanceData } : record)),
      )
    } else {
      const newRecord = {
        id: `ATT-${String(attendanceRecords.length + 1).padStart(3, "0")}`,
        ...attendanceData,
      }
      setAttendanceRecords([...attendanceRecords, newRecord])
    }
    setIsModalOpen(false)
  }

  const handleBulkMarkPresent = () => {
    const today = new Date().toISOString().split("T")[0]
    const employees = ["EMP-001", "EMP-002", "EMP-003"] // This would come from employee list

    const bulkRecords = employees.map((empId, index) => ({
      id: `ATT-BULK-${Date.now()}-${index}`,
      employeeId: empId,
      employeeName: `Employee ${empId}`,
      date: today,
      checkIn: "09:00",
      checkOut: "17:00",
      breakTime: "01:00",
      workingHours: "7",
      overtime: "0",
      status: "Present",
      notes: "Bulk marked",
      leaveRequestId: null,
    }))

    setAttendanceRecords([...attendanceRecords, ...bulkRecords])
  }

  const getAttendanceSummary = () => {
    const today = selectedDate
    const todayRecords = attendanceRecords.filter((record) => record.date === today)

    return {
      total: todayRecords.length,
      present: todayRecords.filter((r) => r.status === "Present").length,
      absent: todayRecords.filter((r) => r.status === "Absent").length,
      late: todayRecords.filter((r) => r.status === "Present" && r.checkIn > "09:00").length,
      onLeave: todayRecords.filter((r) => r.status === "On Leave").length, // Added onLeave to summary
    }
  }

  const summary = getAttendanceSummary()

  return (
    <div className="attendance-register">
      <div className="page-header">
        <h2>Attendance Register</h2>
        <div className="header-actions">
          <button className="secondary-btn" onClick={handleBulkMarkPresent}>
            📋 Bulk Mark Present
          </button>
          <button className="primary-btn" onClick={handleMarkAttendance}>
            ➕ Mark Attendance
          </button>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="attendance-summary">
        <div className="summary-card total">
          <div className="summary-icon">👥</div>
          <div className="summary-content">
            <h3>Total Employees</h3>
            <p className="summary-value">{summary.total}</p>
          </div>
        </div>
        <div className="summary-card present">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <h3>Present</h3>
            <p className="summary-value">{summary.present}</p>
          </div>
        </div>
        <div className="summary-card absent">
          <div className="summary-icon">❌</div>
          <div className="summary-content">
            <h3>Absent</h3>
            <p className="summary-value">{summary.absent}</p>
          </div>
        </div>
        <div className="summary-card late">
          <div className="summary-icon">⏰</div>
          <div className="summary-content">
            <h3>Late Arrivals</h3>
            <p className="summary-value">{summary.late}</p>
          </div>
        </div>
        <div className="summary-card on-leave">
          <div className="summary-icon">🌴</div>
          <div className="summary-content">
            <h3>On Leave</h3>
            <p className="summary-value">{summary.onLeave}</p>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="view-mode-tabs">
        <button className={`tab-button ${viewMode === "daily" ? "active" : ""}`} onClick={() => setViewMode("daily")}>
          Daily View
        </button>
        <button
          className={`tab-button ${viewMode === "monthly" ? "active" : ""}`}
          onClick={() => setViewMode("monthly")}
        >
          Monthly View
        </button>
        <button
          className={`tab-button ${viewMode === "employee" ? "active" : ""}`}
          onClick={() => setViewMode("employee")}
        >
          Employee View
        </button>
      </div>

      {/* Filters */}
      <div className="page-controls">
        <SearchBar placeholder="Search employees..." value={searchTerm} onChange={setSearchTerm} />

        {viewMode === "daily" && (
          <div className="date-filter">
            <label htmlFor="selectedDate">Date:</label>
            <input
              type="date"
              id="selectedDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        )}

        {viewMode === "employee" && (
          <div className="employee-filter">
            <label htmlFor="selectedEmployee">Employee:</label>
            <select
              id="selectedEmployee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">All Employees</option>
              <option value="EMP-001">EMP-001 - Alice Johnson</option>
              <option value="EMP-002">EMP-002 - Bob Smith</option>
              <option value="EMP-003">EMP-003 - Carol Wilson</option>
            </select>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filteredRecords}
        onEdit={(record) => {
          setEditingRecord(record)
          setIsModalOpen(true)
        }}
        onDelete={(record) => {
          if (window.confirm(`Delete attendance record for ${record.employeeName}?`)) {
            setAttendanceRecords(attendanceRecords.filter((r) => r.id !== record.id))
          }
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecord ? "Edit Attendance" : "Mark Attendance"}
      >
        <AttendanceForm
          record={editingRecord}
          onSave={handleSaveAttendance}
          onCancel={() => setIsModalOpen(false)}
          leaveRequests={mockLeaveRequests} // Pass mock leave requests to the form
        />
      </Modal>
    </div>
  )
}

export default AttendanceRegister
