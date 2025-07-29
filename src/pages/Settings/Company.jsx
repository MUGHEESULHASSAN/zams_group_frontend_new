"use client"

import { useState } from "react"

const Company = () => {
  const [companyData, setCompanyData] = useState({
    name: "Acme Corporation",
    address: "123 Business St",
    city: "Business City",
    state: "BC",
    zipCode: "12345",
    phone: "+1-555-0100",
    email: "info@acme.com",
    website: "www.acme.com",
    taxId: "12-3456789",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Company information updated successfully!")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="company-page">
      <div className="page-header">
        <h1>Company Information</h1>
      </div>

      <form className="company-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Company Name</label>
          <input type="text" id="name" name="name" value={companyData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" value={companyData.address} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input type="text" id="city" name="city" value={companyData.city} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input type="text" id="state" name="state" value={companyData.state} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">ZIP Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={companyData.zipCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" value={companyData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={companyData.email} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input type="url" id="website" name="website" value={companyData.website} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="taxId">Tax ID</label>
            <input type="text" id="taxId" name="taxId" value={companyData.taxId} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn">
            Update Company Information
          </button>
        </div>
      </form>
    </div>
  )
}

export default Company
