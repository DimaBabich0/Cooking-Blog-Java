package com.cb.backend.repository;

import com.cb.backend.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for <b>Recipe</b> entities.
 *
 * <p>
 * Extends {@link JpaRepository} to provide CRUD operations and
 * pagination for {@link Recipe} objects.
 * </p>
 *
 * <p>
 * Spring will automatically implement this interface at runtime.
 * </p>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    @Query("SELECT r FROM Recipe r LEFT JOIN FETCH r.categories LEFT JOIN FETCH r.user")
    List<Recipe> findAllWithCategories();

           @Query("SELECT r FROM Recipe r LEFT JOIN FETCH r.categories LEFT JOIN FETCH r.user WHERE r.id = :id")
           Optional<Recipe> findByIdWithCategories(Long id);
           
           @Query("SELECT r FROM Recipe r LEFT JOIN FETCH r.categories LEFT JOIN FETCH r.user WHERE r.status = :status")
           List<Recipe> findAllByStatus(com.cb.backend.model.ContentStatus status);
}