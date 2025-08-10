import { useState, useEffect } from "react"

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active",
    category: "",
    address: "",
    cnic: "",
    customerCode: "",
    priceType: "",
    ntnNumber: "",
  })

  useEffect(() => {
    if (customer) {
      setFormData(customer)
    }
  }, [customer])

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

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Customer Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="category">Customer Category</label>
        <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="cnic">CNIC Number</label>
        <input type="text" id="cnic" name="cnic" value={formData.cnic} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="customerCode">Customer Code</label>
        <input type="text" id="customerCode" name="customerCode" value={formData.customerCode} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="priceType">Price Type</label>
        <input type="text" id="priceType" name="priceType" value={formData.priceType} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="ntnNumber">NTN Number</label>
        <input type="text" id="ntnNumber" name="ntnNumber" value={formData.ntnNumber} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={formData.status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          {customer ? "Update Customer" : "Add Customer"}
        </button>
      </div>
    </form>
  )
}

export default CustomerForm
