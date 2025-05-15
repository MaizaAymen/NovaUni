import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import './CourseCard.css'; // Import du fichier CSS

const CourseCard = ({ course, userId, onToggleFavorite }) => {
  return (
    <div className="course-card">
      <div className="course-favorite-button">
        <FavoriteButton 
          userId={userId} 
          courseId={course.id} 
          onToggle={(isFavorite) => onToggleFavorite && onToggleFavorite(course.id, isFavorite)}
        />
      </div>

      <div 
        className="course-thumbnail" 
        style={{ backgroundImage: `url(${course.imageUrl || 'https://picsum.photos/300/200'})` }}
      />
      
      <div className="course-content">
        <h3>{course.title}</h3>
        <p className="course-description">{course.description?.substring(0, 100)}...</p>
        
        <div className="course-details">
          {course.instructor && (
            <div className="course-detail">
              <span className="detail-label">Instructeur:</span>
              <span className="detail-value">{course.instructor}</span>
            </div>
          )}
          
          {course.duration && (
            <div className="course-detail">
              <span className="detail-label">Durée:</span>
              <span className="detail-value">{course.duration}</span>
            </div>
          )}
          
          {course.level && (
            <div className="course-detail">
              <span className="detail-label">Niveau:</span>
              <span className="detail-value">{course.level}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="course-footer">
        <Link to={`/courses/${course.id}`} className="view-course-btn">
          Voir le cours
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;