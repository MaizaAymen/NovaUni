import { useEffect, useState } from "react";
import "./aymen.css";
import Navbar1 from "./navbar.jsx";
import FavoriteButton from "../components/FavoriteButton";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  
  // Récupérer l'ID utilisateur du localStorage au lieu d'utiliser une valeur fixe
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/courses/");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = () => {
    // Implement filtering logic here
    console.log("Filtering by:", { subject, level, duration });
    // You would typically make a new API call with these filters
  };

  return (
    <div className="container">
      {/* Header */}
      <Navbar1/>

      <main>
        <section className="coursesHeader">
          <h1>Available Courses</h1>
          <p>Browse our comprehensive selection of courses designed to help students excel in their academic journey.</p>
          <div className="courseFilters">
            <select
              className="filterSelect"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              <option value="math">Mathematics</option>
              <option value="english">English</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="computer">Computer Science</option>
            </select>
            <select
              className="filterSelect"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select
              className="filterSelect"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="">All Durations</option>
              <option value="short">8-12 weeks</option>
              <option value="medium">13-16 weeks</option>
              <option value="long">17+ weeks</option>
            </select>
            <button className="searchBtn" onClick={handleSearch}>Search</button>
          </div>
        </section>

        <section className="coursesList">
          {loading ? (
            // Loading state
            Array(6).fill().map((_, index) => (
              <div key={index} className="courseCard" style={{ opacity: 0.7 }}>
                <div className="courseImage">
                  <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "100%" }}></div>
                </div>
                <div className="courseContent">
                  <div style={{ height: "24px", width: "70%", backgroundColor: "#f3f4f6", marginBottom: "12px" }}></div>
                  <div style={{ height: "60px", width: "100%", backgroundColor: "#f3f4f6", marginBottom: "12px" }}></div>
                  <div className="courseDetails">
                    <div className="courseDetail">
                      <span className="detailLabel">Instructor:</span>
                      <div style={{ height: "16px", width: "60%", backgroundColor: "#f3f4f6" }}></div>
                    </div>
                    <div className="courseDetail">
                      <span className="detailLabel">Duration:</span>
                      <div style={{ height: "16px", width: "40%", backgroundColor: "#f3f4f6" }}></div>
                    </div>
                    <div className="courseDetail">
                      <span className="detailLabel">Level:</span>
                      <div style={{ height: "16px", width: "30%", backgroundColor: "#f3f4f6" }}></div>
                    </div>
                  </div>
                  <div className="courseActions">
                    <button className="viewBtn" disabled>View Details</button>
                    <button className="enrollBtn" disabled>Enroll Now</button>
                  </div>
                </div>
              </div>
            ))
          ) : courses.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
              <h3>No courses found</h3>
              <p>Try adjusting your search filters or check back later.</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="courseCard">
                <div className="courseImage">
                  <img
                    src={course.image || "https://placehold.co/400x200/f3f4f6/1e3a8a?text=Course"}
                    alt={course.name}
                  />
                </div>
                <div className="courseContent">
                  <h2>{course.name}</h2>
                  <p>{course.description}</p>
                  <div className="courseDetails">
                    <div className="courseDetail">
                      <span className="detailLabel">Instructor:</span>
                      <span>{course.Instructor || "TBA"}</span>
                    </div>
                    <div className="courseDetail">
                      <span className="detailLabel">Price:</span>
                      <span>${course.price || "0"}</span>
                    </div>
                    <div className="courseDetail">
                      <span className="detailLabel">Level:</span>
                      <span>{course.level || "All Levels"}</span>
                    </div>
                  </div>
                  <div className="courseActions">
                    <button
                      className="viewBtn"
                      onClick={() => {
                        // Handle view details - you could navigate to a details page
                        // or show a modal with course.cours content
                        alert(`Course Content: ${course.cours || "Content details will be available soon."}`);
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="enrollBtn"
                      onClick={() => {
                        // Handle enrollment
                        alert(`Enrolling in: ${course.name}`);
                      }}
                    >
                      Enroll Now
                    </button>
                    <FavoriteButton
                      userId={userId}
                      courseId={course._id}
                      onToggle={(isFavorite) => {
                        console.log(`Course ${course.name} ${isFavorite ? 'added to' : 'removed from'} favorites`);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="pagination">
          <button className="pageBtn">Previous</button>
          <button className="pageBtn activePageBtn">1</button>
          <button className="pageBtn">2</button>
          <button className="pageBtn">3</button>
          <button className="pageBtn">Next</button>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footerContent">
          <div className="footerLogo">
            <img
              src="https://placehold.co/40x40/FFFFFF/2563eb?text=E"
              alt="EduManage Logo"
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
    </div>
  );
}

export default CoursesPage;