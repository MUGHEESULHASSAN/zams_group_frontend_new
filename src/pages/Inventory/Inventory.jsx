"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import ProductForm from "./ProductForm"
import "./Inventory.css"

const Inventory = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [stockFilter, setStockFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    // Simulate loading products data
    const mockProducts = [
      {
        id: "PROD-001",
        name: "Laptop Computer",
        sku: "LAP-001",
        category: "Electronics",
        stock: 25,
        price: 999.99,
        status: "In Stock",
      },
      {
        id: "PROD-002",
        name: "Office Chair",
        sku: "CHR-001",
        category: "Furniture",
        stock: 5,
        price: 299.99,
        status: "Low Stock",
      },
      {
        id: "PROD-003",
        name: "Wireless Mouse",
        sku: "MOU-001",
        category: "Electronics",
        stock: 0,
        price: 49.99,
        status: "Out of Stock",
      },
      {
        id: "PROD-004",
        name: "Desk Lamp",
        sku: "LAM-001",
        category: "Furniture",
        stock: 15,
        price: 79.99,
        status: "In Stock",
      },
    ]
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
  }, [])

  useEffect(() => {
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (stockFilter === "low") {
      filtered = filtered.filter((product) => product.stock > 0 && product.stock <= 10)
    } else if (stockFilter === "out") {
      filtered = filtered.filter((product) => product.stock === 0)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, stockFilter, products])

  const columns = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Product Name" },
    { key: "category", header: "Category" },
    {
      key: "stock",
      header: "Stock",
      render: (value, row) => (
        <span className={`stock-value ${value === 0 ? "out-of-stock" : value <= 10 ? "low-stock" : "in-stock"}`}>
          {value}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase().replace(" ", "-")}`}>{value}</span>,
    },
  ]

  const handleNewProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Are you sure you want to delete product ${product.name}?`)) {
      setProducts(products.filter((p) => p.id !== product.id))
    }
  }

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts(
        products.map((product) => (product.id === editingProduct.id ? { ...product, ...productData } : product)),
      )
    } else {
      const newProduct = {
        id: `PROD-${String(products.length + 1).padStart(3, "0")}`,
        ...productData,
      }
      setProducts([...products, newProduct])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h1>Inventory Management</h1>
        <button className="primary-btn" onClick={handleNewProduct}>
          ➕ Add Product
        </button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search products..." value={searchTerm} onChange={setSearchTerm} />

        <div className="filter-controls">
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="filter-select">
            <option value="all">All Products</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={filteredProducts} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add Product"}
      >
        <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Inventory
