import React, { useState, useEffect } from 'react';
import FavoriteService from '../services/FavoriteService';
import './FavoriteButton.css';

const FavoriteButton = ({ userId, courseId, onToggle, size = 'medium' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  // Vérification de l'état de connexion directement à partir de localStorage
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  // Debug: log props values when component mounts
  useEffect(() => {
    console.log('FavoriteButton props:', { userId, courseId, size });
  }, []);
  useEffect(() => {
    // Vérifier l'état de connexion
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsUserLoggedIn(loggedInStatus);
    
    // Vérifier si le cours est déjà en favoris au chargement
    if (userId && courseId && loggedInStatus) {
      setIsLoading(true);
      FavoriteService.isFavorite(userId, courseId)
        .then(response => {
          setIsFavorite(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la vérification du favori:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!userId && loggedInStatus) {
      // Tentative de récupération du userId depuis localStorage
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId && courseId) {
        console.log("Récupération du userId depuis localStorage dans useEffect:", storedUserId);
        setIsLoading(true);
        FavoriteService.isFavorite(storedUserId, courseId)
          .then(response => {
            setIsFavorite(response.data);
          })
          .catch(error => {
            console.error('Erreur lors de la vérification du favori:', error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [userId, courseId]);

  // Fonction pour afficher un toast avec un message
  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Le toast disparaît après 3 secondes
  };
  const toggleFavorite = () => {
    // Debug: log values when toggling
    console.log('toggleFavorite called with:', { userId, courseId, isUserLoggedIn });
    
    // Vérification de l'état de connexion à partir du state local
    if (!isUserLoggedIn) {
      displayToast("Veuillez vous connecter pour ajouter des favoris");
      return;
    }
    
    // Si l'utilisateur est connecté mais qu'il manque userId ou courseId,
    // c'est un problème technique et non un problème d'authentification
    if (!userId || !courseId) {
      displayToast("Erreur technique: Impossible d'identifier le cours ou l'utilisateur");
      console.error("Erreur technique: userId ou courseId manquant malgré l'état connecté", { userId, courseId });
      
      // Tentative de récupération directe depuis localStorage
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId && !userId && courseId) {
        console.log("Tentative de récupération du userId depuis localStorage:", storedUserId);
        // Continuer avec le userId récupéré
        handleFavoriteAction(storedUserId, courseId);
        return;
      }
      
      return;
    }    if (isLoading) return; // Éviter les clics multiples
    
    // Utiliser les valeurs de props
    handleFavoriteAction(userId, courseId);
  };
  
  // Helper function to handle the favorite action
  const handleFavoriteAction = (userIdToUse, courseIdToUse) => {
    setIsLoading(true);
    setIsAnimating(true);
    
    if (isFavorite) {
      // Supprimer des favoris
      FavoriteService.removeFavorite(userIdToUse, courseIdToUse)
        .then(() => {
          setIsFavorite(false);
          if (onToggle) onToggle(false);
          displayToast("Cours retiré des favoris");
        })
        .catch(error => {
          console.error('Erreur lors de la suppression du favori:', error);
          displayToast('Une erreur est survenue lors de la suppression du favori');
        })
        .finally(() => {
          setIsLoading(false);
          setTimeout(() => setIsAnimating(false), 300); // Laisser l'animation se terminer
        });
    } else {
      // Ajouter aux favoris
      FavoriteService.addFavorite(userIdToUse, courseIdToUse)
        .then(() => {
          setIsFavorite(true);
          if (onToggle) onToggle(true);
          displayToast("Cours ajouté aux favoris");
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout du favori:', error);
          displayToast('Une erreur est survenue lors de l\'ajout du favori');
        })
        .finally(() => {
          setIsLoading(false);
          setTimeout(() => setIsAnimating(false), 300); // Laisser l'animation se terminer
        });
    }
  };

  // Déterminer les classes basées sur l'état
  const buttonClasses = `
    favorite-button 
    ${isFavorite ? 'is-favorite' : ''} 
    ${isLoading ? 'is-loading' : ''} 
    ${isAnimating ? 'is-animating' : ''}
    favorite-button--${size}
  `;

  return (
    <>
      <button 
        onClick={toggleFavorite}
        disabled={isLoading}
        className={buttonClasses}
        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <span className="favorite-icon">
          {isLoading ? (
            <span className="loading-indicator"></span>
          ) : (
            <>
              <span className="icon-heart-empty"></span>
              <span className="icon-heart-filled"></span>
            </>
          )}
        </span>
      </button>
      
      {/* Toast pour les notifications */}
      {showToast && (
        <div className="favorite-toast">
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default FavoriteButton;