package com.example.demo.controller;

import com.example.demo.dto.FavoriteRequest;
import com.example.demo.dto.FavoriteResponse;
import com.example.demo.service.FavoriteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private static final Logger logger = Logger.getLogger(FavoriteController.class.getName());
    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    public ResponseEntity<FavoriteResponse> addFavorite(@Valid @RequestBody FavoriteRequest request) {
        try {
            logger.info("Tentative d'ajout d'un favori: userId=" + request.getUserId() + ", courseId=" + request.getCourseId());
            FavoriteResponse response = favoriteService.addFavorite(request);
            logger.info("Favori ajouté avec succès");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.severe("Erreur lors de l'ajout d'un favori: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserFavorites(@PathVariable String userId) {
        try {
            logger.info("Récupération des favoris pour l'utilisateur: " + userId);
            List<FavoriteResponse> favorites = favoriteService.getUserFavorites(userId);
            logger.info("Nombre de favoris récupérés: " + favorites.size());
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            logger.severe("Erreur lors de la récupération des favoris: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Erreur lors de la récupération des favoris: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/{courseId}")
    public ResponseEntity<?> isFavorite(@PathVariable String userId, @PathVariable String courseId) {
        try {
            logger.info("Vérification si le cours est en favori: userId=" + userId + ", courseId=" + courseId);
            boolean isFavorite = favoriteService.isFavorite(userId, courseId);
            logger.info("Résultat de la vérification: " + isFavorite);
            return ResponseEntity.ok(isFavorite);
        } catch (Exception e) {
            logger.severe("Erreur lors de la vérification du favori: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Erreur lors de la vérification du favori: " + e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/{courseId}")
    public ResponseEntity<?> removeFavorite(@PathVariable String userId, @PathVariable String courseId) {
        try {
            logger.info("Tentative de suppression d'un favori: userId=" + userId + ", courseId=" + courseId);
            favoriteService.removeFavorite(userId, courseId);
            logger.info("Favori supprimé avec succès");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.severe("Erreur lors de la suppression du favori: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Erreur lors de la suppression du favori: " + e.getMessage());
        }
    }
}