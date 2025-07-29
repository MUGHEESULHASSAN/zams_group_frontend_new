"use client"

import { useState, useEffect } from "react"

const TransactionForm = ({ transaction, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    description: "",
    type: "Expense",
    amount: 0,
    category: "",
    status: "Completed",
  })

  useEffect(() => {
    if (transaction) {
      setFormData(transaction)
    }
  }, [transaction])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }))
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} required>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Sales Revenue">Sales Revenue</option>
            <option value="Office Expenses">Office Expenses</option>
            <option value="Marketing">Marketing</option>
            <option value="Travel">Travel</option>
            <option value="Utilities">Utilities</option>
            <option value="Equipment">Equipment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          {transaction ? "Update Transaction" : "Add Transaction"}
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
