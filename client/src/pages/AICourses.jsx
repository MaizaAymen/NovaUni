import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SidebarWithSearch from '../components/SidebarWithSearch.jsx';
import Navbar1 from './navbar.jsx';
import { data } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';

// Main component that combines course listing and book viewer
export default function StudyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseBook, setShowCourseBook] = useState(false);
  const userCategory = localStorage.getItem("speciality");
  const isAdmin = localStorage.getItem("admin") === "true";
  const userId = localStorage.getItem("userId");

  // Debug: log user information
  useEffect(() => {
    console.log('StudyCourses user info:', { 
      userId, 
      userCategory, 
      isAdmin, 
      isLoggedIn: localStorage.getItem("isLoggedIn") 
    });
  }, [userId, userCategory, isAdmin]);

  useEffect(() => {
    fetchCourses();
  }, [userCategory]);

  const fetchCourses = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/courses/')
      .then(res => {
        console.log(res);  
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
        
      })
      .then(data => {
        console.log(data); // Log the fetched data
        // Admin sees all; others see only their category
        const filtered = isAdmin ? data : data.filter(c => c.category === userCategory);
        setCourses(filtered);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseBook(true);
  };

  const handleBackToList = () => {
    setShowCourseBook(false);
  };

  if (loading) return <div style={styles.loadingContainer}>Loading Courses...</div>;
  if (error) return <div style={styles.errorContainer}>Error: {error}</div>;  if (courses.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        {isAdmin && <SidebarWithSearch />}
        <div className="main-content" style={{ flex: 1, padding: '1rem' }}>
          <div style={styles.emptyCourses}>
            <h2>{isAdmin ? 'All Study Courses' : `Study Courses - ${userCategory}`}</h2>
            <p>No courses found{!isAdmin ? ` in category '${userCategory}'` : ''}.</p>
            {isAdmin && (
              <button onClick={() => window.location.href = '/newcourse'} style={styles.generateButton}>
                Generate one now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }  return (
    <>
    <Navbar1 />
    <div style={{ display: 'flex', height: '100vh' }}>
      {isAdmin && <SidebarWithSearch />}
      <div className="main-content" style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        <div style={styles.container}>
          {!showCourseBook ? (
            <CourseList 
              courses={courses} 
              onSelectCourse={handleSelectCourse} 
              onGenerateNew={() => window.location.href = '/newcourse'} 
              userCategory={userCategory}
              isAdmin={isAdmin}
              userId={userId}
            />
          ) : (
            <CourseBookView 
              course={selectedCourse} 
              onBack={handleBackToList}
              userId={userId}
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
}

// Course listing component
function CourseList({ courses, onSelectCourse, onGenerateNew, userCategory, isAdmin, userId }) {
  // Function to prevent click propagation for the favorite button
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div style={styles.courseListContainer}>
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>{isAdmin ? 'All Study Courses' : `Study Courses - ${userCategory}`}</h1>
        {isAdmin && (
          <button onClick={onGenerateNew} style={styles.generateButton}>
            Generate New Course
          </button>
        )}
      </div>

      {courses.length === 0 ? (
        <div style={styles.emptyCourses}>
          <h2>No courses found</h2>
          <p>Start by generating your first course</p>
          {isAdmin && (
            <button onClick={onGenerateNew} style={styles.generateButton}>
              Generate Course
            </button>
          )}
        </div>
      ) : (
        <div style={styles.courseGrid}>
          {courses.map(course => (
            <div key={course._id} style={styles.courseCard} onClick={() => onSelectCourse(course)}>
              <div style={styles.courseCardInner}>
                <div style={styles.courseHeader}>
                  <h3 style={styles.courseTitle}>{course.name}</h3>
                  <div onClick={handleFavoriteClick} style={styles.favoriteButtonContainer}>
                    <FavoriteButton userId={userId} courseId={course._id} size="small" />
                  </div>
                </div>
                <div style={styles.coursePreview}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    children={course.description.substring(0, 50) + '...'} 
                  />
                </div>
                <button style={styles.studyButton}>Study This Course</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

// Book view component for studying a course
function CourseBookView({ course, onBack, userId }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [showTOC, setShowTOC] = useState(false);
  const bookRef = useRef(null);

  // Function to prevent click propagation for the favorite button
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
  };

  // Split content into pages with 5 titles per page
  useEffect(() => {
    if (course?.description) {
      // Split the content by h2 headers
      const content = course.description;
      const sections = content.split(/(?=## )/);
      
      // Group sections into pages (5 sections per page)
      const groupedPages = [];
      for (let i = 0; i < sections.length; i += 5) {
        const pageContent = sections.slice(i, i + 5).join('\n\n');
        groupedPages.push(pageContent.trim());
      }
      
      setPages(groupedPages);
      setCurrentPage(0);
    }
  }, [course]);

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
      animatePageTurn("forward");
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      animatePageTurn("backward");
    }
  };

  const animatePageTurn = (direction) => {
    if (bookRef.current) {
      const animationClass = direction === "forward" ? "flipping" : "flipping-back";
      bookRef.current.classList.add(animationClass);
      setTimeout(() => {
        bookRef.current.classList.remove(animationClass);
      }, 500);
    }
  };

  const toggleTOC = () => {
    setShowTOC(!showTOC);
  };

  return (
    <div style={styles.bookViewContainer}>
      <style>
        {`
          .flipping {
            animation: flipPage 0.5s ease-in-out;
          }
          
          .flipping-back {
            animation: flipPageBack 0.5s ease-in-out;
          }
          
          @keyframes flipPage {
            0% { transform: rotateY(0); }
            50% { transform: rotateY(10deg); }
            100% { transform: rotateY(0); }
          }
          
          @keyframes flipPageBack {
            0% { transform: rotateY(0); }
            50% { transform: rotateY(-10deg); }
            100% { transform: rotateY(0); }
          }
        `}
      </style>      <div style={styles.bookHeader}>
        <button onClick={onBack} style={styles.backButton}>
          ← Back to Courses
        </button>
        <div style={styles.titleContainer}>
          <h2 style={styles.bookTitle}>{course.name}</h2>
          <div onClick={handleFavoriteClick} style={styles.favoriteButtonBookView}>
            <FavoriteButton userId={userId} courseId={course._id} size="medium" />
          </div>
        </div>
        <button onClick={toggleTOC} style={styles.tocButton}>
          {showTOC ? "Hide Contents" : "Table of Contents"}
        </button>
      </div>

      {showTOC && <TableOfContents courseContent={course.description} onSelectSection={(index) => {
        setCurrentPage(index);
        setShowTOC(false);
        animatePageTurn("forward");
      }} />}

      <div style={styles.bookContainer} ref={bookRef}>
        <div style={styles.pageControls}>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            style={{...styles.pageButton, ...(currentPage === 0 ? styles.disabledButton : {})}}
          >
            ←
          </button>
          <span style={styles.pageNumber}>
            Page {currentPage + 1} of {pages.length}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === pages.length - 1}
            style={{...styles.pageButton, ...(currentPage === pages.length - 1 ? styles.disabledButton : {})}}
          >
            →
          </button>
        </div>

        <div style={styles.bookPage}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            children={pages[currentPage] || ""}
            components={{
              h2: ({ node, ...props }) => <h2 style={styles.sectionTitle} {...props} />,
              p: ({ node, ...props }) => <p style={styles.paragraph} {...props} />,
              ul: ({ node, ...props }) => <ul style={styles.list} {...props} />,
              ol: ({ node, ...props }) => <ol style={styles.list} {...props} />,
              li: ({ node, ...props }) => <li style={styles.listItem} {...props} />,
              blockquote: ({ node, ...props }) => <blockquote style={styles.blockquote} {...props} />,
              code: ({ node, ...props }) => <code style={styles.code} {...props} />,
            }}
          />
        </div>
      </div>

      <div style={styles.bookNavigation}>
        <button 
          onClick={goToPrevPage} 
          disabled={currentPage === 0} 
          style={{...styles.navButton, ...(currentPage === 0 ? styles.disabledButton : {})}}
        >
          Previous Page
        </button>
        <button 
          onClick={goToNextPage} 
          disabled={currentPage === pages.length - 1} 
          style={{...styles.navButton, ...(currentPage === pages.length - 1 ? styles.disabledButton : {})}}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

// Table of Contents Component
function TableOfContents({ courseContent, onSelectSection }) {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (courseContent) {
      // Extract all h2 headers from the content
      const regex = /## (.*?)(?=\n|$)/g;
      const matches = [...courseContent.matchAll(regex)];

      const extractedSections = matches.map((match, index) => ({
        title: match[1].trim(),
        index: Math.floor(index / 5), // Calculate which page this section will be on (5 sections per page)
        position: index % 5 // Position within the page
      }));

      setSections(extractedSections);
    }
  }, [courseContent]);

  return (
    <div style={styles.tableOfContents}>
      <h3 style={styles.tocHeading}>Table of Contents</h3>
      <ul style={styles.tocList}>
        {sections.map((section, index) => (
          <li key={index} style={styles.tocItem}>
            <button 
              onClick={() => onSelectSection(section.index)} 
              style={styles.tocButton}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "1.2rem",
    color: "#4b5563",
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "1.2rem",
    color: "#ef4444",
  },
  
  // Course List Styles
  courseListContainer: {
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "1rem",
  },
  mainTitle: {
    fontSize: "2.5rem",
  
    margin: 0,
    fontWeight: 700,
  },
  generateButton: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  emptyCourses: {
    textAlign: "center",
    padding: "4rem 2rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "2rem",
  },
  courseCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },  courseCardInner: {
    padding: "1.5rem",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  courseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem"
  },
  courseTitle: {
    fontSize: "1.5rem",
    color: "#1e40af",
    marginTop: 0,
    marginBottom: 0,
    flex: 1
  },
  favoriteButtonContainer: {
    marginLeft: "10px",
  },
  coursePreview: {
    flex: 1,
    overflow: "hidden",
    marginBottom: "1.5rem",
    color: "#4b5563",
    fontSize: "0.95rem",
  },
  studyButton: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
    width: "100%",
  },
  
  // Book View Styles
  bookViewContainer: {
    width: "100%",
  },  bookHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "1rem",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  favoriteButtonBookView: {
    marginLeft: "15px",
    marginTop: "3px",
  },
  backButton: {
    backgroundColor: "transparent",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  bookTitle: {
    fontSize: "1.8rem",
    color: "#1e40af",
    margin: 0,
    fontWeight: 700,
    textAlign: "center",
    flex: 1,
  },
  tocButton: {
    backgroundColor: "transparent",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tableOfContents: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  tocHeading: {
    fontSize: "1.5rem",
    color: "#1e40af",
    marginTop: 0,
    marginBottom: "1rem",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "0.5rem",
  },
  tocList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    maxHeight: "300px",
    overflowY: "auto",
  },
  tocItem: {
    marginBottom: "0.5rem",
  },
  tocItemButton: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    cursor: "pointer",
    fontSize: "1rem",
    textAlign: "left",
    padding: "0.5rem 0",
    width: "100%",
    transition: "color 0.2s",
  },
  bookContainer: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    overflow: "hidden",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.5s",
    transformStyle: "preserve-3d",
    perspective: "1500px",
  },
  pageControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#1e40af",
    color: "white",
  },
  pageButton: {
    backgroundColor: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    color: "white",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "1.2rem",
    transition: "all 0.2s",
  },
  pageNumber: {
    fontSize: "0.9rem",
  },
  bookPage: {
    backgroundColor: "#fffef0",
    padding: "3rem",
    minHeight: "600px",
    maxHeight: "800px",
    position: "relative",
    overflowY: "auto",
    lineHeight: 1.6,
    fontSize: "1.1rem",
    color: "#333",
    backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.05)",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    color: "#1e40af",
    marginTop: "1.5rem",
    marginBottom: "1.5rem",
    fontFamily: "'Merriweather', 'Georgia', serif",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "0.5rem",
  },
  paragraph: {
    marginBottom: "1.2rem",
    textAlign: "justify",
    textIndent: "2rem",
  },
  list: {
    marginBottom: "1.2rem",
    paddingLeft: "2rem",
  },
  listItem: {
    marginBottom: "0.5rem",
  },
  blockquote: {
    borderLeft: "4px solid #3b82f6",
    paddingLeft: "1rem",
    fontStyle: "italic",
    color: "#4b5563",
    margin: "1.5rem 0",
    backgroundColor: "rgba(219, 234, 254, 0.3)",
    padding: "1rem",
  },
  code: {
    backgroundColor: "#f1f5f9",
    padding: "0.2rem 0.4rem",
    borderRadius: "3px",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.9rem",
  },
  bookNavigation: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1.5rem",
  },
  navButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  disabledButton: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
    opacity: 0.7,
  },
};