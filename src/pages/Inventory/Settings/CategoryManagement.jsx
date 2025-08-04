"use client"

import { useState, useEffect } from "react"
import "../../Inventory/Settings/ManagementPage.css"

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [addError, setAddError] = useState("")
  const [editError, setEditError] = useState("")

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem("categories")) || [
      {
        id: "cat-1",
        name: "Electronics",
        description: "Electronic gadgets and devices",
        createdAt: "2023-01-15T10:00:00Z",
      },
      { id: "cat-2", name: "Furniture", description: "Home and office furniture", createdAt: "2023-02-20T11:30:00Z" },
      { id: "cat-3", name: "Apparel", description: "Clothing and accessories", createdAt: "2023-03-10T14:00:00Z" },
    ]
    setCategories(storedCategories)
  }, [])

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories))
  }, [categories])

  const handleAddCategory = (e) => {
    e.preventDefault()
    setAddError("")
    if (!newCategoryName.trim()) {
      setAddError("Category name cannot be empty.")
      return
    }
    if (categories.some((cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      setAddError("Category with this name already exists.")
      return
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim(),
      createdAt: new Date().toISOString(),
    }
    setCategories([...categories, newCategory])
    setNewCategoryName("")
    setNewCategoryDescription("")
  }

  const handleEditClick = (category) => {
    setEditId(category.id)
    setEditName(category.name)
    setEditDescription(category.description)
    setEditError("")
  }

  const handleSaveEdit = (id) => {
    setEditError("")
    if (!editName.trim()) {
      setEditError("Category name cannot be empty.")
      return
    }
    if (categories.some((cat) => cat.id !== id && cat.name.toLowerCase() === editName.trim().toLowerCase())) {
      setEditError("Category with this name already exists.")
      return
    }

    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, name: editName.trim(), description: editDescription.trim() } : cat,
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

  const handleDeleteCategory = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      setCategories(categories.filter((cat) => cat.id !== id))
    }
  }

  return (
    <div className="management-page">
      <h1>Manage Categories</h1>

      <div className="add-form-section">
        <h2>Add New Category</h2>
        <form onSubmit={handleAddCategory} className="add-form">
          <div className="form-group">
            <label htmlFor="newCategoryName">Category Name</label>
            <input
              type="text"
              id="newCategoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className={addError ? "input-error" : ""}
            />
            {addError && <span className="error-message">{addError}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="newCategoryDescription">Description (Optional)</label>
            <textarea
              id="newCategoryDescription"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit">Add Category</button>
        </form>
      </div>

      <div className="data-list-section">
        <h2>Existing Categories</h2>
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
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      {editId === category.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`edit-input ${editError ? "error" : ""}`}
                        />
                      ) : (
                        category.name
                      )}
                    </td>
                    <td>
                      {editId === category.id ? (
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="edit-input"
                        ></textarea>
                      ) : (
                        category.description || "-"
                      )}
                    </td>
                    <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                    <td>
                      {editId === category.id ? (
                        <div className="action-buttons edit-actions">
                          <button onClick={() => handleSaveEdit(category.id)} className="save-btn">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="cancel-btn">
                            Cancel
                          </button>
                          {editError && <span className="error-message">{editError}</span>}
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button onClick={() => handleEditClick(category)} className="edit-btn">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id, category.name)}
                            className="delete-btn"
                          >
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

export default CategoryManagement
