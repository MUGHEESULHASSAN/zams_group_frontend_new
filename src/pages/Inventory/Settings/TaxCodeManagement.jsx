"use client"

import { useState, useEffect } from "react"
import "../../Inventory/Settings/ManagementPage.css"

const TaxCodeManagement = () => {
  const [taxCodes, setTaxCodes] = useState([])
  const [newTaxCodeName, setNewTaxCodeName] = useState("")
  const [newTaxCodeRate, setNewTaxCodeRate] = useState("")
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editRate, setEditRate] = useState("")
  const [addError, setAddError] = useState("")
  const [editError, setEditError] = useState("")

  useEffect(() => {
    const storedTaxCodes = JSON.parse(localStorage.getItem("taxCodes")) || [
      { id: "tax-1", name: "GST18", rate: 18, createdAt: "2023-01-15T10:00:00Z" },
      { id: "tax-2", name: "VAT20", rate: 20, createdAt: "2023-02-20T11:30:00Z" },
      { id: "tax-3", name: "None", rate: 0, createdAt: "2023-03-10T14:00:00Z" },
    ]
    setTaxCodes(storedTaxCodes)
  }, [])

  useEffect(() => {
    localStorage.setItem("taxCodes", JSON.stringify(taxCodes))
  }, [taxCodes])

  const handleAddTaxCode = (e) => {
    e.preventDefault()
    setAddError("")
    if (
      !newTaxCodeName.trim() ||
      newTaxCodeRate === "" ||
      isNaN(newTaxCodeRate) ||
      Number.parseFloat(newTaxCodeRate) < 0
    ) {
      setAddError("Tax Code name and a valid non-negative rate are required.")
      return
    }
    if (taxCodes.some((code) => code.name.toLowerCase() === newTaxCodeName.trim().toLowerCase())) {
      setAddError("Tax Code with this name already exists.")
      return
    }

    const newTaxCode = {
      id: `tax-${Date.now()}`,
      name: newTaxCodeName.trim(),
      rate: Number.parseFloat(newTaxCodeRate),
      createdAt: new Date().toISOString(),
    }
    setTaxCodes([...taxCodes, newTaxCode])
    setNewTaxCodeName("")
    setNewTaxCodeRate("")
  }

  const handleEditClick = (taxCode) => {
    setEditId(taxCode.id)
    setEditName(taxCode.name)
    setEditRate(taxCode.rate)
    setEditError("")
  }

  const handleSaveEdit = (id) => {
    setEditError("")
    if (!editName.trim() || editRate === "" || isNaN(editRate) || Number.parseFloat(editRate) < 0) {
      setEditError("Tax Code name and a valid non-negative rate are required.")
      return
    }
    if (taxCodes.some((code) => code.id !== id && code.name.toLowerCase() === editName.trim().toLowerCase())) {
      setEditError("Tax Code with this name already exists.")
      return
    }

    setTaxCodes(
      taxCodes.map((code) =>
        code.id === id ? { ...code, name: editName.trim(), rate: Number.parseFloat(editRate) } : code,
      ),
    )
    setEditId(null)
    setEditName("")
    setEditRate("")
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditName("")
    setEditRate("")
    setEditError("")
  }

  const handleDeleteTaxCode = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the tax code "${name}"?`)) {
      setTaxCodes(taxCodes.filter((code) => code.id !== id))
    }
  }

  return (
    <div className="management-page">
      <h1>Manage Tax Codes</h1>

      <div className="add-form-section">
        <h2>Add New Tax Code</h2>
        <form onSubmit={handleAddTaxCode} className="add-form">
          <div className="form-group">
            <label htmlFor="newTaxCodeName">Tax Code Name</label>
            <input
              type="text"
              id="newTaxCodeName"
              value={newTaxCodeName}
              onChange={(e) => setNewTaxCodeName(e.target.value)}
              className={addError ? "input-error" : ""}
            />
            {addError && <span className="error-message">{addError}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="newTaxCodeRate">Rate (%)</label>
            <input
              type="number"
              id="newTaxCodeRate"
              value={newTaxCodeRate}
              onChange={(e) => setNewTaxCodeRate(e.target.value)}
              className={addError ? "input-error" : ""}
              min="0"
              step="0.01"
            />
          </div>
          <button type="submit">Add Tax Code</button>
        </form>
      </div>

      <div className="data-list-section">
        <h2>Existing Tax Codes</h2>
        <div className="data-table-container">
          <table className="data-table-settings">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rate (%)</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taxCodes.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    No tax codes found.
                  </td>
                </tr>
              ) : (
                taxCodes.map((taxCode) => (
                  <tr key={taxCode.id}>
                    <td>
                      {editId === taxCode.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`edit-input ${editError ? "error" : ""}`}
                        />
                      ) : (
                        taxCode.name
                      )}
                    </td>
                    <td>
                      {editId === taxCode.id ? (
                        <input
                          type="number"
                          value={editRate}
                          onChange={(e) => setEditRate(e.target.value)}
                          className={`edit-input ${editError ? "error" : ""}`}
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        taxCode.rate
                      )}
                    </td>
                    <td>{new Date(taxCode.createdAt).toLocaleDateString()}</td>
                    <td>
                      {editId === taxCode.id ? (
                        <div className="action-buttons edit-actions">
                          <button onClick={() => handleSaveEdit(taxCode.id)} className="save-btn">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="cancel-btn">
                            Cancel
                          </button>
                          {editError && <span className="error-message">{editError}</span>}
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button onClick={() => handleEditClick(taxCode)} className="edit-btn">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteTaxCode(taxCode.id, taxCode.name)} className="delete-btn">
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

export default TaxCodeManagement
