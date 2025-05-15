package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteResponse {
    private String id;
    private String userId;
    private String courseId;
    private LocalDateTime createdAt;
    
    // Getters explicites
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
    public static FavoriteResponseBuilder builder() {
        return new FavoriteResponseBuilder();
    }
    
    // Classe Builder manuelle
    public static class FavoriteResponseBuilder {
        private String id;
        private String userId;
        private String courseId;
        private LocalDateTime createdAt;
        
        public FavoriteResponseBuilder id(String id) {
            this.id = id;
            return this;
        }
        
        public FavoriteResponseBuilder userId(String userId) {
            this.userId = userId;
            return this;
        }
        
        public FavoriteResponseBuilder courseId(String courseId) {
            this.courseId = courseId;
            return this;
        }
        
        public FavoriteResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public FavoriteResponse build() {
            FavoriteResponse response = new FavoriteResponse();
            response.id = this.id;
            response.userId = this.userId;
            response.courseId = this.courseId;
            response.createdAt = this.createdAt;
            return response;
        }
    }
}