"use client"

import { useState, useEffect } from "react"

const AttendanceForm = ({ record, onSave, onCancel, leaveRequests = [] }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    date: new Date().toISOString().split("T")[0],
    checkIn: "",
    checkOut: "",
    breakTime: "01:00",
    workingHours: "0",
    overtime: "0",
    status: "Present",
    notes: "",
    leaveRequestId: null, // New field for linking leave requests
  })

  const [selectedLeaveDetails, setSelectedLeaveDetails] = useState(null)

  useEffect(() => {
    if (record) {
      setFormData(record)
    }
  }, [record])

  useEffect(() => {
    if (formData.status === "On Leave" && formData.leaveRequestId) {
      const linkedLeave = leaveRequests.find((lr) => lr.id === formData.leaveRequestId)
      setSelectedLeaveDetails(linkedLeave)
    } else {
      setSelectedLeaveDetails(null)
    }
  }, [formData.status, formData.leaveRequestId, leaveRequests])

  // Auto-calculate working hours
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(`2000-01-01 ${formData.checkIn}`)
      const checkOut = new Date(`2000-01-01 ${formData.checkOut}`)
      const breakTime = Number.parseFloat(formData.breakTime) || 0

      if (checkOut > checkIn) {
        const totalHours = (checkOut - checkIn) / (1000 * 60 * 60)
        const workingHours = Math.max(0, totalHours - breakTime)
        const standardHours = 8
        const overtime = Math.max(0, workingHours - standardHours)

        setFormData((prev) => ({
          ...prev,
          workingHours: workingHours.toFixed(2),
          overtime: overtime.toFixed(2),
        }))
      }
    }
  }, [formData.checkIn, formData.checkOut, formData.breakTime])

  const handleSubmit = (e) => {
    e.preventDefault()
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
      employeeName: selectedEmployee ? selectedEmployee.name : "",
      leaveRequestId: null, // Reset leave request when employee changes
    }))
  }

  const handleLeaveRequestChange = (e) => {
    const selectedLeaveId = e.target.value
    setFormData((prev) => ({
      ...prev,
      leaveRequestId: selectedLeaveId === "" ? null : selectedLeaveId,
    }))
  }

  const employees = [
    { id: "EMP-001", name: "Alice Johnson" },
    { id: "EMP-002", name: "Bob Smith" },
    { id: "EMP-003", name: "Carol Wilson" },
  ]

  const statusOptions = ["Present", "Absent", "Late", "Half Day", "On Leave"]

  // Filter leave requests relevant to the selected employee and date
  const availableLeaveRequests = leaveRequests.filter(
    (lr) =>
      lr.employeeId === formData.employeeId &&
      new Date(formData.date) >= new Date(lr.startDate) &&
      new Date(formData.date) <= new Date(lr.endDate) &&
      lr.status === "Approved", // Only show approved leaves
  )

  return (
    <form className="attendance-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="employeeId">Employee *</label>
          <select
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleEmployeeChange}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.id} - {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status *</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} required>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="breakTime">Break Time (hours)</label>
          <input
            type="number"
            id="breakTime"
            name="breakTime"
            value={formData.breakTime}
            onChange={handleChange}
            step="0.25"
            min="0"
            max="4"
          />
        </div>
      </div>

      {formData.status === "On Leave" && (
        <div className="form-group">
          <label htmlFor="leaveRequestId">Link Leave Request</label>
          <select
            id="leaveRequestId"
            name="leaveRequestId"
            value={formData.leaveRequestId || ""}
            onChange={handleLeaveRequestChange}
          >
            <option value="">Select Leave Request (Optional)</option>
            {availableLeaveRequests.map((lr) => (
              <option key={lr.id} value={lr.id}>
                {lr.id} - {lr.type} ({lr.startDate} to {lr.endDate})
              </option>
            ))}
          </select>
          {selectedLeaveDetails && (
            <small className="field-note">
              Selected Leave: {selectedLeaveDetails.type} from {selectedLeaveDetails.startDate} to{" "}
              {selectedLeaveDetails.endDate} (Status: {selectedLeaveDetails.status})
            </small>
          )}
          {formData.employeeId && availableLeaveRequests.length === 0 && (
            <small className="field-note">No approved leave requests found for this employee on this date.</small>
          )}
        </div>
      )}

      {formData.status === "Present" || formData.status === "Late" || formData.status === "Half Day" ? (
        <>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="checkIn">Check In Time</label>
              <input type="time" id="checkIn" name="checkIn" value={formData.checkIn} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="checkOut">Check Out Time</label>
              <input type="time" id="checkOut" name="checkOut" value={formData.checkOut} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="workingHours">Working Hours</label>
              <input
                type="number"
                id="workingHours"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                step="0.25"
                min="0"
                readOnly
                className="calculated-field"
              />
              <small className="field-note">Auto-calculated</small>
            </div>

            <div className="form-group">
              <label htmlFor="overtime">Overtime Hours</label>
              <input
                type="number"
                id="overtime"
                name="overtime"
                value={formData.overtime}
                onChange={handleChange}
                step="0.25"
                min="0"
                readOnly
                className="calculated-field"
              />
              <small className="field-note">Auto-calculated</small>
            </div>
          </div>
        </>
      ) : null}

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Additional notes or comments"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          {record ? "Update Attendance" : "Mark Attendance"}
        </button>
      </div>
    </form>
  )
}

export default AttendanceForm
