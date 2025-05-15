import React, { useState, useEffect } from 'react';
import FavoriteService from '../services/FavoriteService';
import FavoriteButton from '../components/FavoriteButton';
import { Link } from 'react-router-dom';
import './favorites.css'; // Import des nouveaux styles

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [courseDetails, setCourseDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Utilisateur simulé - dans une vraie application, cela viendrait de l'authentification
  const userId = "user123"; // À remplacer par l'ID réel de l'utilisateur connecté
  
  useEffect(() => {
    loadFavorites();
  }, []);
  
  const loadFavorites = async () => {
    setLoading(true);
    try {
      const response = await FavoriteService.getUserFavorites(userId);
      setFavorites(response.data);
      
      // Après avoir chargé les favoris, chargez les détails des cours
      const courseIds = response.data.map(fav => fav.courseId);
      fetchCourseDetails(courseIds);
    } catch (err) {
      console.error("Erreur lors du chargement des favoris:", err);
      setError("Impossible de charger vos favoris. Veuillez réessayer plus tard.");
      setLoading(false);
    }
  };
  
  // Fonction pour récupérer les détails des cours
  const fetchCourseDetails = async (courseIds) => {
    try {
      // Dans une application réelle, vous feriez un appel API pour obtenir les détails des cours
      // Ici, nous allons créer des données fictives pour la démonstration
      const mockCourseDetails = {};
      
      courseIds.forEach(id => {
        mockCourseDetails[id] = {
          id: id,
          title: `Formation sur ${id}`,
          description: `Description pour la formation ${id}`,
          imageUrl: `https://picsum.photos/seed/${id}/300/200`,
          instructor: "Professeur Demo",
          duration: Math.floor(Math.random() * 10) + 1 + " heures",
          level: ["Débutant", "Intermédiaire", "Avancé"][Math.floor(Math.random() * 3)]
        };
      });
      
      setCourseDetails(mockCourseDetails);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails des cours:", error);
      setLoading(false);
    }
  };
  
  const handleToggleFavorite = (courseId, isFavorite) => {
    if (!isFavorite) {
      // Si un cours est retiré des favoris, mettre à jour la liste immédiatement
      setFavorites(favorites.filter(fav => fav.courseId !== courseId));
    }
  };
  
  if (loading) {
    return <div className="loading">
      <div className="loading-spinner"></div>
      <p>Chargement de vos formations favorites...</p>
    </div>;
  }
  
  if (error) {
    return <div className="error">
      <p>{error}</p>
      <button onClick={loadFavorites} className="retry-btn">Réessayer</button>
    </div>;
  }
  
  return (
    <div className="favorites-page">
      <h1>Mes formations favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>Vous n'avez pas encore de formations favorites.</p>
          <p>Explorez notre catalogue et ajoutez des formations à vos favoris pour les retrouver facilement.</p>
          <Link to="/courses" className="btn">Découvrir des formations</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(favorite => {
            const course = courseDetails[favorite.courseId] || {
              title: favorite.courseId,
              imageUrl: `https://picsum.photos/seed/${favorite.courseId}/300/200`
            };
            
            return (
              <div key={favorite.id} className="favorite-card">
                <div 
                  className="course-thumbnail" 
                  style={{ backgroundImage: `url(${course.imageUrl})` }}
                />
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description?.substring(0, 80)}...</p>
                  
                  <div className="course-metadata">
                    {course.instructor && (
                      <span>
                        <i className="fas fa-user"></i> {course.instructor}
                      </span>
                    )}
                    {course.duration && (
                      <span>
                        <i className="fas fa-clock"></i> {course.duration}
                      </span>
                    )}
                    {course.level && (
                      <span>
                        <i className="fas fa-signal"></i> {course.level}
                      </span>
                    )}
                  </div>
                  
                  <p className="favorite-date">
                    Ajouté le: {new Date(favorite.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="favorite-actions">
                  <Link to={`/courses/${favorite.courseId}`} className="view-course-btn">
                    Voir le cours
                  </Link>
                  <FavoriteButton 
                    userId={userId} 
                    courseId={favorite.courseId} 
                    onToggle={(isFav) => handleToggleFavorite(favorite.courseId, isFav)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;