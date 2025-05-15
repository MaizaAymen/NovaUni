"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Navbar1 from "./navbar"

export default function QuizList() {  
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    console.log("QuizList: Fetching quizzes from API");
    axios
      .get("http://127.0.0.1:8000/quizzes/", {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then((res) => {
        console.log("QuizList: Raw API response:", res);
        // Accept all quizzes, even if _id is missing
        if (Array.isArray(res.data)) {
          const warnNoId = res.data.some(q => !q._id);
          if (warnNoId) {
            console.warn("Some quizzes are missing _id. They will use index as key.");
          }
          setQuizzes(res.data);
        } else {
          setQuizzes([]);
        }
      })
      .catch((err) => {
        console.error("QuizList: Error fetching quizzes:", err);
        console.error("QuizList: Error details:", err.response ? err.response.data : "No response data");
        setError(err.message);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 800)
      })
  }, [])

  const handleMouseEnter = (index) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }

  return (
    <div className="quiz-list-container">
      <Navbar1 />

      {/* Animated background elements */}
      <div className="animated-background">
        <div className="floating-element pencil"></div>
        <div className="floating-element book"></div>
        <div className="floating-element calculator"></div>
        <div className="floating-element globe"></div>
        <div className="floating-element atom"></div>
        <div className="floating-element formula">E=mc²</div>
        <div className="floating-element formula">a²+b²=c²</div>
        <div className="floating-element formula">∫f(x)dx</div>
      </div>

      <div className="content-container">
        <div className="header-container">
          <h1 className="page-title">Available Quizzes</h1>
          <div className="title-underline"></div>
          <p className="subtitle">Test your knowledge with our interactive quizzes</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-circle"></div>
              <div className="spinner-circle"></div>
              <div className="spinner-circle"></div>
            </div>
            <p className="loading-text">Loading quizzes...</p>
          </div>        
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">!</div>
            <div className="error-content">
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button 
                className="retry-button" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No Quizzes Found</h3>
            <p>There are no quizzes available at the moment.</p>
            <Link to="/add-quiz" className="add-quiz-button">
              Create a New Quiz
            </Link>
          </div>
        ) : (
          <ul className="quiz-list">
            {quizzes.map((quiz, index) => (
              <li
                key={`quiz-${index}`}
                className={`quiz-item ${activeIndex === index ? "active" : ""}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/quizzes/${index}`} className="quiz-link">
                  <div className="quiz-card">
                    <div className="quiz-icon">
                      <span>Q</span>
                    </div>
                    <div className="quiz-details">
                      <h3 className="quiz-title">{quiz.subject}</h3>
                      <p className="quiz-description">{quiz.description || "Test your knowledge on this subject"}</p>
                      <div className="quiz-meta">
                        <span className="quiz-questions">
                          <span className="meta-icon">❓</span>
                          {quiz.questions?.length || "Multiple"} Questions
                        </span>
                        <span className="quiz-time">
                          <span className="meta-icon">⏱️</span>
                          {quiz.timeLimit || "15"} Minutes
                        </span>
                      </div>
                    </div>
                    <div className="quiz-arrow">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}      
      </div>

      <style>{`
        /* Base styles */
        .quiz-list-container {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
          overflow: hidden;
          padding-bottom: 3rem;
        }

        /* Animated background elements */
        .animated-background {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .floating-element {
          position: absolute;
          opacity: 0.15;
          animation: float 20s infinite ease-in-out;
        }

        .pencil {
          top: 15%;
          left: 10%;
          width: 60px;
          height: 8px;
          background: #333;
          border-radius: 4px;
          transform: rotate(45deg);
          animation-delay: 0s;
        }

        .pencil::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 4px 12px 4px 0;
          border-color: transparent #f8d486 transparent transparent;
        }

        .book {
          top: 70%;
          left: 15%;
          width: 50px;
          height: 70px;
          background: #4a6bdf;
          border-radius: 3px 10px 10px 3px;
          transform: rotate(-10deg);
          animation-delay: -5s;
        }

        .book::before {
          content: '';
          position: absolute;
          top: 5px;
          left: 5px;
          right: 5px;
          bottom: 5px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 0 5px 5px 0;
        }

        .calculator {
          top: 30%;
          right: 15%;
          width: 40px;
          height: 60px;
          background: #333;
          border-radius: 5px;
          animation-delay: -10s;
        }

        .calculator::before {
          content: '';
          position: absolute;
          top: 5px;
          left: 5px;
          right: 5px;
          height: 15px;
          background: #ddd;
          border-radius: 2px;
        }

        .globe {
          bottom: 20%;
          right: 10%;
          width: 60px;
          height: 60px;
          background: #4a6bdf;
          border-radius: 50%;
          animation-delay: -15s;
        }

        .globe::before {
          content: '';
          position: absolute;
          top: 15px;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
        }

        .globe::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 15px;
          width: 2px;
          background: rgba(255, 255, 255, 0.5);
        }

        .atom {
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          border: 2px solid #4a6bdf;
          border-radius: 50%;
          animation: atomFloat 15s infinite linear;
        }

        .atom::before, .atom::after {
          content: '';
          position: absolute;
          top: -2px;
          left: 50%;
          width: 64px;
          height: 64px;
          border: 2px solid #4a6bdf;
          border-radius: 50%;
          transform: translateX(-50%) rotate(60deg);
        }

        .atom::after {
          transform: translateX(-50%) rotate(-60deg);
        }

        .formula {
          font-family: 'Courier New', monospace;
          color: #4a6bdf;
          font-size: 24px;
          font-weight: bold;
        }

        .formula:nth-of-type(1) {
          top: 25%;
          left: 30%;
          animation-delay: -3s;
        }

        .formula:nth-of-type(2) {
          top: 60%;
          right: 25%;
          animation-delay: -8s;
        }

        .formula:nth-of-type(3) {
          bottom: 30%;
          left: 40%;
          animation-delay: -13s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -30px) rotate(5deg);
          }
          50% {
            transform: translate(40px, 0) rotate(10deg);
          }
          75% {
            transform: translate(20px, 30px) rotate(5deg);
          }
        }

        @keyframes atomFloat {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        /* Content container */
        .content-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          position: relative;
          z-index: 1;
        }

        /* Header styles */
        .header-container {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeInDown 0.8s ease-out;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .title-underline {
          height: 4px;
          width: 80px;
          background: linear-gradient(90deg, #4a6bdf, #63b3ed);
          margin: 0.5rem auto 1.5rem;
          border-radius: 2px;
          animation: expandWidth 1.5s ease-out;
        }

        .subtitle {
          font-size: 1.1rem;
          color: #4a5568;
          max-width: 500px;
          margin: 0 auto;
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 80px;
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Loading animation */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          animation: fadeIn 0.5s ease-out;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .spinner-circle {
          width: 12px;
          height: 12px;
          margin: 0 6px;
          background-color: #4a6bdf;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .spinner-circle:nth-child(1) {
          animation-delay: -0.32s;
        }

        .spinner-circle:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .loading-text {
          color: #4a5568;
          font-size: 1rem;
        }

        /* Error state */
        .error-container {
          display: flex;
          align-items: center;
          background-color: #fff5f5;
          border-left: 4px solid #f56565;
          border-radius: 4px;
          padding: 1.5rem;
          margin: 2rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          animation: shakeError 0.5s ease-in-out;
        }

        @keyframes shakeError {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .error-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: #f56565;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          border-radius: 50%;
          margin-right: 1rem;
        }

        .error-content {
          flex: 1;
        }

        .error-content h3 {
          color: #e53e3e;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .error-content p {
          color: #4a5568;
          margin-bottom: 1rem;
        }

        .retry-button {
          background-color: #4a6bdf;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;        }

        .retry-button:hover {
          background-color: #3c5ccc;
          transform: translateY(-2px);
        }
        
        /* Empty state styles */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: white;
          border-radius: 8px;
          padding: 3rem 2rem;
          margin: 2rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: center;
          animation: fadeIn 0.8s ease-out;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.75rem;
        }

        .empty-state p {
          color: #718096;
          margin-bottom: 1.5rem;
          max-width: 400px;
        }

        .add-quiz-button {
          background-color: #4a6bdf;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .add-quiz-button:hover {
          background-color: #3c5ccc;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Quiz list */
        .quiz-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .quiz-item {
          margin-bottom: 1.5rem;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.5s forwards ease-out;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .quiz-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .quiz-card {
          display: flex;
          align-items: center;
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .quiz-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #4a6bdf, #63b3ed);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .quiz-item.active .quiz-card {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
        }

        .quiz-item.active .quiz-card::before {
          opacity: 1;
        }

        .quiz-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #4a6bdf, #63b3ed);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.5rem;
          flex-shrink: 0;
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
          box-shadow: 0 4px 6px rgba(74, 107, 223, 0.3);
          transition: all 0.3s ease;
        }

        .quiz-item.active .quiz-icon {
          transform: scale(1.1);
          box-shadow: 0 6px 10px rgba(74, 107, 223, 0.4);
        }

        .quiz-details {
          flex: 1;
        }

        .quiz-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 0.5rem;
          transition: color 0.3s ease;
        }

        .quiz-item.active .quiz-title {
          color: #4a6bdf;
        }

        .quiz-description {
          color: #718096;
          margin: 0 0 1rem;
          font-size: 0.95rem;
        }

        .quiz-meta {
          display: flex;
          font-size: 0.85rem;
          color: #a0aec0;
        }

        .quiz-questions, .quiz-time {
          display: flex;
          align-items: center;
          margin-right: 1.5rem;
        }

        .meta-icon {
          margin-right: 0.5rem;
        }

        .quiz-arrow {
          color: #cbd5e0;
          transition: all 0.3s ease;
        }

        .quiz-item.active .quiz-arrow {
          color: #4a6bdf;
          transform: translateX(5px);
        }

        /* Fade in animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Responsive styles */
        @media (max-width: 640px) {
          .page-title {
            font-size: 2rem;
          }
          
          .quiz-card {
            padding: 1.25rem;
          }
          
          .quiz-icon {
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
            margin-right: 1rem;
          }
          
          .quiz-title {
            font-size: 1.1rem;
          }
          
          .quiz-meta {
            flex-direction: column;
          }
          
          .quiz-questions {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}
