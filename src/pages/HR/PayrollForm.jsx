"use client"

import { useState, useEffect } from "react"

const PayrollForm = ({ definition, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    designation: "",
    department: "",
    basicSalary: 0,
    allowances: {
      housing: 0,
      transport: 0,
      medical: 0,
      meal: 0,
    },
    deductions: {
      tax: 0,
      insurance: 0,
      providentFund: 0,
    },
    overtime: {
      rate: 0,
      type: "hourly",
    },
    bonus: {
      annual: 0,
      performance: 0,
    },
    totalPackage: 0,
    status: "Active",
  })

  useEffect(() => {
    if (definition) {
      setFormData(definition)
    }
  }, [definition])

  // Auto-calculate total package
  useEffect(() => {
    const totalAllowances = Object.values(formData.allowances).reduce((sum, val) => sum + val, 0)
    const totalDeductions = Object.values(formData.deductions).reduce((sum, val) => sum + val, 0)
    const totalBonus = Object.values(formData.bonus).reduce((sum, val) => sum + val, 0)

    const totalPackage = formData.basicSalary + totalAllowances - totalDeductions + totalBonus

    setFormData((prev) => ({ ...prev, totalPackage }))
  }, [formData.basicSalary, formData.allowances, formData.deductions, formData.bonus])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "basicSalary" || name === "totalPackage" ? Number(value) : value,
    }))
  }

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: Number(value),
      },
    }))
  }

  const designations = [
    "Software Engineer",
    "Senior Software Engineer",
    "Team Lead",
    "Project Manager",
    "HR Manager",
    "Marketing Manager",
    "Sales Executive",
    "Accountant",
  ]

  const departments = [
    "Information Technology",
    "Human Resources",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
    "Customer Service",
    "Research & Development",
  ]

  return (
    <form className="payroll-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="designation">Designation *</label>
          <select id="designation" name="designation" value={formData.designation} onChange={handleChange} required>
            <option value="">Select Designation</option>
            {designations.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <select id="department" name="department" value={formData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="basicSalary">Basic Salary *</label>
        <input
          type="number"
          id="basicSalary"
          name="basicSalary"
          value={formData.basicSalary}
          onChange={handleChange}
          required
          min="0"
          step="100"
        />
      </div>

      {/* Allowances Section */}
      <div className="form-section">
        <h4>Allowances</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Housing Allowance</label>
            <input
              type="number"
              value={formData.allowances.housing}
              onChange={(e) => handleNestedChange("allowances", "housing", e.target.value)}
              min="0"
              step="100"
            />
          </div>
          <div className="form-group">
            <label>Transport Allowance</label>
            <input
              type="number"
              value={formData.allowances.transport}
              onChange={(e) => handleNestedChange("allowances", "transport", e.target.value)}
              min="0"
              step="100"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Medical Allowance</label>
            <input
              type="number"
              value={formData.allowances.medical}
              onChange={(e) => handleNestedChange("allowances", "medical", e.target.value)}
              min="0"
              step="100"
            />
          </div>
          <div className="form-group">
            <label>Meal Allowance</label>
            <input
              type="number"
              value={formData.allowances.meal}
              onChange={(e) => handleNestedChange("allowances", "meal", e.target.value)}
              min="0"
              step="100"
            />
          </div>
        </div>
      </div>

      {/* Deductions Section */}
      <div className="form-section">
        <h4>Deductions</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Tax Deduction</label>
            <input
              type="number"
              value={formData.deductions.tax}
              onChange={(e) => handleNestedChange("deductions", "tax", e.target.value)}
              min="0"
              step="100"
            />
          </div>
          <div className="form-group">
            <label>Insurance</label>
            <input
              type="number"
              value={formData.deductions.insurance}
              onChange={(e) => handleNestedChange("deductions", "insurance", e.target.value)}
              min="0"
              step="100"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Provident Fund</label>
          <input
            type="number"
            value={formData.deductions.providentFund}
            onChange={(e) => handleNestedChange("deductions", "providentFund", e.target.value)}
            min="0"
            step="100"
          />
        </div>
      </div>

      {/* Overtime Section */}
      <div className="form-section">
        <h4>Overtime</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Overtime Rate</label>
            <input
              type="number"
              value={formData.overtime.rate}
              onChange={(e) => handleNestedChange("overtime", "rate", e.target.value)}
              min="0"
              step="0.5"
            />
          </div>
          <div className="form-group">
            <label>Rate Type</label>
            <select
              value={formData.overtime.type}
              onChange={(e) => handleNestedChange("overtime", "type", e.target.value)}
            >
              <option value="hourly">Per Hour</option>
              <option value="daily">Per Day</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bonus Section */}
      <div className="form-section">
        <h4>Bonus</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Annual Bonus</label>
            <input
              type="number"
              value={formData.bonus.annual}
              onChange={(e) => handleNestedChange("bonus", "annual", e.target.value)}
              min="0"
              step="100"
            />
          </div>
          <div className="form-group">
            <label>Performance Bonus</label>
            <input
              type="number"
              value={formData.bonus.performance}
              onChange={(e) => handleNestedChange("bonus", "performance", e.target.value)}
              min="0"
              step="100"
            />
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="totalPackage">Total Package</label>
          <input
            type="number"
            id="totalPackage"
            name="totalPackage"
            value={formData.totalPackage}
            readOnly
            className="calculated-field"
          />
          <small className="field-note">Auto-calculated</small>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          {definition ? "Update Definition" : "Add Definition"}
        </button>
      </div>
    </form>
  )
}

export default PayrollForm
