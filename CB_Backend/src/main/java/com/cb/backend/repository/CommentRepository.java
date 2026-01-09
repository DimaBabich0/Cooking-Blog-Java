package com.cb.backend.repository;

import com.cb.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for <b>Comment</b> entities.
 *
 * <p>
 * Extends {@link JpaRepository} to provide CRUD operations and
 * pagination for {@link Comment} objects.
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
public interface CommentRepository extends JpaRepository<Comment, Long> {
    /**
     * Finds all comments for a specific recipe.
     * 
     * @param recipeId the recipe ID
     * @return list of comments for the recipe
     */
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.user WHERE c.recipe.id = :recipeId ORDER BY c.createdAt DESC")
    List<Comment> findByRecipeId(@Param("recipeId") Long recipeId);
    
    /**
     * Finds all comments for a specific blog.
     * 
     * @param blogId the blog ID
     * @return list of comments for the blog
     */
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.user WHERE c.blog.id = :blogId ORDER BY c.createdAt DESC")
    List<Comment> findByBlogId(@Param("blogId") Long blogId);
}