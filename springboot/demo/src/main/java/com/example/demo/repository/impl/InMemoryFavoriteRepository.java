package com.example.demo.repository.impl;

import com.example.demo.model.Favorite;
import com.example.demo.repository.FavoriteRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Implémentation en mémoire du FavoriteRepository à utiliser lorsque MongoDB n'est pas disponible
 * Active uniquement si la propriété "app.use-in-memory-db" est définie sur "true"
 */
@Repository
@Primary
@ConditionalOnProperty(name = "app.use-in-memory-db", havingValue = "true")
public class InMemoryFavoriteRepository implements FavoriteRepository {

    private final Map<String, Favorite> favorites = new ConcurrentHashMap<>();

    @Override
    public List<Favorite> findByUserId(String userId) {
        return favorites.values().stream()
                .filter(favorite -> favorite.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Favorite> findByUserIdAndCourseId(String userId, String courseId) {
        String id = Favorite.createId(userId, courseId);
        return Optional.ofNullable(favorites.get(id));
    }

    @Override
    public void deleteByUserIdAndCourseId(String userId, String courseId) {
        String id = Favorite.createId(userId, courseId);
        favorites.remove(id);
    }

    @Override
    public <S extends Favorite> S save(S entity) {
        // Si l'ID est null, créer un ID basé sur userId et courseId
        if (entity.getId() == null) {
            // Utiliser la réflexion pour définir l'ID car nous n'avons pas de méthode setId
            try {
                java.lang.reflect.Field idField = Favorite.class.getDeclaredField("id");
                idField.setAccessible(true);
                idField.set(entity, Favorite.createId(entity.getUserId(), entity.getCourseId()));
            } catch (Exception e) {
                throw new RuntimeException("Impossible de définir l'ID pour le favori", e);
            }
        }
        favorites.put(entity.getId(), entity);
        return entity;
    }

    @Override
    public <S extends Favorite> List<S> saveAll(Iterable<S> entities) {
        List<S> result = new ArrayList<>();
        entities.forEach(entity -> result.add(save(entity)));
        return result;
    }

    @Override
    public Optional<Favorite> findById(String s) {
        return Optional.ofNullable(favorites.get(s));
    }

    @Override
    public boolean existsById(String s) {
        return favorites.containsKey(s);
    }

    @Override
    public List<Favorite> findAll() {
        return new ArrayList<>(favorites.values());
    }

    @Override
    public List<Favorite> findAllById(Iterable<String> strings) {
        List<Favorite> result = new ArrayList<>();
        strings.forEach(id -> {
            Favorite favorite = favorites.get(id);
            if (favorite != null) {
                result.add(favorite);
            }
        });
        return result;
    }

    @Override
    public long count() {
        return favorites.size();
    }

    @Override
    public void deleteById(String s) {
        favorites.remove(s);
    }

    @Override
    public void delete(Favorite entity) {
        favorites.remove(entity.getId());
    }

    @Override
    public void deleteAllById(Iterable<? extends String> strings) {
        strings.forEach(this::deleteById);
    }

    @Override
    public void deleteAll(Iterable<? extends Favorite> entities) {
        entities.forEach(this::delete);
    }

    @Override
    public void deleteAll() {
        favorites.clear();
    }

    @Override
    public List<Favorite> findAll(Sort sort) {
        // Méthode simplifiée, pas de tri en mémoire
        return findAll();
    }

    @Override
    public Page<Favorite> findAll(Pageable pageable) {
        // Non implémenté pour cet exemple, à implémenter si nécessaire
        throw new UnsupportedOperationException("Pagination non prise en charge dans l'implémentation en mémoire");
    }

    @Override
    public <S extends Favorite> S insert(S entity) {
        return save(entity);
    }

    @Override
    public <S extends Favorite> List<S> insert(Iterable<S> entities) {
        return saveAll(entities);
    }

    @Override
    public <S extends Favorite> Optional<S> findOne(Example<S> example) {
        // Non implémenté pour cet exemple
        throw new UnsupportedOperationException("findOne avec Example non implémenté");
    }

    @Override
    public <S extends Favorite> List<S> findAll(Example<S> example) {
        // Non implémenté pour cet exemple
        throw new UnsupportedOperationException("findAll avec Example non implémenté");
    }

    @Override
    public <S extends Favorite> List<S> findAll(Example<S> example, Sort sort) {
        // Non implémenté pour cet exemple
        throw new UnsupportedOperationException("findAll avec Example et Sort non implémenté");
    }

    @Override
    public <S extends Favorite> Page<S> findAll(Example<S> example, Pageable pageable) {
        // Non implémenté pour cet exemple
        throw new UnsupportedOperationException("findAll avec Example et Pageable non implémenté");
    }

    @Override
    public <S extends Favorite> long count(Example<S> example) {
        // Non implémenté pour cet exemple
        throw new UnsupportedOperationException("count avec Example non implémenté");
    }

    @Override
    public <S extends Favorite> boolean exists(Example<S> example) {
        // Non implémenté pour cet exemple
        throw new UnsupportedOperationException("exists avec Example non implémenté");
    }

    @Override
    public <S extends Favorite, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        // Non implémenté pour cet exemple
        throw new UnsupportedOperationException("findBy avec Example et Function non implémenté");
    }
}