package com.example.demo.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    /**
     * Configuration de secours pour Redis en mode déconnecté
     */
    @Bean
    @ConditionalOnMissingBean(RedisConnectionFactory.class)
    public RedisConnectionFactory redisConnectionFactory() {
        // Utilisez une implémentation qui ne tente pas vraiment de se connecter
        return new MockRedisConnectionFactory();
    }

    /**
     * Template Redis pour interagir avec le serveur Redis
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }

    /**
     * Classe utilitaire pour simuler une connexion Redis en mode déconnecté
     */
    private static class MockRedisConnectionFactory extends LettuceConnectionFactory {
        public MockRedisConnectionFactory() {
            super(new RedisStandaloneConfiguration("localhost", 6379));
        }
        
        @Override
        public void afterPropertiesSet() {
            // Ne rien faire pour éviter de tenter une connexion Redis
        }
    }
}