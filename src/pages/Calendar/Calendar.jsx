"use client"

import { useState, useEffect } from "react"
import Modal from "../../components/Common/Modal"
import EventForm from "./EventForm"
import "./Calendar.css"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month") // 'day', 'week', 'month'
  const [events, setEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    // Simulate loading events
    const mockEvents = [
      {
        id: 1,
        title: "Team Meeting",
        date: "2024-01-15",
        time: "10:00",
        type: "meeting",
        description: "Weekly team sync",
      },
      {
        id: 2,
        title: "Client Presentation",
        date: "2024-01-16",
        time: "14:00",
        type: "presentation",
        description: "Product demo for new client",
      },
      {
        id: 3,
        title: "Project Deadline",
        date: "2024-01-20",
        time: "17:00",
        type: "deadline",
        description: "Final submission due",
      },
    ]
    setEvents(mockEvents)
  }, [])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getEventsForDate = (day) => {
    if (!day) return []
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day) => {
    if (!day) return
    const clickedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(clickedDate)
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  const handleEventClick = (event, e) => {
    e.stopPropagation()
    setEditingEvent(event)
    setSelectedDate(event.date)
    setIsModalOpen(true)
  }

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      setEvents(events.map((event) => (event.id === editingEvent.id ? { ...event, ...eventData } : event)))
    } else {
      const newEvent = {
        id: events.length + 1,
        date: selectedDate,
        ...eventData,
      }
      setEvents([...events, newEvent])
    }
    setIsModalOpen(false)
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId))
    setIsModalOpen(false)
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="nav-btn" onClick={handlePrevMonth}>
            ‹
          </button>
          <h1 className="calendar-title">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          <button className="nav-btn" onClick={handleNextMonth}>
            ›
          </button>
        </div>

        <div className="calendar-controls">
          <div className="view-buttons">
            <button className={`view-btn ${view === "day" ? "active" : ""}`} onClick={() => setView("day")}>
              Day
            </button>
            <button className={`view-btn ${view === "week" ? "active" : ""}`} onClick={() => setView("week")}>
              Week
            </button>
            <button className={`view-btn ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>
              Month
            </button>
          </div>

          <button
            className="primary-btn"
            onClick={() => {
              setSelectedDate(new Date().toISOString().split("T")[0])
              setEditingEvent(null)
              setIsModalOpen(true)
            }}
          >
            ➕ Add Event
          </button>
        </div>
      </div>

      {view === "month" && (
        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {dayNames.map((day) => (
              <div key={day} className="weekday-header">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {getDaysInMonth(currentDate).map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${!day ? "empty" : ""} ${
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()
                    ? "today"
                    : ""
                }`}
                onClick={() => handleDateClick(day)}
              >
                {day && (
                  <>
                    <span className="day-number">{day}</span>
                    <div className="day-events">
                      {getEventsForDate(day).map((event) => (
                        <div
                          key={event.id}
                          className={`event-item ${event.type}`}
                          onClick={(e) => handleEventClick(event, e)}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Edit Event" : "Add Event"}
      >
        <EventForm
          event={editingEvent}
          selectedDate={selectedDate}
          onSave={handleSaveEvent}
          onDelete={editingEvent ? () => handleDeleteEvent(editingEvent.id) : null}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Calendar
