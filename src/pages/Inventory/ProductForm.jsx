"use client"

import { useState, useEffect } from "react"

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    stock: 0,
    price: 0,
    status: "In Stock",
  })

  useEffect(() => {
    if (product) {
      setFormData(product)
    }
  }, [product])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Auto-determine status based on stock
    let status = "In Stock"
    if (formData.stock === 0) {
      status = "Out of Stock"
    } else if (formData.stock <= 10) {
      status = "Low Stock"
    }

    onSave({ ...formData, status })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "price" ? Number(value) : value,
    }))
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="sku">SKU</label>
          <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="stock">Stock Quantity</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          {product ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
