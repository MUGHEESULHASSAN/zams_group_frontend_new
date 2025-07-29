"use client"

import { useState, useEffect } from "react"

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1-555-0123",
    department: "IT",
    position: "System Administrator",
    avatar: "/placeholder.svg?height=120&width=120", // Default avatar
  })

  // Simulate fetching user profile data (e.g., from a global state or API)
  useEffect(() => {
    // In a real app, you'd fetch the logged-in user's profile here.
    // For now, we'll use a mock user.
    const mockLoggedInUser = {
      name: "John Doe",
      email: "john.doe@company.com",
      phone: "+1-555-0123",
      department: "IT",
      position: "System Administrator",
      avatar: "/placeholder.svg?height=120&width=120", // Example avatar URL
    }
    setProfileData(mockLoggedInUser)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Profile updated successfully!")
    // In a real app, you'd send profileData to your backend
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    } else {
      setProfileData((prev) => ({ ...prev, avatar: "" }))
    }
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profile Settings</h1>
      </div>

      <div className="profile-content">
        <div className="profile-avatar">
          {profileData.avatar ? (
            <img src={profileData.avatar || "/placeholder.svg"} alt="User Avatar" className="avatar-display-img" />
          ) : (
            <div className="avatar-placeholder">
              {profileData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
          <input
            type="file"
            id="profile-avatar-upload"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          <label htmlFor="profile-avatar-upload" className="secondary-btn">
            Change Photo
          </label>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={profileData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={profileData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" value={profileData.phone} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={profileData.department}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input type="text" id="position" name="position" value={profileData.position} onChange={handleChange} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
