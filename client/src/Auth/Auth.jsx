
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nom: "",
    prenom: "",
    speciality: "",
    age: "",
    admin: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [inputFocus, setInputFocus] = useState({
    email: false,
    password: false,
    nom: false,
    prenom: false,
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFocus = (field) => {
    setInputFocus({ ...inputFocus, [field]: true })
  }

  const handleBlur = (field) => {
    setInputFocus({ ...inputFocus, [field]: formData[field].length > 0 })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const url = isSignup ? "http://127.0.0.1:8000/signup" : "http://127.0.0.1:8000/login"

    const payload = isSignup      ? {
          ...formData,
          age: formData.age ? Number.parseInt(formData.age) : undefined,
          admin: false,
        }
      : {
          email: formData.email,
          password: formData.password,
        };
        
    try {
      const response = await axios.post(url, payload)

      const userId = response.data.user._id
      localStorage.setItem("userId", userId)
      // After auth, go to home page; profile is accessed via navbar
      if (isSignup) {
        setIsSignup(false)
      }
      localStorage.setItem("isLoggedIn", "true")
      // Store user category for filtering courses
      localStorage.setItem("speciality", response.data.user.speciality || "")
      localStorage.setItem("prenom", response.data.user.prenom)
      localStorage.setItem("admin", response.data.user.admin ? "true" : "false")
      console.log("Login successful, navigating to HomePages")
      navigate("/HomePages", { replace: true })

      // Reset form
      setFormData({
        email: "",
        password: "",
        nom: "",
        prenom: "",
        speciality: "",
        age: "",
        admin: false,
      })
    } catch (error) {
      setError(error.response ? error.response.data.detail : "Something went wrong.")
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignup(!isSignup)
    setError(null)
    setFormData({
      email: "",
      password: "",
      nom: "",
      prenom: "",
      speciality: "",
      age: "",
      admin: false,
    })
    setInputFocus({
      email: false,
      password: false,
      nom: false,
      prenom: false,
    })
  }

  return (
    <div className="auth-container">
      {/* Multiple floating books */}
      <div className="library">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`book-container book${i + 1}`}>
            <div className="book realistic-book">
              <div className="book-spine"></div>
              <div className="book-cover">
                <div className="book-title">{i % 2 === 0 ? "Learning" : "Education"}</div>
                <div className="book-author">{i % 2 === 0 ? "Campus Portal" : "Knowledge Hub"}</div>
              </div>
              <div className="book-page page1">
                <div className="page-content" />
              </div>
              <div className="book-page page2">
                <div className="page-content" />
              </div>
              <div className="book-page page3">
                <div className="page-content" />
              </div>
              <div className="book-back"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Multiple pens with ink trails */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className={`pen-animation pen${i + 1}`}>
          <div className="pen">
            <div className="pen-cap" />
            <div className="pen-body" />
            <div className="pen-tip" />
          </div>
          <div className="ink-trail" />
        </div>
      ))}

      {/* Floating notes and formulas */}
      <div className="floating-elements">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`floating-element element${i + 1}`}>
            {i % 3 === 0 ? "A²+B²=C²" : i % 3 === 1 ? "E=mc²" : "∫f(x)dx"}
          </div>
        ))}
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">{isSignup ? "Create Account" : "Welcome Back"}</h2>
          <p className="auth-subtitle">{isSignup ? "Sign up to get started" : "Login to your account"}</p>
          <div className="writing-line">
            <svg className="writing-svg" viewBox="0 0 600 30">
              <path
                className="writing-path"
                d="M0,15 C150,5 300,25 600,15"
                fill="none"
                stroke="#6c63ff"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">!</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className={`form-group ${inputFocus.email ? "focused" : ""}`}>
            <label className={formData.email.length > 0 ? "active" : ""}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              required
            />
            <span className="input-highlight"></span>
          </div>

          <div className={`form-group ${inputFocus.password ? "focused" : ""}`}>
            <label className={formData.password.length > 0 ? "active" : ""}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              required
            />
            <span className="input-highlight"></span>
          </div>

          <div className={`signup-fields ${isSignup ? "active" : ""}`}>
            <div className={`form-group ${inputFocus.prenom ? "focused" : ""}`}>
              <label className={formData.prenom.length > 0 ? "active" : ""}>First Name</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                onFocus={() => handleFocus("prenom")}
                onBlur={() => handleBlur("prenom")}
                required={isSignup}
              />
              <span className="input-highlight"></span>
            </div>

            <div className={`form-group ${inputFocus.nom ? "focused" : ""}`}>
              <label className={formData.nom.length > 0 ? "active" : ""}>Last Name</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                onFocus={() => handleFocus("nom")}
                onBlur={() => handleBlur("nom")}
                required={isSignup}
              />
              <span className="input-highlight"></span>
            </div>

            <div className="form-group">
              <label className={formData.speciality.length > 0 ? "active" : ""}>Category</label>
              <select name="speciality" value={formData.speciality} onChange={handleChange} required={isSignup}>
                <option value="">Select category</option>
                <option value="informatique">Informatique</option>
                <option value="gestion">Gestion</option>
                <option value="prepa">Prepa</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          <button type="submit" className={`submit-btn ${loading ? "loading" : ""}`}>
            <span className="btn-text">{isSignup ? "Sign Up" : "Login"}</span>
            <span className="loading-spinner"></span>
          </button>
        </form>

        <div className="auth-footer">
          <button onClick={toggleMode} className="toggle-btn">
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>

      <style jsx>{`
        /* Base styles */
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
          padding: 20px;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 480px;
          padding: 40px;
          position: relative;
          z-index: 10;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .auth-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
          position: relative;
        }

        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
        }

        .auth-subtitle {
          color: #666;
          font-size: 16px;
          margin-bottom: 20px;
        }

        .writing-line {
          margin: 15px 0;
          position: relative;
          height: 30px;
          overflow: hidden;
        }

        .writing-svg {
          width: 100%;
          height: 100%;
        }

        .writing-path {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: write 3s forwards infinite alternate;
        }

        @keyframes write {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Form styles */
        .auth-form {
          margin-bottom: 20px;
        }

        .form-group {
          position: relative;
          margin-bottom: 24px;
        }

        .form-group label {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .form-group label.active,
        .form-group.focused label {
          top: 0;
          left: 10px;
          font-size: 12px;
          background: white;
          padding: 0 5px;
          color: #6c63ff;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: transparent;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #6c63ff;
          box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2);
          outline: none;
        }

        .input-highlight {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 0;
          background: #6c63ff;
          transition: all 0.3s ease;
        }

        .form-group.focused .input-highlight {
          width: 100%;
        }

        .signup-fields {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease;
        }

        .signup-fields.active {
          max-height: 500px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: #6c63ff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: #5a52d5;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(108, 99, 255, 0.4);
        }

        .submit-btn.loading .btn-text {
          opacity: 0;
        }

        .submit-btn.loading .loading-spinner {
          opacity: 1;
        }

        .loading-spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
          opacity: 0;
        }

        @keyframes spin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .error-message {
          background: #fff5f5;
          border-left: 4px solid #ff4d4f;
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }

        .error-icon {
          background: #ff4d4f;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 10px;
        }

        .auth-footer {
          text-align: center;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: #6c63ff;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-btn:hover {
          text-decoration: underline;
          color: #5a52d5;
        }

        /* Enhanced Book Animation Styles */
        .library {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .book-container {
          position: absolute;
          transform-style: preserve-3d;
          perspective: 1000px;
          animation: float 15s infinite ease-in-out;
        }

        .book1 {
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }

        .book2 {
          top: 60%;
          left: 15%;
          animation-delay: -3s;
        }

        .book3 {
          top: 25%;
          right: 15%;
          animation-delay: -6s;
        }

        .book4 {
          top: 70%;
          right: 10%;
          animation-delay: -9s;
        }

        .book5 {
          top: 40%;
          left: 80%;
          animation-delay: -12s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(5deg);
          }
          50% {
            transform: translateY(0) rotate(0deg);
          }
          75% {
            transform: translateY(15px) rotate(-5deg);
          }
        }

        .book {
          position: relative;
          width: 80px;
          height: 120px;
          transform-style: preserve-3d;
          transform: rotateY(-30deg) rotateX(5deg);
          transition: transform 0.5s;
          animation: bookOpen 10s infinite alternate ease-in-out;
        }

        @keyframes bookOpen {
          0%, 100% {
            transform: rotateY(-30deg) rotateX(5deg);
          }
          50% {
            transform: rotateY(-60deg) rotateX(8deg);
          }
        }

        .book-spine {
          position: absolute;
          width: 20px;
          height: 120px;
          background: linear-gradient(to right, #8a2387, #e94057, #f27121);
          transform: translateX(-10px) rotateY(90deg);
          transform-origin: right;
          border-radius: 3px 0 0 3px;
        }

        .book-cover {
          position: absolute;
          width: 80px;
          height: 120px;
          background: linear-gradient(45deg, #6c63ff, #3b82f6);
          border-radius: 3px 10px 10px 3px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          padding: 10px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          text-align: center;
          font-size: 12px;
          backface-visibility: hidden;
        }

        .book-title {
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 14px;
        }

        .book-author {
          font-size: 10px;
          opacity: 0.8;
        }

        .book-page {
          position: absolute;
          width: 76px;
          height: 116px;
          background: #f8f9fa;
          border-radius: 0 3px 3px 0;
          transform-origin: left;
          transform: rotateY(0);
          animation: pageFlip 10s infinite ease-in-out;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }

        .page-content {
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            #f8f9fa,
            #f8f9fa 10px,
            #e9ecef 10px,
            #e9ecef 11px
          );
          opacity: 0.7;
        }

        .page1 {
          animation-delay: 0s;
        }

        .page2 {
          animation-delay: 0.5s;
        }

        .page3 {
          animation-delay: 1s;
        }

        @keyframes pageFlip {
          0%, 100% {
            transform: rotateY(0);
          }
          25% {
            transform: rotateY(-30deg);
          }
          50% {
            transform: rotateY(-60deg);
          }
          75% {
            transform: rotateY(-120deg);
          }
        }

        .book-back {
          position: absolute;
          width: 80px;
          height: 120px;
          background: #4a4a4a;
          transform: translateZ(-5px);
          border-radius: 3px;
        }

        /* Enhanced Pen Animation Styles */
        .pen-animation {
          position: absolute;
          z-index: 2;
          pointer-events: none;
          animation: penMove 20s infinite linear;
        }

        .pen1 {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
        }

        .pen2 {
          top: 70%;
          left: 70%;
          animation-delay: -7s;
        }

        .pen3 {
          top: 30%;
          right: 20%;
          animation-delay: -14s;
        }

        @keyframes penMove {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(100px, 50px) rotate(45deg);
          }
          50% {
            transform: translate(0, 100px) rotate(90deg);
          }
          75% {
            transform: translate(-100px, 50px) rotate(135deg);
          }
          100% {
            transform: translate(0, 0) rotate(180deg);
          }
        }

        .pen {
          position: relative;
          width: 10px;
          height: 60px;
          transform-origin: bottom;
          animation: penWrite 3s infinite alternate ease-in-out;
        }

        @keyframes penWrite {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        .pen-cap {
          position: absolute;
          top: 0;
          width: 10px;
          height: 15px;
          background: #333;
          border-radius: 5px 5px 0 0;
        }

        .pen-body {
          position: absolute;
          top: 15px;
          width: 10px;
          height: 40px;
          background: linear-gradient(to bottom, #6c63ff, #3b82f6);
          border-radius: 2px;
        }

        .pen-tip {
          position: absolute;
          bottom: 0;
          width: 10px;
          height: 5px;
          background: #111;
          border-radius: 0 0 5px 5px;
        }

        .ink-trail {
          position: absolute;
          top: 65px;
          left: 5px;
          width: 2px;
          height: 0;
          background: rgba(59, 130, 246, 0.5);
          animation: inkDraw 3s infinite;
          transform-origin: top;
        }

        @keyframes inkDraw {
          0% {
            height: 0;
            opacity: 0;
          }
          20% {
            height: 50px;
            opacity: 0.8;
          }
          100% {
            height: 100px;
            opacity: 0;
            transform: rotate(5deg);
          }
        }

        /* Floating Elements (Math Formulas, Notes) */
        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .floating-element {
          position: absolute;
          font-family: 'Courier New', monospace;
          color: rgba(108, 99, 255, 0.7);
          font-weight: bold;
          font-size: 16px;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
          animation: floatElement 20s infinite linear;
          opacity: 0.7;
        }

        @keyframes floatElement {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translate(var(--translate-x, 100px), var(--translate-y, 100px)) rotate(var(--rotate, 360deg));
            opacity: 0;
          }
        }

        .element1 {
          top: 10%;
          left: 20%;
          --translate-x: 150px;
          --translate-y: 80px;
          --rotate: 180deg;
          animation-delay: 0s;
        }

        .element2 {
          top: 80%;
          left: 10%;
          --translate-x: 100px;
          --translate-y: -120px;
          --rotate: -90deg;
          animation-delay: -3s;
        }

        .element3 {
          top: 30%;
          right: 15%;
          --translate-x: -200px;
          --translate-y: 50px;
          --rotate: 270deg;
          animation-delay: -6s;
        }

        .element4 {
          top: 60%;
          right: 20%;
          --translate-x: -150px;
          --translate-y: -100px;
          --rotate: -180deg;
          animation-delay: -9s;
        }

        .element5 {
          top: 40%;
          left: 50%;
          --translate-x: -100px;
          --translate-y: 150px;
          --rotate: 90deg;
          animation-delay: -12s;
        }

        .element6 {
          top: 20%;
          left: 70%;
          --translate-x: -50px;
          --translate-y: 200px;
          --rotate: 45deg;
          animation-delay: -15s;
        }

        .element7 {
          top: 70%;
          left: 40%;
          --translate-x: 120px;
          --translate-y: -80px;
          --rotate: -45deg;
          animation-delay: -18s;
        }

        .element8 {
          top: 50%;
          left: 30%;
          --translate-x: 180px;
          --translate-y: -50px;
          --rotate: 120deg;
          animation-delay: -21s;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .auth-card {
            padding: 30px 20px;
          }
          
          .auth-title {
            font-size: 24px;
          }
          
          .book {
            width: 60px;
            height: 90px;
          }
          
          .book-spine {
            width: 15px;
            height: 90px;
            transform: translateX(-7.5px) rotateY(90deg);
          }
          
          .book-cover {
            width: 60px;
            height: 90px;
          }
          
          .book-page {
            width: 57px;
            height: 87px;
          }
          
          .book-back {
            width: 60px;
            height: 90px;
          }
          
          .pen {
            width: 8px;
            height: 45px;
          }
          
          .pen-cap {
            width: 8px;
            height: 12px;
          }
          
          .pen-body {
            top: 12px;
            width: 8px;
            height: 30px;
          }
          
          .pen-tip {
            width: 8px;
            height: 3px;
          }
          
          .ink-trail {
            top: 45px;
            left: 4px;
          }
          
          .floating-element {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}

export default Auth
