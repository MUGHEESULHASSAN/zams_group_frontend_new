"use client"

import { useState, useEffect } from "react"
import "./EmployeeForm.css"

const EmployeeForm = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    gender: "",
    fatherName: "",
    address: "",
    cnic: "",
    religion: "",
    email: "",
    contact: "",
    city: "",
    country: "",
    hiringDate: "",
    avatar: "", // New field for employee photo

    // Job Details
    designation: "",
    location: "",
    supervisor: "",
    workingStatus: "Active",
    department: "",
    resignationDate: "",

    // Salary Information
    basicSalary: 0,
    benefits: "",
    grossSalary: 0,

    // Other Information
    attachments: [],
    access: "",
    salesTarget: 0,
    employeeHistory: "",
    area: "",

    // Legacy fields (kept for compatibility with DataTable columns)
    position: "",
    salary: 0,
    status: "Active",
  })

  const [activeSection, setActiveSection] = useState("personal")
  const [attachmentFiles, setAttachmentFiles] = useState([])
  const [avatarPreview, setAvatarPreview] = useState("")

  useEffect(() => {
    if (employee) {
      setFormData({ ...formData, ...employee })
      if (employee.avatar) {
        setAvatarPreview(employee.avatar)
      }
      // Assuming attachments are stored as file objects or URLs,
      // for simplicity, we'll just clear them on edit for now or handle differently.
      // If employee.attachments were URLs, you'd fetch them or handle differently.
      setAttachmentFiles([])
    }
  }, [employee])

  // Auto-calculate gross salary when basic salary or benefits change
  useEffect(() => {
    const benefitsAmount = Number.parseFloat(formData.benefits) || 0
    const grossSalary = formData.basicSalary + benefitsAmount
    setFormData((prev) => ({ ...prev, grossSalary }))
  }, [formData.basicSalary, formData.benefits])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = ["name", "email", "contact", "designation", "department"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(", ")}`)
      return
    }

    // Prepare data for saving
    const saveData = {
      ...formData,
      attachments: attachmentFiles, // This would typically be handled by uploading to storage
      avatar: avatarPreview, // Save the base64 string or URL
      // Sync legacy fields
      position: formData.designation,
      salary: formData.basicSalary,
      status: formData.workingStatus,
    }

    onSave(saveData)
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setAttachmentFiles((prev) => [...prev, ...files])
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        setFormData((prev) => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    } else {
      setAvatarPreview("")
      setFormData((prev) => ({ ...prev, avatar: "" }))
    }
  }

  const removeAttachment = (index) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const sections = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "job", label: "Job Details", icon: "💼" },
    { id: "salary", label: "Salary Info", icon: "💰" },
    { id: "other", label: "Other Info", icon: "📋" },
  ]

  const designations = [
    "Software Engineer",
    "Senior Software Engineer",
    "Team Lead",
    "Project Manager",
    "HR Manager",
    "Marketing Manager",
    "Sales Executive",
    "Accountant",
    "System Administrator",
    "Business Analyst",
    "UI/UX Designer",
    "DevOps Engineer",
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

  const supervisors = [
    "John Smith - Team Lead",
    "Sarah Johnson - Project Manager",
    "Mike Wilson - Senior Manager",
    "Lisa Brown - Department Head",
  ]

  const accessRoles = ["Admin", "Manager", "Employee", "HR", "Finance", "Sales", "Read Only"]

  return (
    <div className="employee-form-container">
      {/* Section Navigation */}
      <div className="form-sections">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`section-tab ${activeSection === section.id ? "active" : ""}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="section-icon">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      <form className="employee-form" onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        {activeSection === "personal" && (
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>

            <div className="form-group avatar-upload-group">
              <label htmlFor="avatar">Employee Photo</label>
              <div className="avatar-preview-area">
                {avatarPreview ? (
                  <img src={avatarPreview || "/placeholder.svg"} alt="Employee Avatar" className="avatar-preview-img" />
                ) : (
                  <div className="avatar-placeholder-large">
                    {formData.name
                      ? formData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "N/A"}
                  </div>
                )}
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="file-input-avatar"
                />
                <label htmlFor="avatar" className="upload-button">
                  Upload Photo
                </label>
              </div>
              <small className="field-note">Upload a clear photo of the employee.</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fatherName">Father's Name</label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Enter father's name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cnic">CNIC</label>
                <input
                  type="text"
                  id="cnic"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  placeholder="00000-0000000-0"
                  pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Enter complete address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="religion">Religion</label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  placeholder="Enter religion"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hiringDate">Hiring Date</label>
                <input
                  type="date"
                  id="hiringDate"
                  name="hiringDate"
                  value={formData.hiringDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact">Contact Number *</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="+1-555-0123"
                />
              </div>
            </div>
          </div>
        )}

        {/* Job Details Section */}
        {activeSection === "job" && (
          <div className="form-section">
            <h3 className="section-title">Job Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="designation">Designation *</label>
                <select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                >
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Work location"
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">Area</label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Work area/region"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="supervisor">Supervisor</label>
                <select id="supervisor" name="supervisor" value={formData.supervisor} onChange={handleChange}>
                  <option value="">Select Supervisor</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor} value={supervisor}>
                      {supervisor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="workingStatus">Working Status</label>
                <select id="workingStatus" name="workingStatus" value={formData.workingStatus} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Resigned">Resigned</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>

            {formData.workingStatus === "Resigned" && (
              <div className="form-group">
                <label htmlFor="resignationDate">Resignation Date</label>
                <input
                  type="date"
                  id="resignationDate"
                  name="resignationDate"
                  value={formData.resignationDate}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        )}

        {/* Salary Information Section */}
        {activeSection === "salary" && (
          <div className="form-section">
            <h3 className="section-title">Salary Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="basicSalary">Basic Salary</label>
                <input
                  type="number"
                  id="basicSalary"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="benefits">Benefits/Allowances</label>
                <input
                  type="number"
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="grossSalary">Gross Salary</label>
                <input
                  type="number"
                  id="grossSalary"
                  name="grossSalary"
                  value={formData.grossSalary}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Auto-calculated"
                  className="calculated-field"
                />
                <small className="field-note">Auto-calculated from Basic Salary + Benefits</small>
              </div>

              <div className="form-group">
                <label htmlFor="salesTarget">Sales Target</label>
                <input
                  type="number"
                  id="salesTarget"
                  name="salesTarget"
                  value={formData.salesTarget}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        )}

        {/* Other Information Section */}
        {activeSection === "other" && (
          <div className="form-section">
            <h3 className="section-title">Other Information</h3>

            <div className="form-group">
              <label htmlFor="access">Access Level/Role</label>
              <select id="access" name="access" value={formData.access} onChange={handleChange}>
                <option value="">Select Access Level</option>
                {accessRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="employeeHistory">Employee History</label>
              <textarea
                id="employeeHistory"
                name="employeeHistory"
                value={formData.employeeHistory}
                onChange={handleChange}
                rows="4"
                placeholder="Enter employee history, previous positions, achievements, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="attachments">Attachments</label>
              <input
                type="file"
                id="attachments"
                name="attachments"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="file-input"
              />
              <small className="field-note">Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB each)</small>

              {attachmentFiles.length > 0 && (
                <div className="attachment-list">
                  <h4>Attached Files:</h4>
                  {attachmentFiles.map((file, index) => (
                    <div key={index} className="attachment-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button type="button" className="remove-attachment" onClick={() => removeAttachment(index)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            {employee ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EmployeeForm
