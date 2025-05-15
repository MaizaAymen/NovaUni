package com.example.demo.service;

import com.example.demo.dto.FavoriteRequest;
import com.example.demo.dto.FavoriteResponse;
import com.example.demo.model.Favorite;
import com.example.demo.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    @Autowired
    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    /**
     * Ajoute un cours aux favoris d'un utilisateur
     */
    // Désactivé temporairement pour éviter les erreurs Redis
    // @CacheEvict(value = "userFavorites", key = "#request.userId")
    public FavoriteResponse addFavorite(FavoriteRequest request) {
        String id = Favorite.createId(request.getUserId(), request.getCourseId());
        
        Favorite favorite = Favorite.builder()
                .id(id)
                .userId(request.getUserId())
                .courseId(request.getCourseId())
                .createdAt(LocalDateTime.now())
                .build();
        
        favorite = favoriteRepository.save(favorite);
        
        return mapToResponse(favorite);
    }

    /**
     * Récupère tous les favoris d'un utilisateur avec mise en cache Redis
     */
    // Désactivé temporairement pour éviter les erreurs Redis
    // @Cacheable(value = "userFavorites", key = "#userId")
    public List<FavoriteResponse> getUserFavorites(String userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        
        return favorites.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Vérifie si un cours est dans les favoris d'un utilisateur
     */
    public boolean isFavorite(String userId, String courseId) {
        return favoriteRepository.findByUserIdAndCourseId(userId, courseId).isPresent();
    }

    /**
     * Supprime un cours des favoris d'un utilisateur
     */
    // Désactivé temporairement pour éviter les erreurs Redis
    // @CacheEvict(value = "userFavorites", key = "#userId")
    public void removeFavorite(String userId, String courseId) {
        favoriteRepository.deleteByUserIdAndCourseId(userId, courseId);
    }

    /**
     * Convertit une entité Favorite en DTO FavoriteResponse
     */
    private FavoriteResponse mapToResponse(Favorite favorite) {
        return FavoriteResponse.builder()
                .id(favorite.getId())
                .userId(favorite.getUserId())
                .courseId(favorite.getCourseId())
                .createdAt(favorite.getCreatedAt())
                .build();
    }
}