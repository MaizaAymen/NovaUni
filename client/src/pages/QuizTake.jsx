"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar1 from "./navbar"
import SidebarWithSearch from "../components/SidebarWithSearch.jsx"

const QuizTake = () => {
  const { quizId } = useParams() // quizId is actually the index now
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Fetch all quizzes, then select by index
    const fetchQuizzes = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get("http://127.0.0.1:8000/quizzes/", {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        if (Array.isArray(res.data)) {
          setQuizzes(res.data)
          const idx = Number.parseInt(quizId, 10)
          if (!isNaN(idx) && res.data[idx]) {
            setQuiz(res.data[idx])
            setAnswers(new Array(res.data[idx].questions.length).fill(""))
            // Set default time limit if not provided (15 minutes)
            setTimeLeft((res.data[idx].timeLimit || 15) * 60)
          } else {
            setError("Quiz not found for this index.")
          }
        } else {
          setError("No quizzes found.")
        }
      } catch (err) {
        setError("Failed to load quizzes.")
      } finally {
        setTimeout(() => setLoading(false), 1000) // Add slight delay for animation
      }
    }
    fetchQuizzes()
  }, [quizId])

  // Timer effect
  useEffect(() => {
    if (!loading && quiz && timeLeft !== null && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit(new Event("submit"))
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [loading, quiz, submitted, timeLeft])

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answer
    setAnswers(newAnswers)
    setSelectedOption(answer)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(answers[currentQuestion + 1] || null)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption(answers[currentQuestion - 1] || null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!quiz) return

    // Optionally validate all questions answered
    if (answers.some((a) => !a)) {
      setError("Please answer all questions.")
      return
    }

    setIsSubmitting(true)

    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        setError("You must be logged in to submit a quiz")
        setIsSubmitting(false)
        return
      }
      // Always use quiz._id (string) for submission endpoint
      const quizIdentifier = quiz._id ? quiz._id : quizId
      const submission = {
        student_id: userId,
        quiz_id: quizIdentifier,
        answers: answers,
      }
      // Simulate result instantly (no API call)
      // Calculate score locally
      let correct = 0
      quiz.questions.forEach((q, i) => {
        if (answers[i] === q.correct_answer) correct++
      })
      const localScore = Math.round((correct / quiz.questions.length) * 100)
      setScore(localScore)
      setTimeout(() => {
        setSubmitted(true)
        setIsSubmitting(false)
      }, 500)
    } catch (err) {
      setError("Failed to submit quiz")
      setIsSubmitting(false)
    }
  }

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progressPercentage = quiz ? (currentQuestion / quiz.questions.length) * 100 : 0
  const answeredCount = answers.filter((a) => a).length
  const totalQuestions = quiz?.questions?.length || 0
  const completionPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  return (
    <div className="quiz-take-container">
      <Navbar1 />
      <div className="main-content">
        <SidebarWithSearch />
        <div className="quiz-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-animation">
                <div className="book-loader">
                  <div className="book-page"></div>
                  <div className="book-page"></div>
                  <div className="book-page"></div>
                </div>
                <p className="loading-text">Loading quiz...</p>
              </div>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-icon">!</div>
              <div className="error-content">
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button onClick={() => navigate("/quizzes")} className="back-button">
                  Back to Quizzes
                </button>
              </div>
            </div>
          ) : !quiz ? (
            <div className="not-found-container">
              <div className="not-found-icon">?</div>
              <h3>Quiz Not Found</h3>
              <button onClick={() => navigate("/quizzes")} className="back-button">
                Back to Quizzes
              </button>
            </div>
          ) : submitted ? (
            <div className="results-container">
              <div className="results-card">
                <div className="confetti-container">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`confetti confetti-${i % 5}`}></div>
                  ))}
                </div>
                <div className="trophy-icon">🏆</div>
                <h2 className="results-title">Quiz Completed!</h2>
                <div className="score-display">
                  <div className="score-circle">
                    <div className="score-value">{score}%</div>
                    <svg className="score-svg" width="150" height="150" viewBox="0 0 150 150">
                      <circle
                        className="score-circle-bg"
                        cx="75"
                        cy="75"
                        r="65"
                        strokeWidth="10"
                        stroke="#e2e8f0"
                        fill="none"
                      />
                      <circle
                        className="score-circle-progress"
                        cx="75"
                        cy="75"
                        r="65"
                        strokeWidth="10"
                        stroke="#4a6bdf"
                        fill="none"
                        strokeDasharray="408"
                        strokeDashoffset={408 - (408 * score) / 100}
                        transform="rotate(-90 75 75)"
                      />
                    </svg>
                  </div>
                </div>
                <div className="results-message">
                  {score >= 80 ? (
                    <p>Excellent work! You've mastered this topic.</p>
                  ) : score >= 60 ? (
                    <p>Good job! You have a solid understanding of this material.</p>
                  ) : (
                    <p>Keep practicing! You'll improve with more study.</p>
                  )}
                </div>
                <button onClick={() => navigate("/quizzes")} className="back-button">
                  Back to Quizzes
                </button>
              </div>
            </div>
          ) : (
            <div className="quiz-container">
              <div className="quiz-header">
                <h1 className="quiz-title">{quiz.subject}</h1>
                <div className="quiz-meta">
                  <div className="timer-container">
                    <div className="timer-icon">⏱️</div>
                    <div className="timer-display">{formatTime(timeLeft)}</div>
                  </div>
                  <div className="progress-container">
                    <div className="progress-text">
                      {answeredCount}/{totalQuestions} Answered
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="questions-navigation">
                  <div className="question-dots">
                    {quiz.questions.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`question-dot ${index === currentQuestion ? "active" : ""} ${
                          answers[index] ? "answered" : ""
                        }`}
                        onClick={() => {
                          setCurrentQuestion(index)
                          setSelectedOption(answers[index] || null)
                        }}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="question-container">
                  {quiz.questions.map((question, qIndex) => (
                    <div key={qIndex} className={`question-card ${qIndex === currentQuestion ? "active" : ""}`}>
                      <div className="question-number">{qIndex + 1}</div>
                      <h3 className="question-text">{question.question}</h3>
                      <div className="options-container">
                        {question.options.map((option, oIndex) => (
                          <div
                            key={oIndex}
                            className={`option-item ${answers[qIndex] === option ? "selected" : ""}`}
                            onClick={() => handleAnswerChange(qIndex, option)}
                          >
                            <div className="option-marker">{String.fromCharCode(65 + oIndex)}</div>
                            <div className="option-text">{option}</div>
                            {answers[qIndex] === option && <div className="check-icon">✓</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="navigation-buttons">
                  <button
                    type="button"
                    className="nav-button prev"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </button>
                  {currentQuestion < quiz.questions.length - 1 ? (
                    <button type="button" className="nav-button next" onClick={handleNextQuestion}>
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={`submit-button ${isSubmitting ? "submitting" : ""}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="submit-text">Submitting</span>
                          <span className="submit-dots">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </span>
                        </>
                      ) : (
                        "Submit Quiz"
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* Base styles */
        .quiz-take-container {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          min-height: 100vh;
          background-color: #f8fafc;
          color: #2d3748;
        }
        
        .main-content {
          display: flex;
          height: calc(100vh - 80px);
        }
        
        .quiz-content {
          flex: 1;
          overflow: auto;
          padding: 2rem;
          position: relative;
        }
        
        /* Loading animation */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          animation: fadeIn 0.5s ease-out;
        }
        
        .loading-animation {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .book-loader {
          position: relative;
          width: 120px;
          height: 80px;
          margin-bottom: 2rem;
          perspective: 500px;
        }
        
        .book-page {
          position: absolute;
          width: 100px;
          height: 140px;
          background-color: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 2px 10px 10px 2px;
          transform-origin: left center;
          transform-style: preserve-3d;
          animation: pageFlip 1.5s infinite ease-in-out;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .book-page:nth-child(1) {
          animation-delay: 0s;
          background: linear-gradient(to right, #4a6bdf, #63b3ed);
          z-index: 3;
        }
        
        .book-page:nth-child(2) {
          animation-delay: 0.25s;
          background: #fff;
          z-index: 2;
        }
        
        .book-page:nth-child(3) {
          animation-delay: 0.5s;
          background: #f7fafc;
          z-index: 1;
        }
        
        @keyframes pageFlip {
          0%, 100% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(-160deg);
          }
        }
        
        .loading-text {
          font-size: 1.1rem;
          color: #4a5568;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        /* Error and Not Found styles */
        .error-container, .not-found-container {
          max-width: 600px;
          margin: 3rem auto;
          padding: 2rem;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: center;
          animation: fadeInUp 0.5s ease-out;
        }
        
        .error-icon, .not-found-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          font-size: 2rem;
          font-weight: bold;
          animation: pulseError 2s infinite;
        }
        
        .error-icon {
          background-color: #fed7d7;
          color: #e53e3e;
        }
        
        .not-found-icon {
          background-color: #e2e8f0;
          color: #4a5568;
        }
        
        @keyframes pulseError {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(229, 62, 62, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(229, 62, 62, 0.2);
          }
        }
        
        .error-content h3, .not-found-container h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #2d3748;
        }
        
        .error-content p {
          color: #4a5568;
          margin-bottom: 1.5rem;
        }
        
        .back-button {
          background-color: #4a6bdf;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .back-button:hover {
          background-color: #3b5bdb;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(74, 107, 223, 0.3);
        }
        
        /* Quiz container styles */
        .quiz-container {
          max-width: 800px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease-out;
        }
        
        .quiz-header {
          background: linear-gradient(135deg, #4a6bdf, #63b3ed);
          color: white;
          padding: 1.5rem 2rem;
          border-radius: 10px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
        
        .quiz-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 1rem;
          position: relative;
        }
        
        .quiz-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }
        
        .timer-container {
          display: flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          backdrop-filter: blur(5px);
        }
        
        .timer-icon {
          margin-right: 0.5rem;
        }
        
        .timer-display {
          font-weight: 600;
          font-family: 'Courier New', monospace;
        }
        
        .progress-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        .progress-text {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .progress-bar {
          width: 150px;
          height: 8px;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background-color: white;
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        
        /* Questions navigation */
        .questions-navigation {
          margin-bottom: 2rem;
        }
        
        .question-dots {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }
        
        .question-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          border: 2px solid #e2e8f0;
          color: #4a5568;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .question-dot.active {
          background-color: #4a6bdf;
          border-color: #4a6bdf;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(74, 107, 223, 0.3);
        }
        
        .question-dot.answered {
          background-color: #e6effd;
          border-color: #4a6bdf;
          color: #4a6bdf;
        }
        
        .question-dot.answered.active {
          background-color: #4a6bdf;
          color: white;
        }
        
        /* Question card styles */
        .question-container {
          position: relative;
          min-height: 300px;
        }
        
        .question-card {
          background-color: white;
          border-radius: 10px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.5s ease;
          visibility: hidden;
        }
        
        .question-card.active {
          opacity: 1;
          transform: translateX(0);
          visibility: visible;
        }
        
        .question-number {
          position: absolute;
          top: -15px;
          left: -15px;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #4a6bdf, #63b3ed);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .question-text {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #2d3748;
          line-height: 1.5;
        }
        
        .options-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .option-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          background-color: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .option-item:hover {
          background-color: #edf2f7;
          transform: translateY(-2px);
        }
        
        .option-item.selected {
          background-color: #e6effd;
          border-color: #4a6bdf;
        }
        
        .option-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background-color: white;
          border: 2px solid #cbd5e0;
          border-radius: 50%;
          margin-right: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .option-item.selected .option-marker {
          background-color: #4a6bdf;
          border-color: #4a6bdf;
          color: white;
        }
        
        .option-text {
          flex: 1;
        }
        
        .check-icon {
          margin-left: 1rem;
          color: #4a6bdf;
          font-weight: bold;
          animation: scaleIn 0.3s ease-out;
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Navigation buttons */
        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
        
        .nav-button {
          padding: 0.75rem 1.5rem;
          background-color: white;
          border: 2px solid #4a6bdf;
          color: #4a6bdf;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .nav-button:hover:not(:disabled) {
          background-color: #f0f4ff;
          transform: translateY(-2px);
        }
        
        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .submit-button {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(90deg, #4a6bdf, #63b3ed);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(74, 107, 223, 0.3);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .submit-button::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
          transform: rotate(0deg);
          transition: transform 1s linear;
        }
        
        .submit-button:hover::before {
          transform: rotate(180deg);
        }
        
        .submit-button.submitting {
          background: linear-gradient(90deg, #3b5bdb, #4a6bdf);
        }
        
        .submit-dots {
          display: inline-flex;
          margin-left: 0.5rem;
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
        
        /* Results styles */
        .results-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          animation: fadeIn 0.5s ease-out;
        }
        
        .results-card {
          background-color: white;
          border-radius: 10px;
          padding: 3rem 2rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 500px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #4a6bdf;
          opacity: 0.8;
          animation: confettiFall 5s linear infinite;
        }
        
        .confetti-0 {
          background-color: #4a6bdf;
          left: 10%;
          animation-delay: 0s;
        }
        
        .confetti-1 {
          background-color: #63b3ed;
          left: 20%;
          animation-delay: 0.5s;
        }
        
        .confetti-2 {
          background-color: #48bb78;
          left: 30%;
          animation-delay: 1s;
        }
        
        .confetti-3 {
          background-color: #ed64a6;
          left: 40%;
          animation-delay: 1.5s;
        }
        
        .confetti-4 {
          background-color: #ecc94b;
          left: 50%;
          animation-delay: 2s;
        }
        
        .confetti-0, .confetti-5, .confetti-10, .confetti-15 {
          background-color: #4a6bdf;
        }
        
        .confetti-1, .confetti-6, .confetti-11, .confetti-16 {
          background-color: #63b3ed;
        }
        
        .confetti-2, .confetti-7, .confetti-12, .confetti-17 {
          background-color: #48bb78;
        }
        
        .confetti-3, .confetti-8, .confetti-13, .confetti-18 {
          background-color: #ed64a6;
        }
        
        .confetti-4, .confetti-9, .confetti-14, .confetti-19 {
          background-color: #ecc94b;
        }
        
        .confetti-5 {
          left: 60%;
          animation-delay: 2.5s;
        }
        
        .confetti-6 {
          left: 70%;
          animation-delay: 3s;
        }
        
        .confetti-7 {
          left: 80%;
          animation-delay: 3.5s;
        }
        
        .confetti-8 {
          left: 90%;
          animation-delay: 4s;
        }
        
        .confetti-9 {
          left: 100%;
          animation-delay: 4.5s;
        }
        
        .confetti-10 {
          left: 15%;
          animation-delay: 0.2s;
        }
        
        .confetti-11 {
          left: 25%;
          animation-delay: 0.7s;
        }
        
        .confetti-12 {
          left: 35%;
          animation-delay: 1.2s;
        }
        
        .confetti-13 {
          left: 45%;
          animation-delay: 1.7s;
        }
        
        .confetti-14 {
          left: 55%;
          animation-delay: 2.2s;
        }
        
        .confetti-15 {
          left: 65%;
          animation-delay: 2.7s;
        }
        
        .confetti-16 {
          left: 75%;
          animation-delay: 3.2s;
        }
        
        .confetti-17 {
          left: 85%;
          animation-delay: 3.7s;
        }
        
        .confetti-18 {
          left: 95%;
          animation-delay: 4.2s;
        }
        
        .confetti-19 {
          left: 5%;
          animation-delay: 4.7s;
        }
        
        @keyframes confettiFall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(360deg);
            opacity: 0;
          }
        }
        
        .trophy-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: trophyBounce 2s infinite ease-in-out;
        }
        
        @keyframes trophyBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .results-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #2d3748;
        }
        
        .score-display {
          margin-bottom: 2rem;
        }
        
        .score-circle {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto;
        }
        
        .score-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2.5rem;
          font-weight: 700;
          color: #4a6bdf;
        }
        
        .score-circle-progress {
          transition: stroke-dashoffset 1s ease-out;
        }
        
        .results-message {
          margin-bottom: 2rem;
          color: #4a5568;
          font-size: 1.1rem;
        }
        
        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .quiz-content {
            padding: 1rem;
          }
          
          .quiz-header {
            padding: 1.5rem;
          }
          
          .quiz-title {
            font-size: 1.5rem;
          }
          
          .quiz-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .progress-container {
            align-items: flex-start;
            width: 100%;
          }
          
          .progress-bar {
            width: 100%;
          }
          
          .question-card {
            padding: 1.5rem;
          }
          
          .question-text {
            font-size: 1.1rem;
          }
          
          .option-item {
            padding: 0.75rem;
          }
          
          .navigation-buttons {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-button, .submit-button {
            width: 100%;
          }
          
          .results-card {
            padding: 2rem 1.5rem;
          }
          
          .results-title {
            font-size: 1.8rem;
          }
          
          .score-circle {
            width: 120px;
            height: 120px;
          }
          
          .score-value {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}

export default QuizTake
