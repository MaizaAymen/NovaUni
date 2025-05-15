
import { useState } from "react"
import axios from "axios"
import "./add.css"
import Navbar1 from "../pages/navbar.jsx";
import SidebarWithSearch from "../components/SidebarWithSearch.jsx"
import { Link } from 'react-router-dom';
function AddEtudiant() {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [speciality, setSpeciality] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()

    const studentData = {
      nom,
      prenom,
      speciality,
      email,
      age: age ? Number.parseInt(age) : undefined,
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/etudiants/", studentData)
      console.log("Student added:", response.data)

      // Clear form after successful submission
      setNom("")
      setPrenom("")
      setSpeciality("")
      setEmail("")
      setAge("")
    } catch (error) {
      console.error("There was an error!", error)
    }
  }
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

  return (
    <><Navbar1/>
    <div style={styles.dashboard}>
    
      <SidebarWithSearch />
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Add New Student</h2>
          <p>Enter the student details to register them in the system</p>
        </div>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="nom">Last Name</label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder=""
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prenom">First Name</label>
            <input
              id="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder=""
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="speciality">Speciality</label>
            <input
              id="speciality"
              type="text"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              placeholder=""
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="" />
          </div>

          <button type="submit" className="submit-button">
            Add Student
          </button>
        </form>

        <div className="form-footer">
          <p>All fields except age are required</p>
        </div>
      </div>
    </div>
        </div>
        </>
  )
}

export default AddEtudiant

