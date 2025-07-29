"use client"

import { useState, useEffect } from "react"
import "./LeaveRequestForm.css"

const LeaveRequestForm = ({ request, onSave, onCancel, employees = [] }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    employee: "",
    type: "Vacation",
    startDate: "",
    endDate: "",
    days: 0,
    reason: "",
    status: "Pending",
  })

  useEffect(() => {
    if (request) {
      setFormData(request)
    } else {
      // Reset form for new request
      setFormData({
        employeeId: "",
        employee: "",
        type: "Vacation",
        startDate: "",
        endDate: "",
        days: 0,
        reason: "",
        status: "Pending",
      })
    }
  }, [request])

  // Calculate days between start and end dates
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end >= start) {
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end day
        setFormData((prev) => ({ ...prev, days: diffDays }))
      } else {
        setFormData((prev) => ({ ...prev, days: 0 }))
      }
    } else {
      setFormData((prev) => ({ ...prev, days: 0 }))
    }
  }, [formData.startDate, formData.endDate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.days <= 0) {
      alert("End Date must be on or after Start Date.")
      return
    }
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value
    const selectedEmployee = employees.find((emp) => emp.id === selectedId)
    setFormData((prev) => ({
      ...prev,
      employeeId: selectedId,
      employee: selectedEmployee ? selectedEmployee.name : "",
    }))
  }

  return (
    <form className="leave-request-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="employeeId">Employee *</label>
        <select
          id="employeeId"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleEmployeeChange}
          required
          disabled={!!request} // Disable employee selection when editing
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.id})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="type">Leave Type *</label>
        <select id="type" name="type" value={formData.type} onChange={handleChange} required>
          <option value="Vacation">Vacation</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Annual Leave">Annual Leave</option>
          <option value="Maternity Leave">Maternity Leave</option>
          <option value="Paternity Leave">Paternity Leave</option>
          <option value="Unpaid Leave">Unpaid Leave</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date *</label>
          <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="days">Number of Days</label>
        <input
          type="number"
          id="days"
          name="days"
          value={formData.days}
          readOnly
          className="calculated-field"
          min="0"
        />
        <small className="field-note">Auto-calculated based on start and end dates.</small>
      </div>

      <div className="form-group">
        <label htmlFor="reason">Reason / Notes</label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows="3"
          placeholder="Briefly describe the reason for leave"
        />
      </div>

      {request && ( // Only show status when editing an existing request
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          {request ? "Update Request" : "Submit Request"}
        </button>
      </div>
    </form>
  )
}

export default LeaveRequestForm
