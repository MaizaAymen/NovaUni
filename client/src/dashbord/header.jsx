"use client"

import { useState } from "react"
import "./header.css"

export default function Header({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="logo-container">
        <h1 className="logo">StudentManager</h1>
      </div>

      <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`main-nav ${mobileMenuOpen ? "open" : ""}`}>
        <ul className="nav-list">
          <li className={activeTab === "dashboard" ? "active" : ""}>
            <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          </li>
          <li className={activeTab === "students" ? "active" : ""}>
            <button onClick={() => setActiveTab("students")}>Students</button>
          </li>
          <li className={activeTab === "courses" ? "active" : ""}>
            <button onClick={() => setActiveTab("courses")}>Courses</button>
          </li>
          <li className={activeTab === "grades" ? "active" : ""}>
            <button onClick={() => setActiveTab("grades")}>Grades</button>
          </li>
        </ul>
      </nav>

      <div className="user-menu">
        <div className="user-profile">
          <img src="/placeholder.svg?height=40&width=40" alt="User profile" />
          <span className="user-name">Admin</span>
        </div>
      </div>
    </header>
  )
}

