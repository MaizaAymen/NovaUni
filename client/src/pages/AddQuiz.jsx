"use client"

import { useState } from "react"
import axios from "axios"
import Navbar1 from "./navbar"
import SidebarWithSearch from "../components/SidebarWithSearch.jsx"

export default function AddQuiz() {
  const [subject, setSubject] = useState("")
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formFocus, setFormFocus] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setQuiz(null)

    try {
      const res = await axios.post("http://127.0.0.1:8000/quizzes/ai", { subject })
      setQuiz(res.data)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || "Error generating quiz")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="add-quiz-container">
      <Navbar1 />
      
      <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        <SidebarWithSearch />
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* Animated background elements */}
          <div className="animated-background">
            <div className="floating-element question-mark">?</div>
            <div className="floating-element light-bulb">💡</div>
            <div className="floating-element book">📚</div>
            <div className="floating-element pencil">✏️</div>
            <div className="floating-element graduation-cap">🎓</div>
            <div className="floating-element formula">E=mc²</div>
            <div className="floating-element formula">a²+b²=c²</div>
          </div>

          <div className="content-container">
            <div className="header-container">
              <h1 className="page-title">Create AI Quiz</h1>
              <div className="title-underline"></div>
          <p className="subtitle">Enter a subject and our AI will generate a quiz for you</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className={`quiz-form ${formFocus ? "focused" : ""}`}>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Enter quiz subject (e.g., World History, Biology, Mathematics)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onFocus={() => setFormFocus(true)}
                onBlur={() => setFormFocus(false)}
                required
                className="subject-input"
              />
              <div className="input-focus-effect"></div>
            </div>

            <button type="submit" disabled={loading} className={`submit-button ${loading ? "loading" : ""}`}>
              <span className="button-text">{loading ? "Generating Quiz..." : "Generate Quiz"}</span>
              <span className="button-icon">
                {loading ? (
                  <span className="loading-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                ) : (
                  <span className="magic-wand">✨</span>
                )}
              </span>
            </button>
          </form>

          {showSuccess && (
            <div className="success-message">
              <span className="success-icon">✓</span>
              <span>Quiz generated successfully!</span>
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-container">
            <div className="brain-loader">
              <div className="brain-container">
                <div className="brain"></div>
                <div className="brain-waves">
                  <div className="wave wave1"></div>
                  <div className="wave wave2"></div>
                  <div className="wave wave3"></div>
                </div>
              </div>
              <p className="loading-text">AI is generating your quiz...</p>
            </div>
          </div>
        )}

        {quiz && !loading && (
          <div className="quiz-result">
            <div className="quiz-header">
              <div className="quiz-badge">
                <span className="quiz-id">ID: {quiz._id}</span>
              </div>
              <h2 className="quiz-subject">{quiz.subject}</h2>
              <p className="quiz-info">
                <span className="quiz-questions-count">{quiz.questions.length} Questions</span>
                <span className="quiz-separator">•</span>
                <span className="quiz-difficulty">Medium Difficulty</span>
              </p>
            </div>

            <div className="questions-container">
              {quiz.questions.map((q, idx) => (
                <div key={idx} className="question-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="question-number">{idx + 1}</div>
                  <div className="question-content">
                    <p className="question-text">{q.question}</p>
                    <ul className="options-list">
                      {q.options.map((opt, i) => (
                        <li key={i} className={`option-item ${opt === q.correct_answer ? "correct-answer" : ""}`}>
                          <span className="option-marker">{String.fromCharCode(65 + i)}</span>
                          <span className="option-text">{opt}</span>
                          {opt === q.correct_answer && <span className="correct-indicator">✓</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="quiz-actions">
              <button className="action-button primary">Save Quiz</button>
              <button className="action-button secondary">Edit Quiz</button>
              <button className="action-button tertiary">Share Quiz</button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

      <style jsx>{`
        /* Base styles */
        .add-quiz-container {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
          overflow: hidden;
          padding-bottom: 3rem;
          color: #2d3748;
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
          font-size: 2.5rem;
        }
        
        .question-mark {
          top: 15%;
          left: 10%;
          font-size: 4rem;
          font-weight: bold;
          color: #4a6bdf;
          animation-delay: 0s;
        }
        
        .light-bulb {
          top: 70%;
          left: 15%;
          animation-delay: -5s;
        }
        
        .book {
          top: 30%;
          right: 15%;
          animation-delay: -10s;
        }
        
        .pencil {
          bottom: 20%;
          right: 10%;
          animation-delay: -15s;
        }
        
        .graduation-cap {
          top: 50%;
          left: 50%;
          animation-delay: -7s;
        }
        
        .formula {
          font-family: 'Courier New', monospace;
          color: #4a6bdf;
          font-size: 1.8rem;
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
        
        /* Form styles */
        .form-container {
          margin-bottom: 2rem;
          animation: fadeIn 0.8s ease-out;
        }
        
        .quiz-form {
          background-color: white;
          border-radius: 10px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .quiz-form.focused {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-5px);
        }
        
        .input-wrapper {
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .subject-input {
          width: 100%;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.3s ease;
          background-color: #f8fafc;
        }
        
        .subject-input:focus {
          outline: none;
          border-color: #4a6bdf;
          background-color: white;
        }
        
        .input-focus-effect {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #4a6bdf, #63b3ed);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .quiz-form.focused .input-focus-effect {
          width: calc(100% - 3rem);
        }
        
        .submit-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(90deg, #4a6bdf, #63b3ed);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 107, 223, 0.3);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .button-text {
          margin-right: 0.5rem;
          position: relative;
          z-index: 1;
        }
        
        .button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        
        .magic-wand {
          font-size: 1.2rem;
          animation: sparkle 2s infinite;
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
        
        .loading-dots {
          display: flex;
          align-items: center;
        }
        
        .dot {
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
          margin: 0 2px;
          animation: dotPulse 1.5s infinite ease-in-out;
        }
        
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes dotPulse {
          0%, 100% {
            transform: scale(0.6);
            opacity: 0.6;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Success and error messages */
        .success-message, .error-message {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          animation: slideIn 0.3s ease-out;
        }
        
        .success-message {
          background-color: #f0fff4;
          border-left: 4px solid #48bb78;
          color: #2f855a;
        }
        
        .error-message {
          background-color: #fff5f5;
          border-left: 4px solid #f56565;
          color: #c53030;
        }
        
        .success-icon, .error-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 0.75rem;
          font-weight: bold;
        }
        
        .success-icon {
          background-color: #48bb78;
          color: white;
        }
        
        .error-icon {
          background-color: #f56565;
          color: white;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Loading animation */
        .loading-container {
          display: flex;
          justify-content: center;
          margin: 3rem 0;
          animation: fadeIn 0.5s ease-out;
        }
        
        .brain-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .brain-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 1.5rem;
        }
        
        .brain {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background-color: #4a6bdf;
          border-radius: 30% 30% 50% 50% / 30% 30% 50% 50%;
          box-shadow: 0 0 20px rgba(74, 107, 223, 0.5);
          animation: pulseBrain 2s infinite ease-in-out;
        }
        
        .brain::before, .brain::after {
          content: '';
          position: absolute;
          top: 10%;
          width: 45%;
          height: 70%;
          background-color: #4a6bdf;
          border-radius: 50% 50% 40% 40% / 60% 60% 30% 30%;
        }
        
        .brain::before {
          left: -15%;
          transform: rotate(-15deg);
        }
        
        .brain::after {
          right: -15%;
          transform: rotate(15deg);
        }
        
        @keyframes pulseBrain {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 20px rgba(74, 107, 223, 0.5);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow: 0 0 30px rgba(74, 107, 223, 0.7);
          }
        }
        
        .brain-waves {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
        }
        
        .wave {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid rgba(74, 107, 223, 0.3);
          border-radius: 50%;
          animation: waveExpand 2s infinite ease-out;
        }
        
        .wave1 {
          animation-delay: 0s;
        }
        
        .wave2 {
          animation-delay: 0.5s;
        }
        
        .wave3 {
          animation-delay: 1s;
        }
        
        @keyframes waveExpand {
          0% {
            width: 60%;
            height: 60%;
            opacity: 0.8;
          }
          100% {
            width: 150%;
            height: 150%;
            opacity: 0;
          }
        }
        
        .loading-text {
          color: #4a5568;
          font-size: 1.1rem;
          text-align: center;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        /* Quiz result styles */
        .quiz-result {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          animation: fadeIn 0.8s ease-out;
        }
        
        .quiz-header {
          background: linear-gradient(135deg, #4a6bdf, #63b3ed);
          color: white;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }
        
        .quiz-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
          animation: rotateBg 20s infinite linear;
        }
        
        @keyframes rotateBg {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .quiz-badge {
          display: inline-block;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          margin-bottom: 1rem;
          backdrop-filter: blur(5px);
        }
        
        .quiz-id {
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .quiz-subject {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }
        
        .quiz-info {
          display: flex;
          align-items: center;
          font-size: 0.9rem;
          opacity: 0.9;
        }
        
        .quiz-separator {
          margin: 0 0.5rem;
        }
        
        .questions-container {
          padding: 2rem;
        }
        
        .question-card {
          display: flex;
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          animation: fadeInUp 0.5s forwards ease-out;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .question-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #4a6bdf, #63b3ed);
          color: white;
          font-weight: bold;
          border-radius: 50%;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        
        .question-content {
          flex: 1;
        }
        
        .question-text {
          font-weight: 600;
          margin: 0 0 1rem;
          color: #2d3748;
        }
        
        .options-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .option-item {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .option-item:hover {
          background-color: #f0f4f8;
        }
        
        .option-item.correct-answer {
          background-color: #f0fff4;
          border-color: #48bb78;
        }
        
        .option-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background-color: #edf2f7;
          border-radius: 50%;
          margin-right: 0.75rem;
          font-weight: 600;
          color: #4a5568;
        }
        
        .correct-answer .option-marker {
          background-color: #48bb78;
          color: white;
        }
        
        .option-text {
          flex: 1;
        }
        
        .correct-indicator {
          color: #48bb78;
          font-weight: bold;
          margin-left: 0.5rem;
        }
        
        .quiz-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          padding: 0 2rem 2rem;
          flex-wrap: wrap;
        }
        
        .action-button {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .action-button.primary {
          background-color: #4a6bdf;
          color: white;
          border: none;
        }
        
        .action-button.primary:hover {
          background-color: #3b5bdb;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(74, 107, 223, 0.3);
        }
        
        .action-button.secondary {
          background-color: white;
          color: #4a6bdf;
          border: 2px solid #4a6bdf;
        }
        
        .action-button.secondary:hover {
          background-color: #f0f4ff;
          transform: translateY(-2px);
        }
        
        .action-button.tertiary {
          background-color: #edf2f7;
          color: #4a5568;
          border: none;
        }
        
        .action-button.tertiary:hover {
          background-color: #e2e8f0;
          transform: translateY(-2px);
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
          
          .quiz-form {
            padding: 1.5rem;
          }
          
          .subject-input {
            padding: 0.75rem 1rem;
          }
          
          .quiz-header {
            padding: 1.5rem;
          }
          
          .quiz-subject {
            font-size: 1.5rem;
          }
          
          .questions-container {
            padding: 1.5rem;
          }
          
          .question-card {
            padding: 1rem;
            flex-direction: column;
          }
          
          .question-number {
            margin-bottom: 0.75rem;
          }
          
          .quiz-actions {
            flex-direction: column;
            padding: 0 1.5rem 1.5rem;
          }
          
          .action-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
