"use client"

import { useState, useEffect, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import SearchBar from "../../components/Common/SearchBar"
import "./AttendanceReports.css"

const mockAttendanceData = [
  {
    id: "ATT-001",
    employeeId: "EMP-001",
    employeeName: "Alice Johnson",
    date: "2024-01-01",
    checkIn: "09:00",
    checkOut: "17:30",
    breakTime: "01:00",
    workingHours: "7.5",
    overtime: "0",
    status: "Present",
    notes: "",
  },
  {
    id: "ATT-002",
    employeeId: "EMP-002",
    employeeName: "Bob Smith",
    date: "2024-01-01",
    checkIn: "09:15",
    checkOut: "18:00",
    breakTime: "01:00",
    workingHours: "7.75",
    overtime: "0.25",
    status: "Late",
    notes: "Late arrival",
  },
  {
    id: "ATT-003",
    employeeId: "EMP-003",
    employeeName: "Carol Wilson",
    date: "2024-01-01",
    checkIn: "",
    checkOut: "",
    breakTime: "",
    workingHours: "0",
    overtime: "0",
    status: "Absent",
    notes: "Sick leave",
  },
  {
    id: "ATT-004",
    employeeId: "EMP-001",
    employeeName: "Alice Johnson",
    date: "2024-01-02",
    checkIn: "09:00",
    checkOut: "17:00",
    breakTime: "01:00",
    workingHours: "7",
    overtime: "0",
    status: "Present",
    notes: "",
  },
  {
    id: "ATT-005",
    employeeId: "EMP-002",
    employeeName: "Bob Smith",
    date: "2024-01-02",
    checkIn: "09:00",
    checkOut: "17:00",
    breakTime: "01:00",
    workingHours: "7",
    overtime: "0",
    status: "Present",
    notes: "",
  },
  {
    id: "ATT-006",
    employeeId: "EMP-003",
    employeeName: "Carol Wilson",
    date: "2024-01-02",
    checkIn: "09:00",
    checkOut: "13:00",
    breakTime: "00:00",
    workingHours: "4",
    overtime: "0",
    status: "Half Day",
    notes: "Half day leave",
  },
  {
    id: "ATT-007",
    employeeId: "EMP-001",
    employeeName: "Alice Johnson",
    date: "2024-02-01",
    checkIn: "09:00",
    checkOut: "17:30",
    breakTime: "01:00",
    workingHours: "7.5",
    overtime: "0",
    status: "Present",
    notes: "",
  },
  {
    id: "ATT-008",
    employeeId: "EMP-002",
    employeeName: "Bob Smith",
    date: "2024-02-01",
    checkIn: "09:00",
    checkOut: "17:00",
    breakTime: "01:00",
    workingHours: "7",
    overtime: "0",
    status: "Present",
    notes: "",
  },
  {
    id: "ATT-009",
    employeeId: "EMP-003",
    employeeName: "Carol Wilson",
    date: "2024-02-01",
    checkIn: "",
    checkOut: "",
    breakTime: "",
    workingHours: "0",
    overtime: "0",
    status: "On Leave",
    notes: "Annual leave",
  },
  {
    id: "ATT-010",
    employeeId: "EMP-001",
    employeeName: "Alice Johnson",
    date: "2024-02-02",
    checkIn: "09:00",
    checkOut: "17:00",
    breakTime: "01:00",
    workingHours: "7",
    overtime: "0",
    status: "Present",
    notes: "",
  },
  {
    id: "ATT-011",
    employeeId: "EMP-002",
    employeeName: "Bob Smith",
    date: "2024-02-02",
    checkIn: "09:00",
    checkOut: "17:00",
    breakTime: "01:00",
    workingHours: "7",
    overtime: "0",
    status: "Present",
    notes: "",
  },
  {
    id: "ATT-012",
    employeeId: "EMP-003",
    employeeName: "Carol Wilson",
    date: "2024-02-02",
    checkIn: "",
    checkOut: "",
    breakTime: "",
    workingHours: "0",
    overtime: "0",
    status: "On Leave",
    notes: "Annual leave",
  },
  {
    id: "ATT-013",
    employeeId: "EMP-001",
    employeeName: "Alice Johnson",
    date: "2024-03-01",
    checkIn: "09:00",
    checkOut: "17:30",
    breakTime: "01:00",
    workingHours: "7.5",
    overtime: "0",
    status: "Present",
    notes: "",
  },
  {
    id: "ATT-014",
    employeeId: "EMP-002",
    employeeName: "Bob Smith",
    date: "2024-03-01",
    checkIn: "09:00",
    checkOut: "17:00",
    breakTime: "01:00",
    workingHours: "7",
    overtime: "0",
    status: "Present",
    notes: "",
  },
  {
    id: "ATT-015",
    employeeId: "EMP-003",
    employeeName: "Carol Wilson",
    date: "2024-03-01",
    checkIn: "09:00",
    checkOut: "17:00",
    breakTime: "01:00",
    workingHours: "7",
    overtime: "0",
    status: "Present",
    notes: "",
  },
]

const AttendanceReports = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("2024-01-01")
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    setAttendanceRecords(mockAttendanceData)
  }, [])

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date)
      const start = new Date(startDate)
      const end = new Date(endDate)

      const matchesDate = recordDate >= start && recordDate <= end
      const matchesEmployee = selectedEmployeeId ? record.employeeId === selectedEmployeeId : true
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesDate && matchesEmployee && matchesSearch
    })
  }, [attendanceRecords, searchTerm, startDate, endDate, selectedEmployeeId])

  // --- Data Transformation for Charts ---

  // Daily Attendance Data for Bar Chart
  const dailyAttendanceData = useMemo(() => {
    const dailyCounts = {}
    filteredRecords.forEach((record) => {
      if (!dailyCounts[record.date]) {
        dailyCounts[record.date] = {
          date: record.date,
          Present: 0,
          Absent: 0,
          Late: 0,
          "Half Day": 0,
          "On Leave": 0,
        }
      }
      dailyCounts[record.date][record.status]++
    })
    return Object.values(dailyCounts).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filteredRecords])

  // Monthly Attendance Data for Line Chart
  const monthlyAttendanceData = useMemo(() => {
    const monthlyCounts = {}
    filteredRecords.forEach((record) => {
      const monthYear = new Date(record.date).toLocaleString("en-US", { month: "short", year: "numeric" })
      if (!monthlyCounts[monthYear]) {
        monthlyCounts[monthYear] = { month: monthYear, Present: 0, Absent: 0, Late: 0, "Half Day": 0, "On Leave": 0 }
      }
      monthlyCounts[monthYear][record.status]++
    })

    // Sort by date to ensure correct line chart order
    const sortedMonths = Object.keys(monthlyCounts).sort((a, b) => {
      const [monthA, yearA] = a.split(" ")
      const [monthB, yearB] = b.split(" ")
      const dateA = new Date(`${monthA} 1, ${yearA}`)
      const dateB = new Date(`${monthB} 1, ${yearB}`)
      return dateA - dateB
    })

    return sortedMonths.map((month) => monthlyCounts[month])
  }, [filteredRecords])

  // Overall Status Data for Pie Chart
  const overallStatusData = useMemo(() => {
    const statusCounts = {
      Present: 0,
      Absent: 0,
      Late: 0,
      "Half Day": 0,
      "On Leave": 0,
    }
    filteredRecords.forEach((record) => {
      if (statusCounts.hasOwnProperty(record.status)) {
        statusCounts[record.status]++
      }
    })
    return Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }))
  }, [filteredRecords])

  const pieChartColors = ["#28a745", "#dc3545", "#ffc107", "#17a2b8", "#6c757d"] // Green, Red, Yellow, Cyan, Gray

  // Summary statistics
  const summary = useMemo(() => {
    const total = filteredRecords.length
    const present = filteredRecords.filter((r) => r.status === "Present").length
    const absent = filteredRecords.filter((r) => r.status === "Absent").length
    const late = filteredRecords.filter((r) => r.status === "Late").length
    const onLeave = filteredRecords.filter((r) => r.status === "On Leave").length
    const halfDay = filteredRecords.filter((r) => r.status === "Half Day").length

    return { total, present, absent, late, onLeave, halfDay }
  }, [filteredRecords])

  // Get unique employees for filter dropdown
  const uniqueEmployees = useMemo(() => {
    const employees = new Set()
    mockAttendanceData.forEach((record) => {
      employees.add(JSON.stringify({ id: record.employeeId, name: record.employeeName }))
    })
    return Array.from(employees).map((empStr) => JSON.parse(empStr))
  }, [])

  return (
    <div className="attendance-reports-page">
      <div className="page-header">
        <h1>Attendance Reports & Analytics</h1>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search employee..." value={searchTerm} onChange={setSearchTerm} />

        <div className="filter-group">
          <label htmlFor="startDate">From:</label>
          <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="filter-group">
          <label htmlFor="endDate">To:</label>
          <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="filter-group">
          <label htmlFor="employeeFilter">Employee:</label>
          <select
            id="employeeFilter"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
          >
            <option value="">All Employees</option>
            {uniqueEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards-grid">
        <div className="summary-card total">
          <div className="summary-icon">👥</div>
          <div className="summary-content">
            <h3>Total Records</h3>
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
        <div className="summary-card half-day">
          <div className="summary-icon">🌗</div>
          <div className="summary-content">
            <h3>Half Day</h3>
            <p className="summary-value">{summary.halfDay}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h2>Daily Attendance Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyAttendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Present" stackId="a" fill="#28a745" name="Present" />
              <Bar dataKey="Absent" stackId="a" fill="#dc3545" name="Absent" />
              <Bar dataKey="Late" stackId="a" fill="#ffc107" name="Late" />
              <Bar dataKey="Half Day" stackId="a" fill="#17a2b8" name="Half Day" />
              <Bar dataKey="On Leave" stackId="a" fill="#6c757d" name="On Leave" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Monthly Attendance Trend (Present Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyAttendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Present" stroke="#007bff" activeDot={{ r: 8 }} name="Present Days" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card pie-chart-card">
          <h2>Overall Attendance Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overallStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {overallStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AttendanceReports
