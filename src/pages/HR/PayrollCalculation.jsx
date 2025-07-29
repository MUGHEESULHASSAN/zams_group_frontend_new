"use client"

import { useState, useEffect, useMemo } from "react"
import DataTable from "../../components/Common/DataTable"
import "./PayrollCalculation.css"

// Mock Data - In a real application, these would be fetched from a backend
const mockEmployees = [
  { id: "EMP-001", name: "Alice Johnson", designation: "Software Engineer", department: "Information Technology" },
  { id: "EMP-002", name: "Bob Smith", designation: "Marketing Manager", department: "Marketing" },
  { id: "EMP-003", name: "Carol Wilson", designation: "Software Engineer", department: "Information Technology" },
  { id: "EMP-004", name: "David Lee", designation: "Sales Executive", department: "Sales" },
]

const mockPayrollDefinitions = [
  {
    id: "PAY-001",
    designation: "Software Engineer",
    department: "Information Technology",
    basicSalary: 60000, // Annual basic salary
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
      rate: 25, // per hour
      type: "hourly",
    },
    bonus: {
      annual: 10000,
      performance: 5000,
    },
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
  },
  {
    id: "PAY-003",
    designation: "Sales Executive",
    department: "Sales",
    basicSalary: 50000,
    allowances: {
      housing: 10000,
      transport: 4000,
      medical: 2000,
      meal: 1500,
    },
    deductions: {
      tax: 6000,
      insurance: 1000,
      providentFund: 2500,
    },
    overtime: {
      rate: 20,
      type: "hourly",
    },
    bonus: {
      annual: 5000,
      performance: 3000,
    },
  },
]

const mockAttendanceRecords = [
  // Overtime for EMP-001 in Jan 2024
  { employeeId: "EMP-001", date: "2024-01-05", overtime: "2.0" },
  { employeeId: "EMP-001", date: "2024-01-12", overtime: "1.5" },
  // Overtime for EMP-002 in Jan 2024
  { employeeId: "EMP-002", date: "2024-01-10", overtime: "3.0" },
  // Overtime for EMP-003 in Feb 2024
  { employeeId: "EMP-003", date: "2024-02-01", overtime: "2.5" },
  { employeeId: "EMP-003", date: "2024-02-08", overtime: "1.0" },
  // Overtime for EMP-004 in March 2024
  { employeeId: "EMP-004", date: "2024-03-15", overtime: "4.0" },
]

