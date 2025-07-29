"use client"

import { useState, useEffect } from "react"

const EventForm = ({ event, selectedDate, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: selectedDate || "",
    time: "",
    type: "meeting",
    description: "",
  })

  useEffect(() => {
    if (event) {
      setFormData(event)
    } else if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }))
    }
  }, [event, selectedDate])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Event Title</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="type">Event Type</label>
        <select id="type" name="type" value={formData.type} onChange={handleChange}>
          <option value="meeting">Meeting</option>
          <option value="presentation">Presentation</option>
          <option value="deadline">Deadline</option>
          <option value="reminder">Reminder</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" />
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        {onDelete && (
          <button type="button" className="danger-btn" onClick={onDelete}>
            Delete
          </button>
        )}
        <button type="submit" className="primary-btn">
          {event ? "Update Event" : "Add Event"}
        </button>
      </div>
    </form>
  )
}

export default EventForm
