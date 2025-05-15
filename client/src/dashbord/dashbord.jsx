import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import SidebarWithSearch from '../components/SidebarWithSearch.jsx';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  
  useEffect(() => {
    // Fetch courses from FastAPI
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/courses/");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    // Fetch total students from FastAPI
    const fetchStudentCount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/etudiants/count");
        setTotalStudents(response.data.total_students);
      } catch (error) {
        console.error("Error fetching student count:", error);
      }
    };

    fetchCourses();
    fetchStudentCount();
  }, []);

  const stats = [
    { title: "Total Students", count: totalStudents, change: "+12%", icon: "👨‍🎓", color: "#10b981" },
    { title: "Active Courses", count: courses.length, change: "+2", icon: "📚", color: "#3b82f6" },
    { title: "Average Grade", count: "78%", change: "+5%", icon: "📊", color: "#8b5cf6" },
    { title: "Attendance Rate", count: "92%", change: "+3%", icon: "📅", color: "#f59e0b" },
  ];

  // CSS Styles
  const styles = {
    dashboard: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: '"Poppins", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      backgroundColor: '#f8fafc',
      color: '#334155',
    },
    sidebar: {
      width: '260px',
      padding: '2rem 1.5rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      transition: 'all 0.3s ease',
    },
    sidebarHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#10b981',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    logoIcon: {
      fontSize: '1.75rem',
    },
    navTitle: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#64748b',
      marginBottom: '0.75rem',
    },
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    navItem: {
      marginBottom: '0.5rem',
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      textDecoration: 'none',
      color: '#334155',
      fontWeight: 500,
      transition: 'all 0.2s ease',
    },
    navLinkActive: {
      backgroundColor: '#10b98120',
      color: '#10b981',
      fontWeight: 600,
    },
    navIcon: {
      marginRight: '0.75rem',
      fontSize: '1.25rem',
    },
    main: {
      flex: 1,
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    headerTitle: {
      fontSize: '1.875rem',
      fontWeight: 700,
      color: '#0f172a',
      margin: 0,
    },
    headerSubtitle: {
      fontSize: '1rem',
      color: '#64748b',
      marginTop: '0.25rem',
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      display: 'flex',
      alignItems: 'center',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer',
    },
    statCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem',
      fontSize: '1.5rem',
    },
    statInfo: {
      flex: 1,
    },
    statTitle: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#64748b',
      marginBottom: '0.25rem',
    },
    statCount: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#0f172a',
      marginBottom: '0.25rem',
    },
    statChange: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#10b981',
      display: 'flex',
      alignItems: 'center',
    },
    dashboardContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    contentCard: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '1rem',
      marginTop: '1rem',
    },
    actionButton: {
      padding: '0.75rem 1rem',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    actionButtonHover: {
      backgroundColor: '#059669',
    },
    activityList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    activityItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 0',
      borderBottom: '1px solid #e2e8f0',
    },
    activityInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    activityAction: {
      fontWeight: 500,
      color: '#0f172a',
    },
    activityStudent: {
      color: '#64748b',
      marginTop: '0.25rem',
    },
    activityTime: {
      fontSize: '0.875rem',
      color: '#94a3b8',
    },
    '@media (max-width: 768px)': {
      sidebar: {
        width: '80px',
        padding: '1.5rem 0.75rem',
      },
      sidebarText: {
        display: 'none',
      },
      navLink: {
        justifyContent: 'center',
        padding: '0.75rem',
      },
      navIcon: {
        margin: 0,
      },
      main: {
        padding: '1.5rem',
      },
    },
  };

  // State for hover effects
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <div style={styles.dashboard}>
      {/* Sidebar navigation */}
      <SidebarWithSearch />
      
      {/* Main dashboard content */}
      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>Dashboard</h1>
            <p style={styles.headerSubtitle}>Welcome back to your education portal</p>
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
            <button style={{
              ...styles.actionButton,
              backgroundColor: 'white',
              color: '#10b981',
              border: '1px solid #10b981',
            }}>
              <span>📅</span> Today
            </button>
          </div>
        </div>

        <div style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              style={{
                ...styles.statCard,
                ...(hoveredStat === index ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={{
                ...styles.statIcon,
                backgroundColor: `${stat.color}20`,
                color: stat.color,
              }}>
                {stat.icon}
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statTitle}>{stat.title}</div>
                <div style={styles.statCount}>{stat.count}</div>
                <div style={{
                  ...styles.statChange,
                  color: stat.change.includes('+') ? '#10b981' : '#ef4444'
                }}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.dashboardContent}>
          <div style={styles.contentCard}>
            <h3 style={styles.cardTitle}>
              <span>⚡</span> Quick Actions
            </h3>
            <div style={styles.actionButtons}>
              <button 
                style={{
                  ...styles.actionButton,
                  ...(hoveredButton === 0 ? styles.actionButtonHover : {})
                }}
                onMouseEnter={() => setHoveredButton(0)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span>👨‍🎓</span> Add Student
              </button>
              <button 
                style={{
                  ...styles.actionButton,
                  ...(hoveredButton === 1 ? styles.actionButtonHover : {})
                }}
                onMouseEnter={() => setHoveredButton(1)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span>📝</span> Record Grades
              </button>
              <button 
                style={{
                  ...styles.actionButton,
                  ...(hoveredButton === 2 ? styles.actionButtonHover : {})
                }}
                onMouseEnter={() => setHoveredButton(2)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span>📅</span> Take Attendance
              </button>
              <button 
                style={{
                  ...styles.actionButton,
                  ...(hoveredButton === 3 ? styles.actionButtonHover : {})
                }}
                onMouseEnter={() => setHoveredButton(3)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span>📊</span> Generate Reports
              </button>
            </div>
          </div>

          <div style={styles.contentCard}>
            <h3 style={styles.cardTitle}>
              <span>🔔</span> Recent Activity
            </h3>
            <ul style={styles.activityList}>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <li key={course._id} style={styles.activityItem}>
                    <div style={styles.activityInfo}>
                      <span style={styles.activityAction}>New Course Added:</span>
                      <span style={styles.activityStudent}>{course.name}</span>
                    </div>
                    <span style={styles.activityTime}>{course.created_at || "Recently"}</span>
                  </li>
                ))
              ) : (
                <li style={{...styles.activityItem, justifyContent: 'center', color: '#64748b'}}>
                  No recent courses available
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Add responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          aside {
            width: 80px !important;
            padding: 1.5rem 0.75rem !important;
          }
          
          aside span:not([style*="navIcon"]) {
            display: none;
          }
          
          [style*="navLink"] {
            justify-content: center !important;
            padding: 0.75rem !important;
          }
          
          [style*="navIcon"] {
            margin-right: 0 !important;
          }
          
          [style*="main"] {
            padding: 1.5rem !important;
          }
          
          [style*="statsContainer"] {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
          }
          
          [style*="dashboardContent"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}