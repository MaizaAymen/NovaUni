import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

// Main Course Book Component
export default function NewCourse() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [showTOC, setShowTOC] = useState(false);
  const bookRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category) {
      setError("Please enter a title and select a category.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/courses/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category }),
      });
      if (!res.ok) throw new Error("Failed to generate course");
      const data = await res.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const handleSelectSection = (pageIndex) => {
    setCurrentPage(pageIndex);
    setShowTOC(false);
    animatePageTurn("forward");
  };

  const toggleTOC = () => {
    setShowTOC(!showTOC);
  };

  return (
    <div style={styles.container}>
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
      </style>

      <div style={styles.formContainer}>
        <h2 style={styles.formHeading}>AI Course Generator</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course Title"
            required
            style={styles.input}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">Select category</option>
            <option value="informatique">Informatique</option>
            <option value="gestion">Gestion</option>
            <option value="prepa">Prepa</option>
            <option value="english">English</option>
          </select>
          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? "Generating..." : "Generate Course"}
          </button>
        </form>
        {error && <div style={styles.error}>Error: {error}</div>}
      </div>

      {course && (
        <div style={styles.bookContainer}>
          <h3 style={styles.bookTitle}>{course.name}</h3>

          <div style={styles.bookControls}>
            <button onClick={toggleTOC} style={styles.tocToggleButton}>
              {showTOC ? "Hide Contents" : "Show Contents"}
            </button>
          </div>

          {showTOC && <TableOfContents courseContent={course.description} onSelectSection={handleSelectSection} />}

          <div style={styles.book} ref={bookRef}>
            <div style={styles.pageControls}>
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                style={{...styles.pageButton, ...(currentPage === 0 ? styles.disabledButton : {})}}
                aria-label="Previous page"
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
                aria-label="Next page"
              >
                →
              </button>
            </div>

            <div style={styles.bookPage}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                children={pages[currentPage] || ""}
                components={{
                  h2: ({ node, ...props }) => <h2 style={styles.pageTitle} {...props} />,
                  p: ({ node, ...props }) => <p style={styles.pageParagraph} {...props} />,
                  ul: ({ node, ...props }) => <ul style={styles.pageList} {...props} />,
                  ol: ({ node, ...props }) => <ol style={styles.pageList} {...props} />,
                  li: ({ node, ...props }) => <li style={styles.pageListItem} {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote style={styles.pageQuote} {...props} />,
                  code: ({ node, ...props }) => <code style={styles.pageCode} {...props} />,
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

          <p style={styles.bookFooter}>Course ID: {course._id}</p>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "Georgia, serif",
  },
  formContainer: {
    marginBottom: "2rem",
    backgroundColor: "#f8f9fa",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  formHeading: {
    marginTop: 0,
    color: "#2c3e50",
    fontSize: "1.8rem",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  submitButton: {
    backgroundColor: "#4a5568",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "background-color 0.2s",
  },
  error: {
    color: "#e53e3e",
    marginTop: "10px",
    fontSize: "0.9rem",
  },
  bookContainer: {
    marginTop: "2rem",
  },
  bookTitle: {
    textAlign: "center",
    fontSize: "2rem",
    color: "#2c3e50",
    marginBottom: "1.5rem",
    fontWeight: 700,
  },
  bookControls: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  tocToggleButton: {
    backgroundColor: "#4a5568",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s",
  },
  book: {
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    padding: 0,
    position: "relative",
    maxWidth: "800px",
    margin: "0 auto",
    transition: "transform 0.5s",
    transformStyle: "preserve-3d",
    perspective: "1500px",
  },
  pageControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#2c3e50",
    color: "white",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
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
    borderRadius: "5px",
    position: "relative",
    overflowY: "auto",
    lineHeight: 1.6,
    fontSize: "1.1rem",
    color: "#333",
    backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.05)",
  },
  pageTitle: {
    fontSize: "1.8rem",
    color: "#2c3e50",
    marginTop: "1.5rem",
    marginBottom: "1.5rem",
    fontFamily: "Garamond, serif",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "0.5rem",
  },
  pageParagraph: {
    marginBottom: "1.2rem",
    textAlign: "justify",
    textIndent: "2rem",
  },
  pageList: {
    marginBottom: "1.2rem",
    paddingLeft: "2rem",
  },
  pageListItem: {
    marginBottom: "0.5rem",
  },
  pageQuote: {
    borderLeft: "4px solid #718096",
    paddingLeft: "1rem",
    fontStyle: "italic",
    color: "#4a5568",
    margin: "1.5rem 0",
  },
  pageCode: {
    backgroundColor: "#f7fafc",
    padding: "0.2rem 0.4rem",
    borderRadius: "3px",
    fontFamily: "Courier New, monospace",
    fontSize: "0.9rem",
  },
  bookNavigation: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "800px",
    margin: "1rem auto",
  },
  navButton: {
    backgroundColor: "#4a5568",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s",
  },
  disabledButton: {
    backgroundColor: "#a0aec0",
    cursor: "not-allowed",
    opacity: 0.5,
  },
  bookFooter: {
    textAlign: "center",
    marginTop: "1rem",
    fontStyle: "italic",
    color: "#718096",
    fontSize: "0.9rem",
  },
  tableOfContents: {
    maxWidth: "800px",
    margin: "0 auto 1.5rem",
    padding: "1.5rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  tocHeading: {
    marginTop: 0,
    color: "#2c3e50",
    fontSize: "1.4rem",
    marginBottom: "1rem",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "0.5rem",
  },
  tocList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  tocItem: {
    marginBottom: "0.5rem",
  },
  tocButton: {
    background: "none",
    border: "none",
    color: "#3182ce",
    cursor: "pointer",
    fontSize: "1rem",
    textAlign: "left",
    padding: "0.3rem 0",
    width: "100%",
    transition: "color 0.2s",
  },
};