const PayrollCalculation = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1) // 1-12
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [calculatedPayroll, setCalculatedPayroll] = useState([])
  const [employees, setEmployees] = useState([])
  const [payrollDefinitions, setPayrollDefinitions] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])

  useEffect(() => {
    // Simulate fetching data
    setEmployees(mockEmployees)
    setPayrollDefinitions(mockPayrollDefinitions)
    setAttendanceRecords(mockAttendanceRecords)
  }, [])

  const calculatePayroll = useMemo(() => {
    const payrollResults = []
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate() // Get number of days in selected month

    employees.forEach((employee) => {
      const definition = payrollDefinitions.find(
        (def) => def.designation === employee.designation && def.department === employee.department,
      )

      if (!definition) {
        payrollResults.push({
          employeeId: employee.id,
          employeeName: employee.name,
          designation: employee.designation,
          department: employee.department,
          basicSalary: "N/A",
          totalAllowances: "N/A",
          totalDeductions: "N/A",
          overtimeHours: "N/A",
          overtimePay: "N/A",
          grossPay: "N/A",
          netPay: "N/A",
          status: "No Definition",
        })
        return
      }

      // Monthly calculations from annual figures
      const monthlyBasicSalary = definition.basicSalary / 12
      const monthlyAllowances = Object.values(definition.allowances).reduce((sum, val) => sum + val, 0) / 12
      const monthlyDeductions = Object.values(definition.deductions).reduce((sum, val) => sum + val, 0) / 12
      const monthlyBonus = Object.values(definition.bonus).reduce((sum, val) => sum + val, 0) / 12 // Assuming annual bonus is distributed monthly

      // Calculate overtime for the selected month
      const employeeOvertimeRecords = attendanceRecords.filter(
        (record) =>
          record.employeeId === employee.id &&
          new Date(record.date).getMonth() + 1 === currentMonth &&
          new Date(record.date).getFullYear() === currentYear,
      )
      const totalOvertimeHours = employeeOvertimeRecords.reduce((sum, record) => sum + Number(record.overtime || 0), 0)
      const overtimePay = totalOvertimeHours * definition.overtime.rate

      const grossPay = monthlyBasicSalary + monthlyAllowances + overtimePay + monthlyBonus
      const netPay = grossPay - monthlyDeductions

      payrollResults.push({
        employeeId: employee.id,
        employeeName: employee.name,
        designation: employee.designation,
        department: employee.department,
        basicSalary: monthlyBasicSalary,
        totalAllowances: monthlyAllowances,
        totalDeductions: monthlyDeductions,
        overtimeHours: totalOvertimeHours,
        overtimePay: overtimePay,
        grossPay: grossPay,
        netPay: netPay,
        status: "Calculated",
      })
    })
    return payrollResults
  }, [employees, payrollDefinitions, attendanceRecords, currentMonth, currentYear])

  useEffect(() => {
    setCalculatedPayroll(calculatePayroll)
  }, [calculatePayroll])

  const handleGeneratePayroll = () => {
    alert(
      `Generating payroll for ${new Date(currentYear, currentMonth - 1).toLocaleString("en-US", { month: "long", year: "numeric" })}. This would typically save to a database.`,
    )
    // In a real app, you'd send calculatedPayroll to your backend
  }

  const columns = [
    { key: "employeeId", header: "ID" },
    { key: "employeeName", header: "Employee Name" },
    { key: "designation", header: "Designation" },
    { key: "department", header: "Department" },
    {
      key: "basicSalary",
      header: "Basic Salary",
      render: (value) => (typeof value === "number" ? `$${value.toFixed(2)}` : value),
    },
    {
      key: "totalAllowances",
      header: "Allowances",
      render: (value) => (typeof value === "number" ? `$${value.toFixed(2)}` : value),
    },
    {
      key: "totalDeductions",
      header: "Deductions",
      render: (value) => (typeof value === "number" ? `$${value.toFixed(2)}` : value),
    },
    { key: "overtimeHours", header: "OT Hours" },
    {
      key: "overtimePay",
      header: "OT Pay",
      render: (value) => (typeof value === "number" ? `$${value.toFixed(2)}` : value),
    },
    {
      key: "grossPay",
      header: "Gross Pay",
      render: (value) => (typeof value === "number" ? `$${value.toFixed(2)}` : value),
    },
    {
      key: "netPay",
      header: "Net Pay",
      render: (value) => (typeof value === "number" ? `$${value.toFixed(2)}` : value),
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase().replace(" ", "-")}`}>{value}</span>,
    },
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i) // Current year +/- 2
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="payroll-calculation-page">
      <div className="page-header">
        <h1>Payroll Calculation</h1>
        <button className="primary-btn" onClick={handleGeneratePayroll}>
          💰 Generate Payroll
        </button>
      </div>

      <div className="page-controls">
        <div className="filter-group">
          <label htmlFor="month-select">Month:</label>
          <select id="month-select" value={currentMonth} onChange={(e) => setCurrentMonth(Number(e.target.value))}>
            {months.map((month) => (
              <option key={month} value={month}>
                {new Date(currentYear, month - 1).toLocaleString("en-US", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="year-select">Year:</label>
          <select id="year-select" value={currentYear} onChange={(e) => setCurrentYear(Number(e.target.value))}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={calculatedPayroll} />
    </div>
  )
}

export default PayrollCalculation
