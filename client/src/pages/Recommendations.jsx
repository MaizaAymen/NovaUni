import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/navbar';
import Navbar1 from "../pages/navbar.jsx";
export default function BookRecommendations() {
  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      color: '#1f2937',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem',
    },
    header: {
      marginBottom: '2rem',
      textAlign: 'center',
    },
    headerIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem',
    },
    headerTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 0 0.5rem',
    },
    headerDescription: {
      maxWidth: '600px',
      margin: '0 auto',
      color: '#6b7280',
    },
    filterCard: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      border: '1px solid #d1fae5',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '2rem',
      overflow: 'hidden',
    },
    filterForm: {
      padding: '1.5rem',
    },
    filterHeader: {
      display: 'flex',
      alignItems: 'center',
      color: '#10b981',
      marginBottom: '1rem',
    },
    filterTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginLeft: '0.5rem',
    },
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    filterField: {
      display: 'flex',
      flexDirection: 'column',
    },
    filterLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      color: '#1f2937',
    },
    filterInput: {
      padding: '0.5rem 0.75rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      transition: 'border-color 0.2s',
    },
    filterActions: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    searchButton: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.5rem 1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    booksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    bookCard: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      cursor: 'pointer',
    },
    bookCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    bookImageContainer: {
      position: 'relative',
      paddingTop: '56.25%',
      backgroundColor: '#f3f4f6',
    },
    bookImage: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    bookImagePlaceholder: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bookContent: {
      padding: '1rem',
      flexGrow: '1',
    },
    bookTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      display: '-webkit-box',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    bookDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    bookCategory: {
      display: 'inline-block',
      backgroundColor: '#d1fae5',
      color: '#059669',
      fontSize: '0.75rem',
      fontWeight: '500',
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      alignSelf: 'flex-start',
    },
    bookPrice: {
      fontWeight: '500',
      color: '#1f2937',
    },
    bookAvailability: {
      fontSize: '0.875rem',
    },
    bookAvailabilityInStock: {
      color: '#10b981',
    },
    bookAvailabilityOutStock: {
      color: '#f59e0b',
    },
    viewDetailsBtn: {
      width: '100%',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      padding: '0.75rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    bookDetail: {
      animation: 'fadeIn 0.3s ease-in-out',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      color: '#10b981',
      fontWeight: '500',
      padding: '0.5rem',
      marginBottom: '1.5rem',
      cursor: 'pointer',
      transition: 'color 0.2s',
    },
    bookDetailCard: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
    },
    bookDetailGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
      padding: '1.5rem',
    },
    bookDetailImageContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    bookDetailImage: {
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
    },
    bookDetailImagePlaceholder: {
      aspectRatio: '3/4',
      backgroundColor: '#f3f4f6',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem',
    },
    bookDetailInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    bookDetailInfoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bookDetailLabel: {
      color: '#6b7280',
    },
    bookDetailValue: {
      fontWeight: '600',
    },
    bookDetailCategory: {
      display: 'inline-block',
      backgroundColor: '#d1fae5',
      color: '#059669',
      fontSize: '0.75rem',
      fontWeight: '500',
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      border: '1px solid rgba(16, 185, 129, 0.2)',
    },
    bookDetailAvailability: {
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    bookDetailContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    bookDetailTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1f2937',
    },
    bookSummaryContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    bookSummaryTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#10b981',
    },
    bookSummaryContent: {
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
    },
    bookSummaryLoading: {
      backgroundColor: '#f3f4f6',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      textAlign: 'center',
      color: '#6b7280',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '5rem 0',
    },
    loadingSpinner: {
      animation: 'spin 1s linear infinite',
      color: '#10b981',
    },
    loadingText: {
      marginLeft: '0.5rem',
      color: '#6b7280',
    },
    errorAlert: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1.5rem',
      color: '#b91c1c',
    },
    noBooksMessage: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '2.5rem 0',
      color: '#6b7280',
    },
    '@media (min-width: 768px)': {
      bookDetailGrid: {
        gridTemplateColumns: '1fr 2fr',
      },
    },
  };

  // State
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [summary, setSummary] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Functions
  const fetchBooks = () => {
    setLoading(true);
    setError(null);
    let url = 'http://127.0.0.1:8000/recommendations';
    const params = [];
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (priceMin) params.push(`price_min=${priceMin}`);
    if (priceMax) params.push(`price_max=${priceMax}`);
    if (params.length) url += `?${params.join('&')}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch recommendations');
        return res.json();
      })
      .then(data => setBooks(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const fetchSummary = (title) => {
    setLoading(true);
    setError(null);
    fetch(`http://127.0.0.1:8000/books/summary?title=${encodeURIComponent(title)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch summary');
        return res.json();
      })
      .then(data => setSummary(data.summary))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setSelectedBook(null);
    fetchBooks();
  };

  const handleSelect = (book) => {
    setSelectedBook(book);
    fetchSummary(book.title);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Book Card Component
  const BookCard = ({ book, onSelect }) => (
    <div 
      style={{
        ...styles.bookCard,
        ...(hoveredCard === book._id ? styles.bookCardHover : {})
      }} 
      onClick={onSelect}
      onMouseEnter={() => setHoveredCard(book._id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div style={styles.bookImageContainer}>
        {book.image_url ? (
          <img src={book.image_url || "/placeholder.svg"} alt={book.title} style={styles.bookImage} />
        ) : (
          <div style={styles.bookImagePlaceholder}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
        )}
      </div>
      <div style={styles.bookContent}>
        <h3 style={styles.bookTitle}>{book.title}</h3>
        <div style={styles.bookDetails}>
          <span style={styles.bookCategory}>{book.category}</span>
          <p style={styles.bookPrice}>£{book.price}</p>
          <p style={{
            ...styles.bookAvailability,
            ...(book.availability.toLowerCase().includes('in stock') ? styles.bookAvailabilityInStock : styles.bookAvailabilityOutStock)
          }}>
            {book.availability}
          </p>
        </div>
      </div>
      <button style={{
        ...styles.viewDetailsBtn,
        backgroundColor: hoveredCard === book._id ? '#059669' : '#10b981'
      }}>
        View Details
      </button>
    </div>
  );

  // Book Detail Component
  const BookDetail = ({ book, summary, onBack }) => {
    // Use window.innerWidth to determine if we're on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    return (
      <>
      <Navbar1/>
      <div style={styles.bookDetail}>
        <button onClick={onBack} style={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          Back to all books
        </button>

        <div style={styles.bookDetailCard}>
          <div style={{
            ...styles.bookDetailGrid,
            gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr'
          }}>
            <div style={styles.bookDetailImageContainer}>
              {book.image_url ? (
                <img src={book.image_url || "/placeholder.svg"} alt={book.title} style={styles.bookDetailImage} />
              ) : (
                <div style={styles.bookDetailImagePlaceholder}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
              )}

              <div style={styles.bookDetailInfo}>
                <div style={styles.bookDetailInfoRow}>
                  <span style={styles.bookDetailLabel}>Price:</span>
                  <span style={styles.bookDetailValue}>£{book.price}</span>
                </div>

                <div style={styles.bookDetailInfoRow}>
                  <span style={styles.bookDetailLabel}>Category:</span>
                  <span style={styles.bookDetailCategory}>{book.category}</span>
                </div>

                <div style={styles.bookDetailInfoRow}>
                  <span style={styles.bookDetailLabel}>Status:</span>
                  <span style={{
                    ...styles.bookDetailAvailability,
                    ...(book.availability.toLowerCase().includes('in stock') ? styles.bookAvailabilityInStock : styles.bookAvailabilityOutStock)
                  }}>
                    {book.availability}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.bookDetailContent}>
              <h2 style={styles.bookDetailTitle}>{book.title}</h2>

              <div style={styles.bookSummaryContainer}>
                <h3 style={styles.bookSummaryTitle}>Summary</h3>
                {summary ? (
                  <div style={styles.bookSummaryContent}>
                    <p>{summary}</p>
                  </div>
                ) : (
                  <div style={styles.bookSummaryLoading}>
                    <p>Loading summary...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  };

  // Filter Form Component
  const FilterForm = () => (
    <div style={styles.filterCard}>
      <form onSubmit={handleFilter} style={styles.filterForm}>
        <div style={styles.filterHeader}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <h2 style={styles.filterTitle}>Filter Resources</h2>
        </div>

        <div style={styles.filterGrid}>
          <div style={styles.filterField}>
            <label htmlFor="category" style={styles.filterLabel}>
              Subject/Category
            </label>
            <input
              id="category"
              placeholder="e.g. Mathematics, Science"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.filterInput}
            />
          </div>

          <div style={styles.filterField}>
            <label htmlFor="priceMin" style={styles.filterLabel}>
              Minimum Price (£)
            </label>
            <input
              id="priceMin"
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              style={styles.filterInput}
            />
          </div>

          <div style={styles.filterField}>
            <label htmlFor="priceMax" style={styles.filterLabel}>
              Maximum Price (£)
            </label>
            <input
              id="priceMax"
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              style={styles.filterInput}
            />
          </div>
        </div>

        <div style={styles.filterActions}>
          <button type="submit" style={styles.searchButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Search Books
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <header style={styles.header}>
          <div style={styles.headerIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <h1 style={styles.headerTitle}>Educational Book Recommendations</h1>
          </div>
          <p style={styles.headerDescription}>
            Discover the perfect books to enhance your learning journey. Filter by category and price to find your next
            educational resource.
          </p>
        </header>

        <FilterForm />

        {error && (
          <div style={styles.errorAlert}>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div style={styles.loadingContainer}>
            <svg style={styles.loadingSpinner} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span style={styles.loadingText}>Loading resources...</span>
          </div>
        ) : (
          <>
            {!selectedBook ? (
              <div style={styles.booksGrid}>
                {books.length > 0 ? (
                  books.map((book) => <BookCard key={book._id} book={book} onSelect={() => handleSelect(book)} />)
                ) : (
                  <div style={styles.noBooksMessage}>
                    <p>No books found matching your criteria. Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            ) : (
              <BookDetail book={selectedBook} summary={summary} onBack={() => setSelectedBook(null)} />
            )}
          </>
        )}
      </div>
      
      {/* Add keyframe animations via style tag */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}