package com.example.demo;

import com.example.demo.dto.FavoriteRequest;
import com.example.demo.model.Favorite;
import com.example.demo.repository.FavoriteRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class FavoriteControllerIntegrationTests {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0.6");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @BeforeEach
    void setup() {
        favoriteRepository.deleteAll();
    }

    @AfterEach
    void cleanup() {
        favoriteRepository.deleteAll();
    }

    @Test
    void shouldAddFavorite() throws Exception {
        FavoriteRequest request = new FavoriteRequest("user123", "course456");

        mockMvc.perform(post("/api/favorites")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value("user123"))
                .andExpect(jsonPath("$.courseId").value("course456"));
    }

    @Test
    void shouldGetUserFavorites() throws Exception {
        // Given
        Favorite favorite = Favorite.builder()
                .id("user123_course456")
                .userId("user123")
                .courseId("course456")
                .createdAt(LocalDateTime.now())
                .build();
        favoriteRepository.save(favorite);

        // When & Then
        mockMvc.perform(get("/api/favorites/{userId}", "user123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].userId").value("user123"))
                .andExpect(jsonPath("$[0].courseId").value("course456"));
    }

    @Test
    void shouldCheckIfFavoriteExists() throws Exception {
        // Given
        Favorite favorite = Favorite.builder()
                .id("user123_course456")
                .userId("user123")
                .courseId("course456")
                .createdAt(LocalDateTime.now())
                .build();
        favoriteRepository.save(favorite);

        // When & Then
        mockMvc.perform(get("/api/favorites/{userId}/{courseId}", "user123", "course456"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void shouldRemoveFavorite() throws Exception {
        // Given
        Favorite favorite = Favorite.builder()
                .id("user123_course456")
                .userId("user123")
                .courseId("course456")
                .createdAt(LocalDateTime.now())
                .build();
        favoriteRepository.save(favorite);

        // When & Then
        mockMvc.perform(delete("/api/favorites/{userId}/{courseId}", "user123", "course456"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/favorites/{userId}/{courseId}", "user123", "course456"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }
}