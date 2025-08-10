"use client"

import { useState, useEffect } from "react"
import "./OrderForm.css"

const OrderForm = ({ order, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: "",
    transactionDate: "",
    memo: "",
    warehouse: "",
    dueDate: "",
    referenceNo: "",
    customerRep: "",
    paymentTerms: "",
    items: [
      {
        item: "",
        account: "",
        unitType: "",
        quantity: 1,
        unitPrice: 0,
        disc: 0,
        tax: 0,
        grossAmount: 0,
      },
    ],
    total: 0,
    totalGross: 0,  // Added total gross amount
    status: "Pending",
  })

  const customers = [
    { id: 1, name: "Customer A" },
    { id: 2, name: "Customer B" },
    { id: 3, name: "Customer C" },
  ]

  const warehouses = [
    { id: 1, name: "Warehouse 1" },
    { id: 2, name: "Warehouse 2" },
  ]

  const items = [
    { id: 1, name: "Item A" },
    { id: 2, name: "Item B" },
  ]

  const accounts = [
    { id: 1, name: "Account 1" },
    { id: 2, name: "Account 2" },
  ]

  useEffect(() => {
    if (order) {
      setFormData(order)
    }
  }, [order])

  useEffect(() => {
    // Recalculate total gross whenever items change
    const totalGross = formData.items.reduce(
      (total, item) => total + item.grossAmount,
      0
    )
    const total = totalGross // You can use totalGross for the total amount as well
    setFormData((prev) => ({
      ...prev,
      totalGross: totalGross,
      total: total, // Set the total value
    }))
  }, [formData.items]) // Trigger when items array changes

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value, dataset } = e.target
    if (dataset.index !== undefined) {
      const updatedItems = [...formData.items]
      updatedItems[dataset.index][name] =
        name === "quantity" || name === "unitPrice" || name === "disc" || name === "tax" 
        ? Number(value) 
        : value

      // Recalculate grossAmount for the item
      updatedItems[dataset.index].grossAmount =
        updatedItems[dataset.index].unitPrice *
          updatedItems[dataset.index].quantity -
        (updatedItems[dataset.index].unitPrice *
          updatedItems[dataset.index].quantity *
          updatedItems[dataset.index].disc) /
          100 +
        updatedItems[dataset.index].tax

      setFormData((prev) => ({
        ...prev,
        items: updatedItems,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "total" ? Number(value) : value,
      }))
    }
  }

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item: "",
          account: "",
          unitType: "",
          quantity: 1,
          unitPrice: 0,
          disc: 0,
          tax: 0,
          grossAmount: 0,
        },
      ],
    }))
  }

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }))
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      {/* Customer */}
      <div className="form-group">
        <label htmlFor="customer">Customer</label>
        <select
          id="customer"
          name="customer"
          value={formData.customer}  // Store the customer ID here
          onChange={handleChange}
          required
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}  {/* Display the customer name here */}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction Date */}
      <div className="form-group">
        <label htmlFor="transactionDate">Transaction Date</label>
        <input
          type="date"
          id="transactionDate"
          name="transactionDate"
          value={formData.transactionDate}
          onChange={handleChange}
          required
        />
      </div>

      {/* Memo */}
      <div className="form-group">
        <label htmlFor="memo">Memo</label>
        <textarea
          id="memo"
          name="memo"
          value={formData.memo}
          onChange={handleChange}
        />
      </div>

      {/* Warehouse */}
      <div className="form-group">
        <label htmlFor="warehouse">Warehouse</label>
        <select
          id="warehouse"
          name="warehouse"
          value={formData.warehouse}
          onChange={handleChange}
          required
        >
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </select>
      </div>

      {/* Due Date */}
      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </div>

      {/* Reference No */}
      <div className="form-group">
        <label htmlFor="referenceNo">Reference No</label>
        <input
          type="text"
          id="referenceNo"
          name="referenceNo"
          value={formData.referenceNo}
          onChange={handleChange}
        />
      </div>

      {/* Customer Rep */}
      <div className="form-group">
        <label htmlFor="customerRep">Customer Representative</label>
        <input
          type="text"
          id="customerRep"
          name="customerRep"
          value={formData.customerRep}
          onChange={handleChange}
        />
      </div>

      {/* Payment Terms */}
      <div className="form-group">
        <label htmlFor="paymentTerms">Payment Terms</label>
        <input
          type="text"
          id="paymentTerms"
          name="paymentTerms"
          value={formData.paymentTerms}
          onChange={handleChange}
        />
      </div>

      {/* Item List */}
      <div className="items-section">
        {formData.items.map((item, index) => (
          <div key={index} className="form-row">
            {/* Item */}
            <div className="form-group">
              <label htmlFor={`item-${index}`}>Item</label>
              <select
                id={`item-${index}`}
                name="item"
                data-index={index}
                value={item.item}
                onChange={handleChange}
                required
              >
                {items.map((itemOption) => (
                  <option key={itemOption.id} value={itemOption.id}>
                    {itemOption.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account */}
            <div className="form-group">
              <label htmlFor={`account-${index}`}>Account</label>
              <select
                id={`account-${index}`}
                name="account"
                data-index={index}
                value={item.account}
                onChange={handleChange}
                required
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit Type */}
            <div className="form-group">
              <label htmlFor={`unitType-${index}`}>Unit Type</label>
              <select
                id={`unitType-${index}`}
                name="unitType"
                data-index={index}
                value={item.unitType}
                onChange={handleChange}
                required
              >
                <option value="kg">KG</option>
                <option value="pcs">Pcs</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label htmlFor={`quantity-${index}`}>Quantity</label>
              <input
                type="number"
                id={`quantity-${index}`}
                name="quantity"
                data-index={index}
                value={item.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            {/* Unit Price */}
            <div className="form-group">
              <label htmlFor={`unitPrice-${index}`}>Unit Price</label>
              <input
                type="number"
                id={`unitPrice-${index}`}
                name="unitPrice"
                data-index={index}
                value={item.unitPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Discount % */}
            <div className="form-group">
              <label htmlFor={`disc-${index}`}>Disc %</label>
              <input
                type="number"
                id={`disc-${index}`}
                name="disc"
                data-index={index}
                value={item.disc}
                onChange={handleChange}
                step="0.01"
                min="0"
              />
            </div>

            {/* Tax */}
            <div className="form-group">
              <label htmlFor={`tax-${index}`}>Tax</label>
              <input
                type="number"
                id={`tax-${index}`}
                name="tax"
                data-index={index}
                value={item.tax}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Gross Amount */}
            <div className="form-group">
              <label htmlFor={`grossAmount-${index}`}>Gross Amount</label>
              <input
                type="number"
                id={`grossAmount-${index}`}
                name="grossAmount"
                data-index={index}
                value={item.grossAmount}
                readOnly
              />
            </div>

            {/* Remove Item */}
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="remove-item-btn"
            >
              Remove Item
            </button>
          </div>
        ))}

        {/* Add Item Button */}
        <button type="button" onClick={handleAddItem} className="add-item-btn">
          Add Item
        </button>
      </div>

      {/* Total Gross Amount */}
      <div className="form-group">
        <label htmlFor="totalGross">Total Gross Amount</label>
        <input
          type="number"
          id="totalGross"
          name="totalGross"
          value={formData.totalGross}
          readOnly
        />
      </div>

      {/* Status */}
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Form Actions */}
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
