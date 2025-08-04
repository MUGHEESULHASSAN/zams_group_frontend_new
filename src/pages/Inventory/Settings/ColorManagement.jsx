"use client"

import { useState, useEffect } from "react"
import "../../Inventory/Settings/ManagementPage.css"

const ColorManagement = () => {
  const [colors, setColors] = useState([])
  const [newColorName, setNewColorName] = useState("")
  const [addError, setAddError] = useState("")
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editError, setEditError] = useState("")

  useEffect(() => {
    const storedColors = JSON.parse(localStorage.getItem("colors")) || [
      { id: "color-1", name: "Red", createdAt: "2023-01-15T10:00:00Z" },
      { id: "color-2", name: "Blue", createdAt: "2023-02-20T11:30:00Z" },
      { id: "color-3", name: "Green", createdAt: "2023-03-10T14:00:00Z" },
      { id: "color-4", name: "Black", createdAt: "2023-04-01T09:00:00Z" },
      { id: "color-5", name: "White", createdAt: "2023-05-05T16:00:00Z" },
    ]
    setColors(storedColors)
  }, [])

  useEffect(() => {
    localStorage.setItem("colors", JSON.stringify(colors))
  }, [colors])

  const handleAddColor = (e) => {
    e.preventDefault()
    setAddError("")
    if (!newColorName.trim()) {
      setAddError("Color name cannot be empty.")
      return
    }
    if (colors.some((color) => color.name.toLowerCase() === newColorName.trim().toLowerCase())) {
      setAddError("Color with this name already exists.")
      return
    }

    const newColor = {
      id: `color-${Date.now()}`,
      name: newColorName.trim(),
      createdAt: new Date().toISOString(),
    }
    setColors([...colors, newColor])
    setNewColorName("")
  }

  const handleEditClick = (color) => {
    setEditId(color.id)
    setEditName(color.name)
    setEditError("")
  }

  const handleSaveEdit = (id) => {
    setEditError("")
    if (!editName.trim()) {
      setEditError("Color name cannot be empty.")
      return
    }
    if (colors.some((color) => color.id !== id && color.name.toLowerCase() === editName.trim().toLowerCase())) {
      setEditError("Color with this name already exists.")
      return
    }

    setColors(colors.map((color) => (color.id === id ? { ...color, name: editName.trim() } : color)))
    setEditId(null)
    setEditName("")
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditName("")
    setEditError("")
  }

  const handleDeleteColor = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the color "${name}"?`)) {
      setColors(colors.filter((color) => color.id !== id))
    }
  }

  return (
    <div className="management-page">
      <h1>Manage Colors</h1>

      <div className="add-form-section">
        <h2>Add New Color</h2>
        <form onSubmit={handleAddColor} className="add-form">
          <div className="form-group">
            <label htmlFor="newColorName">Color Name</label>
            <input
              type="text"
              id="newColorName"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              className={addError ? "input-error" : ""}
            />
            {addError && <span className="error-message">{addError}</span>}
          </div>
          <button type="submit">Add Color</button>
        </form>
      </div>

      <div className="data-list-section">
        <h2>Existing Colors</h2>
        <div className="data-table-container">
          <table className="data-table-settings">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {colors.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    No colors found.
                  </td>
                </tr>
              ) : (
                colors.map((color) => (
                  <tr key={color.id}>
                    <td>
                      {editId === color.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`edit-input ${editError ? "error" : ""}`}
                        />
                      ) : (
                        color.name
                      )}
                    </td>
                    <td>{new Date(color.createdAt).toLocaleDateString()}</td>
                    <td>
                      {editId === color.id ? (
                        <div className="action-buttons edit-actions">
                          <button onClick={() => handleSaveEdit(color.id)} className="save-btn">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="cancel-btn">
                            Cancel
                          </button>
                          {editError && <span className="error-message">{editError}</span>}
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button onClick={() => handleEditClick(color)} className="edit-btn">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteColor(color.id, color.name)} className="delete-btn">
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

export default ColorManagement
