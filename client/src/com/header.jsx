import { Link } from "react-router-dom"
import "../styles/Header.css"

function Header({ activePage = "home" }) {
  return (
    <header className="header">
      <div className="logo">
        <img
          src="https://placehold.co/40x40/2563eb/FFFFFF?text=E"
          alt="Student Management System Logo"
          width={40}
          height={40}
        />
        <h1>EduManage</h1>
      </div>
      <nav className="nav">
        <Link to="/" className={activePage === "home" ? "active" : ""}>
          Home
        </Link>
        <Link to="/courses" className={activePage === "courses" ? "active" : ""}>
          Courses
        </Link>
        <a href="#students">Students</a>
        <a href="#teachers">Teachers</a>
        <a href="#reports">Reports</a>
      </nav>
      <button className="loginBtn">Login</button>
    </header>
  )
}

export default Header
