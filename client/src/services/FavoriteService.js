import axios from 'axios';

const API_URL = 'http://localhost:8081/api/favorites';

class FavoriteService {
  /**
   * Ajoute un cours aux favoris
   */
  addFavorite(userId, courseId) {
    return axios.post(API_URL, { userId, courseId });
  }

  /**
   * Récupère tous les favoris d'un utilisateur
   */
  getUserFavorites(userId) {
    return axios.get(`${API_URL}/${userId}`);
  }

  /**
   * Vérifie si un cours est dans les favoris d'un utilisateur
   */
  isFavorite(userId, courseId) {
    return axios.get(`${API_URL}/${userId}/${courseId}`);
  }

  /**
   * Supprime un cours des favoris d'un utilisateur
   */
  removeFavorite(userId, courseId) {
    return axios.delete(`${API_URL}/${userId}/${courseId}`);
  }
}

export default new FavoriteService();