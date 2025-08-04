"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.css"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // ✅ Allow hardcoded login for testing
    if (username === "abc" && password === "abc") {
      localStorage.setItem("isAuthenticated", "true"); // Fake auth state
      navigate("/"); // Redirect to home
      return;
    }

    // 🔐 Actual login logic
    await login(username, password);
    localStorage.setItem("isAuthenticated", "true");
    navigate("/");
  } catch (err) {
    setError("Invalid username or password.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Login to ERP System</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="primary-btn auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
