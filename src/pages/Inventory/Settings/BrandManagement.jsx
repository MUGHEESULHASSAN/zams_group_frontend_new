"use client"

import { useState, useEffect } from "react"
import "../../Inventory/Settings/ManagementPage.css"

const BrandManagement = () => {
  const [brands, setBrands] = useState([])
  const [newBrandName, setNewBrandName] = useState("")
  const [newBrandDescription, setNewBrandDescription] = useState("")
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [addError, setAddError] = useState("")
  const [editError, setEditError] = useState("")

  useEffect(() => {
    const storedBrands = JSON.parse(localStorage.getItem("brands")) || [
      {
        id: "brand-1",
        name: "TechBrand",
        description: "Leading electronics manufacturer",
        createdAt: "2023-01-15T10:00:00Z",
      },
      {
        id: "brand-2",
        name: "ComfortSeating",
        description: "Ergonomic office furniture",
        createdAt: "2023-02-20T11:30:00Z",
      },
      {
        id: "brand-3",
        name: "ClickTech",
        description: "Innovative computer peripherals",
        createdAt: "2023-03-10T14:00:00Z",
      },
      {
        id: "brand-4",
        name: "BrightHome",
        description: "Modern home lighting solutions",
        createdAt: "2023-04-01T09:00:00Z",
      },
    ]
    setBrands(storedBrands)
  }, [])

  useEffect(() => {
    localStorage.setItem("brands", JSON.stringify(brands))
  }, [brands])

  const handleAddBrand = (e) => {
    e.preventDefault()
    setAddError("")
    if (!newBrandName.trim()) {
      setAddError("Brand name cannot be empty.")
      return
    }
    if (brands.some((brand) => brand.name.toLowerCase() === newBrandName.trim().toLowerCase())) {
      setAddError("Brand with this name already exists.")
      return
    }

    const newBrand = {
      id: `brand-${Date.now()}`,
      name: newBrandName.trim(),
      description: newBrandDescription.trim(),
      createdAt: new Date().toISOString(),
    }
    setBrands([...brands, newBrand])
    setNewBrandName("")
    setNewBrandDescription("")
  }

  const handleEditClick = (brand) => {
    setEditId(brand.id)
    setEditName(brand.name)
    setEditDescription(brand.description)
    setEditError("")
  }

  const handleSaveEdit = (id) => {
    setEditError("")
    if (!editName.trim()) {
      setEditError("Brand name cannot be empty.")
      return
    }
    if (brands.some((brand) => brand.id !== id && brand.name.toLowerCase() === editName.trim().toLowerCase())) {
      setEditError("Brand with this name already exists.")
      return
    }

    setBrands(
      brands.map((brand) =>
        brand.id === id ? { ...brand, name: editName.trim(), description: editDescription.trim() } : brand,
      ),
    )
    setEditId(null)
    setEditName("")
    setEditDescription("")
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditName("")
    setEditDescription("")
    setEditError("")
  }

  const handleDeleteBrand = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the brand "${name}"?`)) {
      setBrands(brands.filter((brand) => brand.id !== id))
    }
  }

  return (
    <div className="management-page">
      <h1>Manage Brands</h1>

      <div className="add-form-section">
        <h2>Add New Brand</h2>
        <form onSubmit={handleAddBrand} className="add-form">
          <div className="form-group">
            <label htmlFor="newBrandName">Brand Name</label>
            <input
              type="text"
              id="newBrandName"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className={addError ? "input-error" : ""}
            />
            {addError && <span className="error-message">{addError}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="newBrandDescription">Description (Optional)</label>
            <textarea
              id="newBrandDescription"
              value={newBrandDescription}
              onChange={(e) => setNewBrandDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit">Add Brand</button>
        </form>
      </div>

      <div className="data-list-section">
        <h2>Existing Brands</h2>
        <div className="data-table-container">
          <table className="data-table-settings">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    No brands found.
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.id}>
                    <td>
                      {editId === brand.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`edit-input ${editError ? "error" : ""}`}
                        />
                      ) : (
                        brand.name
                      )}
                    </td>
                    <td>
                      {editId === brand.id ? (
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="edit-input"
                        ></textarea>
                      ) : (
                        brand.description || "-"
                      )}
                    </td>
                    <td>{new Date(brand.createdAt).toLocaleDateString()}</td>
                    <td>
                      {editId === brand.id ? (
                        <div className="action-buttons edit-actions">
                          <button onClick={() => handleSaveEdit(brand.id)} className="save-btn">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="cancel-btn">
                            Cancel
                          </button>
                          {editError && <span className="error-message">{editError}</span>}
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button onClick={() => handleEditClick(brand)} className="edit-btn">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteBrand(brand.id, brand.name)} className="delete-btn">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BrandManagement
