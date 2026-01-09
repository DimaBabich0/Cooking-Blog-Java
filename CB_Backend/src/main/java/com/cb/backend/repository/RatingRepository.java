package com.cb.backend.repository;

import com.cb.backend.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for <b>Rating</b> entities.
 *
 * <p>
 * Extends {@link JpaRepository} to provide CRUD operations and
 * pagination for {@link Rating} objects.
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
public interface RatingRepository extends JpaRepository<Rating, Long> {
    /**
     * Finds all ratings for a specific recipe.
     * 
     * @param recipeId the recipe ID
     * @return list of ratings for the recipe
     */
    @Query("SELECT r FROM Rating r WHERE r.recipe.id = :recipeId")
    List<Rating> findByRecipeId(@Param("recipeId") Long recipeId);
    
    /**
     * Finds all ratings for a specific blog.
     * 
     * @param blogId the blog ID
     * @return list of ratings for the blog
     */
    @Query("SELECT r FROM Rating r WHERE r.blog.id = :blogId")
    List<Rating> findByBlogId(@Param("blogId") Long blogId);
    
    /**
     * Finds a rating by user and recipe.
     * 
     * @param userId the user ID
     * @param recipeId the recipe ID
     * @return optional rating
     */
    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId AND r.recipe.id = :recipeId")
    Optional<Rating> findByUserIdAndRecipeId(@Param("userId") Long userId, @Param("recipeId") Long recipeId);
    
    /**
     * Finds a rating by user and blog.
     * 
     * @param userId the user ID
     * @param blogId the blog ID
     * @return optional rating
     */
    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId AND r.blog.id = :blogId")
    Optional<Rating> findByUserIdAndBlogId(@Param("userId") Long userId, @Param("blogId") Long blogId);
}