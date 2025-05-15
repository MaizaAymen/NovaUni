import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar1 from "./navbar.jsx"

const HomePages = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [nom, setUsername] = useState("")
  const userId = localStorage.getItem("userId")
  const navigate = useNavigate()

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const storedUsername = localStorage.getItem("prenom") || ""
    console.log("isLoggedIn:", isUserLoggedIn)
    console.log("nom:", storedUsername)
    setIsLoggedIn(isUserLoggedIn)
    setUsername(storedUsername)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("nom")
    setIsLoggedIn(false)
    setUsername("")
    navigate("/")
  }

  return (
    <div className="container">
      {/* Header */}
      <Navbar1 />
      <main>
        <section className="hero">
          <div className="heroContent">
            {isLoggedIn ? (
              <>
                <h1>Hello, {nom}</h1>
                {/* Link to profile page */}
                <Link to={`/profile/${userId}`} className="secondaryBtn" style={{ marginRight: "8px" }}>
                  My Profile
                </Link>
                <button className="secondaryBtn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <h1>Manage Your Educational Institution with Ease</h1>
                <p>
                  A comprehensive student management system to streamline administration, enhance learning, and improve
                  communication.
                </p>
                <div className="heroBtns">
                  <button className="primaryBtn">Get Started</button>
                  <button className="secondaryBtn">Learn More</button>
                </div>
              </>
            )}
          </div>

          <div className="heroImage">
            {/* Animated Books */}
            <div className="books-container">
              <div className="book book1">
                <div className="book-cover">
                  <div className="book-spine"></div>
                  <div className="book-title">Mathematics</div>
                </div>
                <div className="book-pages">
                  <div className="book-page"></div>
                  <div className="book-page"></div>
                  <div className="book-page"></div>
                </div>
              </div>

              <div className="book book2">
                <div className="book-cover">
                  <div className="book-spine"></div>
                  <div className="book-title">Science</div>
                </div>
                <div className="book-pages">
                  <div className="book-page"></div>
                  <div className="book-page"></div>
                  <div className="book-page"></div>
                </div>
              </div>

              <div className="book book3">
                <div className="book-cover">
                  <div className="book-spine"></div>
                  <div className="book-title">History</div>
                </div>
                <div className="book-pages">
                  <div className="book-page"></div>
                  <div className="book-page"></div>
                  <div className="book-page"></div>
                </div>
              </div>

              <div className="book book4">
                <div className="book-cover">
                  <div className="book-spine"></div>
                  <div className="book-title">Literature</div>
                </div>
                <div className="book-pages">
                  <div className="book-page"></div>
                  <div className="book-page"></div>
                  <div className="book-page"></div>
                </div>
              </div>
            </div>

            {/* Animated Pens */}
            <div className="pens-container">
              <div className="pen pen1">
                <div className="pen-cap"></div>
                <div className="pen-body"></div>
                <div className="pen-tip"></div>
                <div className="ink-trail"></div>
              </div>

              <div className="pen pen2">
                <div className="pen-cap"></div>
                <div className="pen-body"></div>
                <div className="pen-tip"></div>
                <div className="ink-trail"></div>
              </div>

              <div className="pen pen3">
                <div className="pen-cap"></div>
                <div className="pen-body"></div>
                <div className="pen-tip"></div>
                <div className="ink-trail"></div>
              </div>
            </div>

            {/* Floating Educational Elements */}
            <div className="floating-elements">
              <div className="floating-element formula1">E=mc²</div>
              <div className="floating-element formula2">a²+b²=c²</div>
              <div className="floating-element formula3">F=ma</div>
              <div className="floating-element formula4">∫f(x)dx</div>
              <div className="floating-element formula5">y=mx+b</div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <h2>Key Features</h2>
          <div className="featureCards">
            <div className="featureCard">
              <div className="featureIcon">📊</div>
              <h3>Student Records</h3>
              <p>Maintain comprehensive student profiles with academic history, attendance, and performance metrics.</p>
            </div>
            <div className="featureCard">
              <div className="featureIcon">📚</div>
              <h3>Course Management</h3>
              <p>Create, update, and manage courses with detailed syllabi, schedules, and resource allocation.</p>
            </div>
            <div className="featureCard">
              <div className="featureIcon">📝</div>
              <h3>Assessment Tracking</h3>
              <p>Track assignments, exams, and other assessments with automated grading and performance analytics.</p>
            </div>
            <div className="featureCard">
              <div className="featureIcon">📅</div>
              <h3>Attendance System</h3>
              <p>Monitor student and teacher attendance with automated notifications for absences.</p>
            </div>
          </div>
        </section>

        <section className="testimonials" id="testimonials">
          <h2>What Our Users Say</h2>
          <div className="testimonialCards">
            <div className="testimonialCard">
              <p>
                "EduManage has transformed how we handle student data and course management. It's intuitive and
                powerful."
              </p>
              <div className="testimonialAuthor">
                <strong>Sarah Johnson</strong>
                <span>Principal, Lincoln High School</span>
              </div>
            </div>
            <div className="testimonialCard">
              <p>"The reporting features have saved our administrative staff countless hours. Highly recommended!"</p>
              <div className="testimonialAuthor">
                <strong>Michael Chen</strong>
                <span>Dean of Students, Westlake College</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <h2>Ready to Transform Your Educational Institution?</h2>
          <p>Join thousands of schools and colleges that have streamlined their operations with EduManage.</p>
          <button className="primaryBtn">Start Free Trial</button>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footerContent">
          <div className="footerLogo">
            <img
              src="https://placehold.co/40x40/FFFFFF/2563eb?text=E"
              alt="Student Management System Logo"
              width={40}
              height={40}
            />
            <h2>EduManage</h2>
          </div>
          <div className="footerLinks">
            <div className="footerLinkGroup">
              <h3>Product</h3>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#testimonials">Testimonials</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footerLinkGroup">
              <h3>Company</h3>
              <a href="#about">About Us</a>
              <a href="#careers">Careers</a>
              <a href="#blog">Blog</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footerLinkGroup">
              <h3>Resources</h3>
              <a href="#docs">Documentation</a>
              <a href="#support">Support</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footerBottom">
          <p>&copy; {new Date().getFullYear()} EduManage. All rights reserved.</p>
        </div>
      </footer>

      {/* CSS Styles */}
      <style jsx>{`
        /* Base styles for the container */
        .container {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #333;
          line-height: 1.6;
          overflow-x: hidden;
          position: relative;
        }

        /* Hero section styles */
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 4rem 2rem;
          min-height: 80vh;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .heroContent {
          max-width: 600px;
          text-align: center;
          z-index: 10;
          margin-bottom: 2rem;
        }

        .heroContent h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #2563eb;
        }

        .heroContent p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          color: #4b5563;
        }

        .heroBtns {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .primaryBtn {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primaryBtn:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .secondaryBtn {
          background-color: white;
          color: #2563eb;
          border: 1px solid #2563eb;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .secondaryBtn:hover {
          background-color: #f0f9ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .heroImage {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 300px;
          z-index: 1;
        }

        /* Book Animation Styles */
        .books-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .book {
          position: absolute;
          width: 80px;
          height: 120px;
          transform-style: preserve-3d;
          perspective: 1000px;
          animation: float 15s infinite ease-in-out;
        }

        .book1 {
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }

        .book2 {
          top: 60%;
          left: 25%;
          animation-delay: -3s;
        }

        .book3 {
          top: 30%;
          right: 20%;
          animation-delay: -6s;
        }

        .book4 {
          top: 70%;
          right: 15%;
          animation-delay: -9s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(0) rotate(0deg);
          }
          75% {
            transform: translateY(20px) rotate(-5deg);
          }
        }

        .book-cover {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #2563eb, #3b82f6);
          border-radius: 3px 10px 10px 3px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          transform-style: preserve-3d;
          transform: rotateY(-30deg);
          animation: bookOpen 10s infinite alternate ease-in-out;
        }

        @keyframes bookOpen {
          0%, 100% {
            transform: rotateY(-30deg);
          }
          50% {
            transform: rotateY(-60deg);
          }
        }

        .book-spine {
          position: absolute;
          width: 20px;
          height: 100%;
          left: -10px;
          background: linear-gradient(to right, #1e40af, #2563eb);
          transform: rotateY(90deg) translateZ(-10px);
          border-radius: 3px 0 0 3px;
        }

        .book-title {
          position: absolute;
          width: 100%;
          text-align: center;
          top: 50%;
          transform: translateY(-50%);
          color: white;
          font-weight: bold;
          font-size: 14px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .book-pages {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .book-page {
          position: absolute;
          width: 75px;
          height: 115px;
          background: #f8f9fa;
          border-radius: 0 3px 3px 0;
          transform-origin: left;
          left: 0;
          top: 2.5px;
          transform: rotateY(0);
          animation: pageFlip 10s infinite ease-in-out;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          background-image: repeating-linear-gradient(#f8f9fa, #f8f9fa 10px, #e9ecef 10px, #e9ecef 11px);
        }

        .book-page:nth-child(1) {
          animation-delay: 0s;
        }

        .book-page:nth-child(2) {
          animation-delay: 0.5s;
        }

        .book-page:nth-child(3) {
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

        /* Pen Animation Styles */
        .pens-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .pen {
          position: absolute;
          width: 10px;
          height: 60px;
          animation: penMove 20s infinite linear;
        }

        .pen1 {
          top: 40%;
          left: 40%;
          animation-delay: 0s;
        }

        .pen2 {
          top: 20%;
          left: 60%;
          animation-delay: -7s;
        }

        .pen3 {
          top: 70%;
          left: 50%;
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
          background: linear-gradient(to bottom, #2563eb, #3b82f6);
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

        /* Floating Elements (Math Formulas) */
        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .floating-element {
          position: absolute;
          font-family: 'Courier New', monospace;
          color: rgba(37, 99, 235, 0.7);
          font-weight: bold;
          font-size: 16px;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
          animation: floatElement 15s infinite linear;
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

        .formula1 {
          top: 15%;
          left: 30%;
          --translate-x: 150px;
          --translate-y: 80px;
          --rotate: 180deg;
          animation-delay: 0s;
        }

        .formula2 {
          top: 75%;
          left: 20%;
          --translate-x: 100px;
          --translate-y: -120px;
          --rotate: -90deg;
          animation-delay: -3s;
        }

        .formula3 {
          top: 25%;
          right: 30%;
          --translate-x: -200px;
          --translate-y: 50px;
          --rotate: 270deg;
          animation-delay: -6s;
        }

        .formula4 {
          top: 65%;
          right: 25%;
          --translate-x: -150px;
          --translate-y: -100px;
          --rotate: -180deg;
          animation-delay: -9s;
        }

        .formula5 {
          top: 45%;
          left: 45%;
          --translate-x: -100px;
          --translate-y: 150px;
          --rotate: 90deg;
          animation-delay: -12s;
        }

        /* Features section styles */
        .features {
          padding: 5rem 2rem;
          text-align: center;
          background-color: #f9fafb;
        }

        .features h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 3rem;
          color: #2563eb;
        }

        .featureCards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .featureCard {
          background-color: white;
          border-radius: 0.5rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .featureCard:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .featureIcon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .featureCard h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .featureCard p {
          color: #6b7280;
        }

        /* Testimonials section styles */
        .testimonials {
          padding: 5rem 2rem;
          text-align: center;
          background-color: white;
        }

        .testimonials h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 3rem;
          color: #2563eb;
        }

        .testimonialCards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .testimonialCard {
          background-color: #f9fafb;
          border-radius: 0.5rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: left;
        }

        .testimonialCard p {
          font-style: italic;
          margin-bottom: 1.5rem;
          color: #4b5563;
        }

        .testimonialAuthor {
          display: flex;
          flex-direction: column;
        }

        .testimonialAuthor strong {
          color: #1f2937;
        }

        .testimonialAuthor span {
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* CTA section styles */
        .cta {
          padding: 5rem 2rem;
          text-align: center;
          background-color: #2563eb;
          color: white;
        }

        .cta h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .cta p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta .primaryBtn {
          background-color: white;
          color: #2563eb;
        }

        .cta .primaryBtn:hover {
          background-color: #f0f9ff;
        }

        /* Footer styles */
        .footer {
          background-color: #1f2937;
          color: white;
          padding: 4rem 2rem 2rem;
        }

        .footerContent {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footerLogo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .footerLogo h2 {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .footerLinks {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .footerLinkGroup h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #e5e7eb;
        }

        .footerLinkGroup a {
          display: block;
          color: #9ca3af;
          margin-bottom: 0.75rem;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footerLinkGroup a:hover {
          color: white;
        }

        .footerBottom {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #374151;
          text-align: center;
          color: #9ca3af;
          font-size: 0.875rem;
        }

        /* Responsive styles */
        @media (min-width: 768px) {
          .hero {
            flex-direction: row;
            padding: 6rem 4rem;
          }

          .heroContent {
            text-align: left;
            margin-bottom: 0;
          }

          .heroBtns {
            justify-content: flex-start;
          }

          .footerContent {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }

          .footerLogo {
            flex: 1;
          }

          .footerLinks {
            flex: 2;
          }
        }

        @media (max-width: 767px) {
          .heroContent h1 {
            font-size: 2rem;
          }

          .book {
            width: 60px;
            height: 90px;
          }

          .book-page {
            width: 55px;
            height: 85px;
          }

          .pen {
            width: 8px;
            height: 48px;
          }

          .pen-cap {
            height: 12px;
          }

          .pen-body {
            top: 12px;
            height: 32px;
          }

          .pen-tip {
            height: 4px;
          }

          .floating-element {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}

export default HomePages
