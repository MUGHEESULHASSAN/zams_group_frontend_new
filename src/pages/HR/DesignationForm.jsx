"use client"

import { useState, useEffect } from "react"

const DesignationForm = ({ designation, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    level: "",
    minSalary: 0,
    maxSalary: 0,
    description: "",
    requirements: "",
    responsibilities: "",
    status: "Active",
  })

  useEffect(() => {
    if (designation) {
      setFormData(designation)
    }
  }, [designation])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.minSalary >= formData.maxSalary) {
      alert("Maximum salary must be greater than minimum salary")
      return
    }

    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Salary") ? Number(value) : value,
    }))
  }

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

  const levels = ["Entry", "Junior", "Mid", "Senior", "Lead", "Manager", "Director", "Executive"]

  return (
    <form className="designation-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Designation Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Software Engineer"
          />
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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="level">Level *</label>
          <select id="level" name="level" value={formData.level} onChange={handleChange} required>
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="minSalary">Minimum Salary *</label>
          <input
            type="number"
            id="minSalary"
            name="minSalary"
            value={formData.minSalary}
            onChange={handleChange}
            required
            min="0"
            step="1000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxSalary">Maximum Salary *</label>
          <input
            type="number"
            id="maxSalary"
            name="maxSalary"
            value={formData.maxSalary}
            onChange={handleChange}
            required
            min="0"
            step="1000"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Brief description of the role"
        />
      </div>

      <div className="form-group">
        <label htmlFor="requirements">Requirements</label>
        <textarea
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows="3"
          placeholder="Education, experience, and skill requirements"
        />
      </div>

      <div className="form-group">
        <label htmlFor="responsibilities">Key Responsibilities</label>
        <textarea
          id="responsibilities"
          name="responsibilities"
          value={formData.responsibilities}
          onChange={handleChange}
          rows="4"
          placeholder="Main duties and responsibilities"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          {designation ? "Update Designation" : "Add Designation"}
        </button>
      </div>
    </form>
  )
}

export default DesignationForm
