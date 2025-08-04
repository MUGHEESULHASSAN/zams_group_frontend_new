"use client"

import { useState, useEffect } from "react"
import "../../Inventory/Settings/ManagementPage.css"

const UnitTypeManagement = () => {
  const [unitTypes, setUnitTypes] = useState([])
  const [newUnitTypeName, setNewUnitTypeName] = useState("")
  const [newUnitTypeDescription, setNewUnitTypeDescription] = useState("")
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [addError, setAddError] = useState("")
  const [editError, setEditError] = useState("")

  useEffect(() => {
    const storedUnitTypes = JSON.parse(localStorage.getItem("unitTypes")) || [
      { id: "unit-1", name: "Piece", description: "Single item", createdAt: "2023-01-15T10:00:00Z" },
      { id: "unit-2", name: "Kg", description: "Kilogram", createdAt: "2023-02-20T11:30:00Z" },
      { id: "unit-3", name: "Liter", description: "Volume in liters", createdAt: "2023-03-10T14:00:00Z" },
    ]
    setUnitTypes(storedUnitTypes)
  }, [])

  useEffect(() => {
    localStorage.setItem("unitTypes", JSON.stringify(unitTypes))
  }, [unitTypes])

  const handleAddUnitType = (e) => {
    e.preventDefault()
    setAddError("")
    if (!newUnitTypeName.trim()) {
      setAddError("Unit Type name cannot be empty.")
      return
    }
    if (unitTypes.some((unit) => unit.name.toLowerCase() === newUnitTypeName.trim().toLowerCase())) {
      setAddError("Unit Type with this name already exists.")
      return
    }

    const newUnitType = {
      id: `unit-${Date.now()}`,
      name: newUnitTypeName.trim(),
      description: newUnitTypeDescription.trim(),
      createdAt: new Date().toISOString(),
    }
    setUnitTypes([...unitTypes, newUnitType])
    setNewUnitTypeName("")
    setNewUnitTypeDescription("")
  }

  const handleEditClick = (unitType) => {
    setEditId(unitType.id)
    setEditName(unitType.name)
    setEditDescription(unitType.description)
    setEditError("")
  }

  const handleSaveEdit = (id) => {
    setEditError("")
    if (!editName.trim()) {
      setEditError("Unit Type name cannot be empty.")
      return
    }
    if (unitTypes.some((unit) => unit.id !== id && unit.name.toLowerCase() === editName.trim().toLowerCase())) {
      setEditError("Unit Type with this name already exists.")
      return
    }

    setUnitTypes(
      unitTypes.map((unit) =>
        unit.id === id ? { ...unit, name: editName.trim(), description: editDescription.trim() } : unit,
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

  const handleDeleteUnitType = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the unit type "${name}"?`)) {
      setUnitTypes(unitTypes.filter((unit) => unit.id !== id))
    }
  }

  return (
    <div className="management-page">
      <h1>Manage Unit Types</h1>

      <div className="add-form-section">
        <h2>Add New Unit Type</h2>
        <form onSubmit={handleAddUnitType} className="add-form">
          <div className="form-group">
            <label htmlFor="newUnitTypeName">Unit Type Name</label>
            <input
              type="text"
              id="newUnitTypeName"
              value={newUnitTypeName}
              onChange={(e) => setNewUnitTypeName(e.target.value)}
              className={addError ? "input-error" : ""}
            />
            {addError && <span className="error-message">{addError}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="newUnitTypeDescription">Description (Optional)</label>
            <textarea
              id="newUnitTypeDescription"
              value={newUnitTypeDescription}
              onChange={(e) => setNewUnitTypeDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit">Add Unit Type</button>
        </form>
      </div>

      <div className="data-list-section">
        <h2>Existing Unit Types</h2>
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
              {unitTypes.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    No unit types found.
                  </td>
                </tr>
              ) : (
                unitTypes.map((unitType) => (
                  <tr key={unitType.id}>
                    <td>
                      {editId === unitType.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`edit-input ${editError ? "error" : ""}`}
                        />
                      ) : (
                        unitType.name
                      )}
                    </td>
                    <td>
                      {editId === unitType.id ? (
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="edit-input"
                        ></textarea>
                      ) : (
                        unitType.description || "-"
                      )}
                    </td>
                    <td>{new Date(unitType.createdAt).toLocaleDateString()}</td>
                    <td>
                      {editId === unitType.id ? (
                        <div className="action-buttons edit-actions">
                          <button onClick={() => handleSaveEdit(unitType.id)} className="save-btn">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="cancel-btn">
                            Cancel
                          </button>
                          {editError && <span className="error-message">{editError}</span>}
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button onClick={() => handleEditClick(unitType)} className="edit-btn">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUnitType(unitType.id, unitType.name)}
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

export default UnitTypeManagement
