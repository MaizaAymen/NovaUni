package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FavoriteRequest {
    @NotBlank(message = "L'ID de l'utilisateur est obligatoire")
    private String userId;
    
    @NotBlank(message = "L'ID du cours est obligatoire")
    private String courseId;
    
    // Constructeur explicite
    public FavoriteRequest(String userId, String courseId) {
        this.userId = userId;
        this.courseId = courseId;
    }
    
    // Getters explicites
    public String getUserId() {
        return userId;
    }
    
    public String getCourseId() {
        return courseId;
    }
    
    // Setters
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }
}