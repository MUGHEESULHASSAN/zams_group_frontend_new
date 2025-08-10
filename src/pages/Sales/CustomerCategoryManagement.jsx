"use client"

import { useState, useEffect } from "react"

// Static account options
const accountOptions = [
  { id: "acc-1", name: "Accounts Receivable - Domestic" },
  { id: "acc-2", name: "Accounts Receivable - Export" },
  { id: "acc-3", name: "Accounts Receivable - Wholesale" },
  { id: "acc-4", name: "Accounts Receivable - Retail" },
]

const CustomerCategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState({ name: "", receivableAccount: "" })
  const [addError, setAddError] = useState("")
  const [editId, setEditId] = useState(null)
  const [editCategory, setEditCategory] = useState({ name: "", receivableAccount: "" })
  const [editError, setEditError] = useState("")

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("customerCategories")) || []
    setCategories(stored)
  }, [])

  useEffect(() => {
    localStorage.setItem("customerCategories", JSON.stringify(categories))
  }, [categories])

  const handleAddCategory = (e) => {
    e.preventDefault()
    setAddError("")

    const { name, receivableAccount } = newCategory

    if (!name.trim() || !receivableAccount.trim()) {
      setAddError("All fields are required.")
      return
    }

    if (categories.some(cat => cat.name.toLowerCase() === name.trim().toLowerCase())) {
      setAddError("Category with this name already exists.")
      return
    }

    const newCat = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      receivableAccount: receivableAccount.trim(),
      createdAt: new Date().toISOString(),
    }

    setCategories([...categories, newCat])
    setNewCategory({ name: "", receivableAccount: "" })
  }

  const handleEditClick = (cat) => {
    setEditId(cat.id)
    setEditCategory({ name: cat.name, receivableAccount: cat.receivableAccount })
    setEditError("")
  }

  const handleSaveEdit = (id) => {
    setEditError("")
    const { name, receivableAccount } = editCategory

    if (!name.trim() || !receivableAccount.trim()) {
      setEditError("All fields are required.")
      return
    }

    if (categories.some(cat => cat.id !== id && cat.name.toLowerCase() === name.trim().toLowerCase())) {
      setEditError("Category with this name already exists.")
      return
    }

    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, name: name.trim(), receivableAccount: receivableAccount.trim() } : cat
    ))
    setEditId(null)
    setEditCategory({ name: "", receivableAccount: "" })
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditCategory({ name: "", receivableAccount: "" })
    setEditError("")
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      setCategories(categories.filter(cat => cat.id !== id))
    }
  }

  return (
    <div className="management-page">
      <h1>Manage Customer Categories</h1>

      <div className="add-form-section">
        <h2>Add New Category</h2>
        <form onSubmit={handleAddCategory} className="add-form">
          <div className="form-group">
            <label htmlFor="newCategoryName">Name</label>
            <input
              type="text"
              id="newCategoryName"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className={addError ? "input-error" : ""}
            />
          </div>
          <div className="form-group">
            <label htmlFor="receivableAccount">Receivable Account</label>
            <select
              id="receivableAccount"
              value={newCategory.receivableAccount}
              onChange={(e) => setNewCategory({ ...newCategory, receivableAccount: e.target.value })}
              className={addError ? "input-error" : ""}
            >
              <option value="">-- Select Account --</option>
              {accountOptions.map((account) => (
                <option key={account.id} value={account.name}>
                  {account.name}
                </option>
              ))}
            </select>
            {addError && <span className="error-message">{addError}</span>}
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
                <th>Receivable Account</th>
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
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      {editId === cat.id ? (
                        <input
                          type="text"
                          value={editCategory.name}
                          onChange={(e) =>
                            setEditCategory({ ...editCategory, name: e.target.value })
                          }
                          className={`edit-input ${editError ? "error" : ""}`}
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td>
                      {editId === cat.id ? (
                        <select
                          value={editCategory.receivableAccount}
                          onChange={(e) =>
                            setEditCategory({ ...editCategory, receivableAccount: e.target.value })
                          }
                          className={`edit-input ${editError ? "error" : ""}`}
                        >
                          <option value="">-- Select Account --</option>
                          {accountOptions.map((account) => (
                            <option key={account.id} value={account.name}>
                              {account.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        cat.receivableAccount
                      )}
                    </td>
                    <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                    <td>
                      {editId === cat.id ? (
                        <div className="action-buttons edit-actions">
                          <button onClick={() => handleSaveEdit(cat.id)} className="save-btn">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="cancel-btn">
                            Cancel
                          </button>
                          {editError && <span className="error-message">{editError}</span>}
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button onClick={() => handleEditClick(cat)} className="edit-btn">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(cat.id, cat.name)} className="delete-btn">
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

export default CustomerCategoryManagement
