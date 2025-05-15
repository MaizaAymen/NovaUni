package com.example.demo;

import com.example.demo.dto.FavoriteRequest;
import com.example.demo.dto.FavoriteResponse;
import com.example.demo.model.Favorite;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.service.FavoriteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FavoriteServiceTests {

    @Mock
    private FavoriteRepository favoriteRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    private Favorite testFavorite;
    private FavoriteRequest testRequest;

    @BeforeEach
    void setUp() {
        // Configuration des données de test
        testFavorite = Favorite.builder()
                .id("user123_course456")
                .userId("user123")
                .courseId("course456")
                .createdAt(LocalDateTime.now())
                .build();

        testRequest = new FavoriteRequest("user123", "course456");
    }

    @Test
    void shouldAddFavorite() {
        // Given
        when(favoriteRepository.save(any(Favorite.class))).thenReturn(testFavorite);

        // When
        FavoriteResponse response = favoriteService.addFavorite(testRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo(testFavorite.getUserId());
        assertThat(response.getCourseId()).isEqualTo(testFavorite.getCourseId());
        verify(favoriteRepository, times(1)).save(any(Favorite.class));
    }

    @Test
    void shouldGetUserFavorites() {
        // Given
        when(favoriteRepository.findByUserId("user123")).thenReturn(Arrays.asList(testFavorite));

        // When
        List<FavoriteResponse> favorites = favoriteService.getUserFavorites("user123");

        // Then
        assertThat(favorites).isNotNull();
        assertThat(favorites).hasSize(1);
        assertThat(favorites.get(0).getUserId()).isEqualTo("user123");
        verify(favoriteRepository, times(1)).findByUserId("user123");
    }

    @Test
    void shouldCheckIfFavoriteExists() {
        // Given
        when(favoriteRepository.findByUserIdAndCourseId("user123", "course456"))
                .thenReturn(Optional.of(testFavorite));

        // When
        boolean result = favoriteService.isFavorite("user123", "course456");

        // Then
        assertThat(result).isTrue();
        verify(favoriteRepository, times(1)).findByUserIdAndCourseId("user123", "course456");
    }

    @Test
    void shouldRemoveFavorite() {
        // Given
        doNothing().when(favoriteRepository).deleteByUserIdAndCourseId("user123", "course456");

        // When
        favoriteService.removeFavorite("user123", "course456");

        // Then
        verify(favoriteRepository, times(1)).deleteByUserIdAndCourseId("user123", "course456");
    }
}