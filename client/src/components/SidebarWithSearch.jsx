"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function Sidebar() {  // State for active link and collapsed state
  const [activeLink, setActiveLink] = useState("/")
  const [collapsed, setCollapsed] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status on component mount
  useEffect(() => {
    const adminStatus = localStorage.getItem("admin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  // If not admin, don't render the sidebar
  if (!isAdmin) {
    return null;
  }

  // Handle link click
  const handleLinkClick = (path) => {
    setActiveLink(path)
  }

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  // Navigation items
  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/AddEtudiant", label: "Add Student", icon: "👨‍🎓" },
    { path: "/AddCourseForm", label: "Add Course", icon: "📚" },
    { path: "/ai-courses", label: "AI Course Generator", icon: "🤖" },
    { path: "/StudentTable", label: "Student Table", icon: "📋" },
    { path: "/quizzes", label: "Quizzes", icon: "❓" },
    { path: "/add-quiz", label: "Create Quiz", icon: "📝" },
  ]

  // CSS Styles
  const styles = {
    sidebar: {
      width: collapsed ? "80px" : "260px",
      height: "100vh",
      padding: collapsed ? "1.5rem 0.75rem" : "1.5rem",
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      overflowY: "auto",
      transition: "all 0.3s ease",
      borderRight: "1px solid #f1f5f9",
    },
    sidebarHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "2rem",
      paddingBottom: "1rem",
      borderBottom: "1px solid #f1f5f9",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    logoIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      color: "#10b981",
      fontSize: "1.5rem",
    },
    logoText: {
      fontSize: "1.25rem",
      fontWeight: 700,
      color: "#10b981",
      display: collapsed ? "none" : "block",
      transition: "opacity 0.2s ease",
      opacity: collapsed ? 0 : 1,
    },
    toggleButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      color: "#64748b",
      transition: "background-color 0.2s ease",
    },
    toggleButtonHover: {
      backgroundColor: "#f1f5f9",
    },
    toggleIcon: {
      transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.3s ease",
    },
    navTitle: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      color: "#94a3b8",
      marginBottom: "1rem",
      paddingLeft: "0.5rem",
      display: collapsed ? "none" : "block",
    },
    navList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    navItem: {
      width: "100%",
    },
    navLink: {
      display: "flex",
      alignItems: "center",
      padding: collapsed ? "0.75rem" : "0.75rem 1rem",
      borderRadius: "0.5rem",
      textDecoration: "none",
      color: "#334155",
      fontWeight: 500,
      transition: "all 0.2s ease",
      position: "relative",
    },
    navLinkHover: {
      backgroundColor: "#f8fafc",
      color: "#0f172a",
    },
    navLinkActive: {
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      color: "#10b981",
      fontWeight: 600,
    },
    navIcon: {
      marginRight: collapsed ? 0 : "0.75rem",
      fontSize: "1.25rem",
      display: "flex",
      alignItems: "center",
      justifyContent: collapsed ? "center" : "flex-start",
      width: collapsed ? "100%" : "auto",
    },
    navLabel: {
      display: collapsed ? "none" : "block",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    activeDot: {
      position: "absolute",
      right: "12px",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: "#10b981",
      display: collapsed ? "none" : "block",
    },
    footer: {
      marginTop: "auto",
      padding: "1rem",
      borderTop: "1px solid #f1f5f9",
      display: "flex",
      alignItems: "center",
      justifyContent: collapsed ? "center" : "flex-start",
    },
    userAvatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: "#e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#64748b",
      fontWeight: 600,
      fontSize: "0.875rem",
    },
    userInfo: {
      marginLeft: "0.75rem",
      display: collapsed ? "none" : "block",
    },
    userName: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#334155",
    },
    userRole: {
      fontSize: "0.75rem",
      color: "#64748b",
    },
    mobileToggle: {
      position: "fixed",
      bottom: "1.5rem",
      right: "1.5rem",
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      backgroundColor: "#10b981",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      cursor: "pointer",
      zIndex: 50,
      fontSize: "1.25rem",
    },
  }

  return (
    <>
      <aside style={styles.sidebar}>
        {/* Sidebar Header */}
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🎓</div>
            <span style={styles.logoText}>EduDash</span>
          </div>
          <button
            style={styles.toggleButton}
            onClick={toggleSidebar}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.toggleButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "transparent" })}
          >
            <span style={styles.toggleIcon}>{collapsed ? "→" : "←"}</span>
          </button>
        </div>

        {/* Navigation */}
        <h4 style={styles.navTitle}>Menu</h4>
        <ul style={styles.navList}>
          {navItems.map((item, index) => {
            const isActive = activeLink === item.path
            const linkStyle = {
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {}),
            }

            return (
              <li key={index} style={styles.navItem}>
                <Link
                  to={item.path}
                  style={linkStyle}
                  onClick={() => handleLinkClick(item.path)}
                  onMouseEnter={(e) => !isActive && Object.assign(e.currentTarget.style, styles.navLinkHover)}
                  onMouseLeave={(e) => !isActive && Object.assign(e.currentTarget.style, linkStyle)}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  <span style={styles.navLabel}>{item.label}</span>
                  {isActive && <span style={styles.activeDot}></span>}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Footer with user info */}
        <div style={styles.footer}>
          <div style={styles.userAvatar}>AD</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>Admin User</div>
            <div style={styles.userRole}>Administrator</div>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button - Only visible on small screens */}
      <style jsx>{`
        @media (min-width: 768px) {
          .mobile-toggle {
            display: none;
          }
        }
      `}</style>
      <button className="mobile-toggle" style={styles.mobileToggle} onClick={toggleSidebar}>
        {collapsed ? "→" : "←"}
      </button>
    </>
  )
}
