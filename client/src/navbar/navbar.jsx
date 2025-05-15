"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./nav.css"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("isLoggedIn")
    const adminStatus = localStorage.getItem("admin")
    setIsAuthenticated(token === "true")
    setIsAdmin(adminStatus === "true")
    setUserId(localStorage.getItem("userId"))
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("prenom")
    setIsAuthenticated(false)
    setIsAdmin(false)
    window.location.href = "/"
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">Student</Link>
        </div>

        <div className={`navbar-menu ${isOpen ? "active" : ""}`}>
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  
                </li>
                <li className="nav-item">
                  <Link to={userId ? `/profile/${userId}` : "/"} className="nav-link">PROFILE</Link>


                 
                </li>
                 <li className="nav-item">
<Link to="/recommendations" className="nav-link">Recommendations</Link>
                </li>
                 
                <li className="nav-item">
                  <Link to="/ai-courses" className="nav-link">AI Courses</Link>
                </li>

                {/* 👑 Affichage des liens réservés à l'admin */}
                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link to="/StudentTable" className="nav-link">SHOW ALL STUDENTS</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/AddEtudiant" className="nav-link">ADD STUDENT</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/AddCourseForm" className="nav-link">ADD COURSE</Link>
                    </li>
                  </>
                )}

                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link logout-button">LOGOUT</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">LOGIN</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">SIGNUP</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`toggle-bar ${isOpen ? "open" : ""}`}></span>
          <span className={`toggle-bar ${isOpen ? "open" : ""}`}></span>
          <span className={`toggle-bar ${isOpen ? "open" : ""}`}></span>
        </div>
      </div>
    </nav>
  )
}
