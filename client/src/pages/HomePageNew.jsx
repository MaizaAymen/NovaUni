import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar1 from "./navbar.jsx"

const HomePages = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [nom, setUsername] = useState("")
  const userId = localStorage.getItem("userId")
  const navigate = useNavigate()

  useEffect(() => {
    // Check login status when component mounts
    const checkLoginStatus = () => {
      const isUserLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      const storedUsername = localStorage.getItem("prenom") || ""
      console.log("isLoggedIn:", isUserLoggedIn)
      console.log("nom:", storedUsername)
      
      setIsLoggedIn(isUserLoggedIn)
      setUsername(storedUsername)
      setIsLoading(false)
      
      // Redirect if not logged in
      if (!isUserLoggedIn) {
        console.log("Not logged in, redirecting to login page")
        navigate("/", { replace: true })
      }
    }
    
    // Small timeout to ensure localStorage is checked after any potential updates
    const timer = setTimeout(checkLoginStatus, 100)
    return () => clearTimeout(timer)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("nom")
    setIsLoggedIn(false)
    setUsername("")
    navigate("/")
  }
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner homepage-spinner"></div>
        <p>Loading...</p>        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            width: 100%;
          }
          
          .homepage-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: #6c63ff;
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 20px;
          }
          
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Header */}
      <Navbar1 />
      <div className="content">
        <div className="welcome-section">
          {isLoggedIn ? (
            <>
              <h1>Hello, {nom}</h1>
              <div className="action-buttons">
                <Link to={`/profile/${userId}`} className="profile-btn">
                  My Profile
                </Link>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <h1>Please login to continue</h1>
          )}
        </div>
      </div>      <style>{`
        .container {
          font-family: 'Poppins', sans-serif;
        }
        
        .content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .welcome-section {
          text-align: center;
          margin-top: 3rem;
        }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .profile-btn, .logout-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
        }
        
        .profile-btn {
          background-color: #4f46e5;
          color: white;
          border: none;
        }
        
        .logout-btn {
          background-color: transparent;
          border: 1px solid #4f46e5;
          color: #4f46e5;
        }
      `}</style>
    </div>
  )
}

export default HomePages
