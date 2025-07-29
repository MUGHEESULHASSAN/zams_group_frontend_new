"use client"

import { useState, useEffect } from "react"
import "./OrderForm.css"

const OrderForm = ({ order, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: "",
    total: 0,
    status: "Pending",
    items: 1,
  })

  useEffect(() => {
    if (order) {
      setFormData(order)
    }
  }, [order])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "total" || name === "items" ? Number(value) : value,
    }))
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="customer">Customer Name</label>
        <input type="text" id="customer" name="customer" value={formData.customer} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="items">Number of Items</label>
          <input
            type="number"
            id="items"
            name="items"
            value={formData.items}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="total">Total Amount</label>
          <input
            type="number"
            id="total"
            name="total"
            value={formData.total}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={formData.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          {order ? "Update Order" : "Create Order"}
        </button>
      </div>
    </form>
  )
}

export default OrderForm
