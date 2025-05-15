package com.example.demo.repository;

import com.example.demo.model.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    List<Favorite> findByUserId(String userId);
    Optional<Favorite> findByUserIdAndCourseId(String userId, String courseId);
    void deleteByUserIdAndCourseId(String userId, String courseId);
}