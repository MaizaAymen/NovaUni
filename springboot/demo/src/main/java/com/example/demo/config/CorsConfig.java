package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permettre les requêtes depuis le frontend React
        config.addAllowedOrigin("http://localhost:5173");
        
        // Permettre les requêtes depuis l'environnement de développement React
        config.addAllowedOrigin("http://127.0.0.1:5173");
        
        // Permettre tous les headers
        config.addAllowedHeader("*");
        
        // Permettre tous les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
        config.addAllowedMethod("*");
        
        // Permettre l'envoi de cookies (important pour l'authentification)
        config.setAllowCredentials(true);
        
        // Appliquer cette configuration à tous les endpoints
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}