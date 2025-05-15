package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "favorites")
public class Favorite implements Serializable {
    
    @Id
    private String id;
    
    private String userId;
    private String courseId;
    private LocalDateTime createdAt;
    
    // Composite key for unique constraint (user-course pair)
    public static String createId(String userId, String courseId) {
        return userId + "_" + courseId;
    }
    
    // Méthodes getter manuelles au cas où Lombok ne fonctionne pas correctement
    public String getId() {
        return id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public String getCourseId() {
        return courseId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    // Méthode builder statique manuelle
    public static FavoriteBuilder builder() {
        return new FavoriteBuilder();
    }
    
    // Classe Builder manuelle
    public static class FavoriteBuilder {
        private String id;
        private String userId;
        private String courseId;
        private LocalDateTime createdAt;
        
        public FavoriteBuilder id(String id) {
            this.id = id;
            return this;
        }
        
        public FavoriteBuilder userId(String userId) {
            this.userId = userId;
            return this;
        }
        
        public FavoriteBuilder courseId(String courseId) {
            this.courseId = courseId;
            return this;
        }
        
        public FavoriteBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public Favorite build() {
            Favorite favorite = new Favorite();
            favorite.id = this.id;
            favorite.userId = this.userId;
            favorite.courseId = this.courseId;
            favorite.createdAt = this.createdAt;
            return favorite;
        }
    }
}