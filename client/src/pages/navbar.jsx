import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Home, LogOut, Star, User } from 'lucide-react';

// CSS styles included in the component
const styles = `
  /* Navbar Styles */

  .navbar {
    display: flex;
    height: 5.5rem;
    align-items: center;
    justify-content: space-between;
  }

  /* Enhanced Logo Styles */
  .logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.3s, filter 0.5s;
    padding: 0.5rem;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .logo-container:hover {
    transform: scale(1.03);
    filter: brightness(1.05);
  }

  .logo-image-container {
    position: relative;
    height: 4rem;
    width: 4rem;
    overflow: hidden;
    border-radius: 9999px;
    border: 3px solid white;
    background-color: white;
    box-shadow: 0 4px 8px -1px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s;
  }

  .logo-container:hover .logo-image-container {
    transform: rotate(5deg);
  }

  .logo-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .logo-text-container {
    display: flex;
    flex-direction: column;
  }

  .logo-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: white;
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.025em;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .logo-subtitle {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    margin: 0;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  @media (min-width: 768px) {
    .logo-title {
      font-size: 2rem;
    }
    
    .logo-subtitle {
      font-size: 1rem;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-gradient {
    background: linear-gradient(90deg, #ffffff, #dcfce7, #ffffff);
    background-size: 200% 100%;
    animation: gradient 3s ease infinite;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* Mobile Menu Button */
  .menu-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.375rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: white;
  }

  .menu-button span {
    display: block;
    height: 2px;
    width: 24px;
    background-color: white;
    margin-bottom: 6px;
    transition: all 0.3s;
  }

  .menu-button span:last-child {
    margin-bottom: 0;
  }

  .menu-button.open span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .menu-button.open span:nth-child(2) {
    opacity: 0;
  }

  .menu-button.open span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  @media (min-width: 768px) {
    .menu-button {
      display: none;
    }
  }

  /* Navigation */
  .nav {
    position: absolute;
    left: 0;
    top: 5.5rem;
    width: 100%;
    background-color: white;
    padding: 1.25rem 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    transition: transform 0.3s ease-in-out;
  }

  .nav.open {
    transform: translateY(0);
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  @media (min-width: 768px) {
    .nav {
      position: static;
      width: auto;
      background-color: transparent;
      padding: 0;
      box-shadow: none;
      transform: translateY(0);
    }

    .nav-list {
      flex-direction: row;
      gap: 0.25rem;
    }
  }

  /* Nav Links */
  .nav-link {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    color: #166534;
    text-decoration: none;
    transition: all 0.3s;
    position: relative;
  }

  .nav-link:hover {
    background-color: #dcfce7;
  }

  .nav-link svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
    transition: transform 0.3s;
  }

  .nav-link:hover svg {
    transform: scale(1.1);
  }

  .nav-link-text {
    position: relative;
  }

  .nav-link-text::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    background-color: #4ade80;
    transition: width 0.3s;
  }

  .nav-link:hover .nav-link-text::after {
    width: 100%;
  }

  @media (min-width: 768px) {
    .nav-link {
      color: white;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .nav-link-text::after {
      background-color: white;
    }
  }

  /* Login/Logout Button */
  .auth-button {
    position: relative;
    overflow: hidden;
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    background-color: white;
    color: #16a34a;
    font-weight: 500;
    text-decoration: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .auth-button:hover {
    background-color: #f0fdf4;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .auth-button-content {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
  }

  .auth-button svg {
    margin-right: 0.5rem;
    width: 1rem;
    height: 1rem;
  }

  .auth-button::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0;
    width: 100%;
    background-color: #dcfce7;
    transition: height 0.3s;
  }

  .auth-button:hover::after {
    height: 100%;
  }
`;

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Check login status and if user is admin
    const isUserLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const adminStatus = localStorage.getItem("admin") === "true";
    const userIdFromStorage = localStorage.getItem("userId");

    setIsLoggedIn(isUserLoggedIn);
    setIsAdmin(adminStatus);
    setUserId(userIdFromStorage);
    console.log("Login status:", isUserLoggedIn, "Admin status:", adminStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("admin");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/"); // Redirect after logout
  };

  return (
    <>
      <style>{styles}</style>
      <header className="header">
        <div className="container">
          <div className="navbar">
            {/* Enhanced Logo */}
            <div className="logo-container">
              <div className="logo-image-container">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCmamaeRmfezGHKEUop-BGXeATNrBglypBQA&s"
                  alt="Student Management System Logo"
                  className="logo-image"
                />
              </div>
              <div className="logo-text-container">
                <h1 className="logo-title">
                  <span className="animate-gradient">Study</span> With Me
                </h1>
                <p className="logo-subtitle">Educational Excellence</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`menu-button ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Navigation Links */}
            <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
              <ul className="nav-list">
                <li>
                  <a href="/HomePages" className="nav-link">
                    <Home />
                    <span className="nav-link-text">Home</span>
                  </a>
                </li>

                {isLoggedIn && (
                  <>
                    {isAdmin ? (
                      <>
                        <li>
                          <a href="/HomePage" className="nav-link">
                            <GraduationCap />
                            <span className="nav-link-text">Dashboard</span>
                          </a>
                        </li>
                        <li>
                          <a href="/ai-courses" className="nav-link">
                            <BookOpen />
                            <span className="nav-link-text">AI Courses</span>
                          </a>
                        </li>
                        <li>
                          <a href="/favorites" className="nav-link">
                            <Star />
                            <span className="nav-link-text">Favorites</span>
                          </a>
                        </li>
                        <li>
                          <a href={userId ? `/profile/${userId}` : "/"} className="nav-link">
                            <User />
                            <span className="nav-link-text">Profile</span>
                          </a>
                        </li>                         <li>
                          <a href="/recommendations" className="nav-link">
                            <Star />
                            <span className="nav-link-text">Recommendations</span>
                          </a>
                        </li>
                        <li>
                          <a href="/quizzes" className="nav-link">
                            <BookOpen />
                            <span className="nav-link-text">Quizzes</span>
                          </a>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <a href="/CoursesPage" className="nav-link">
                            <BookOpen />
                            <span className="nav-link-text">COURSES</span>
                          </a>
                        </li>
                        <li>
                          <a href="/newcourse" className="nav-link">
                            <GraduationCap />
                            <span className="nav-link-text">AI Course Generator</span>
                          </a>
                        </li>
                        <li>
                          <a href="/ai-courses" className="nav-link">
                            <BookOpen />
                            <span className="nav-link-text">AI Courses</span>
                          </a>
                        </li>
                        <li>
                          <a href="/favorites" className="nav-link">
                            <Star />
                            <span className="nav-link-text">Favorites</span>
                          </a>
                        </li>
                        <li>
                          <a href={userId ? `/profile/${userId}` : "/"} className="nav-link">
                            <User />
                            <span className="nav-link-text">Profile</span>
                          </a>
                        </li>                         <li>
                          <a href="/recommendations" className="nav-link">
                            <Star />
                            <span className="nav-link-text">Recommendations</span>
                          </a>
                        </li>
                        <li>
                          <a href="/quizzes" className="nav-link">
                            <BookOpen />
                            <span className="nav-link-text">Quizzes</span>
                          </a>
                        </li>
                      </>
                    )}
                  </>
                )}
              </ul>
            </nav>

            {/* Login/Logout Button */}
            {isLoggedIn ? (
              <button className="auth-button" onClick={handleLogout}>
                <span className="auth-button-content">
                  <LogOut />
                  Logout
                </span>
              </button>
            ) : (
              <a href="/" className="auth-button">
                <span className="auth-button-content">Login</span>
              </a>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;