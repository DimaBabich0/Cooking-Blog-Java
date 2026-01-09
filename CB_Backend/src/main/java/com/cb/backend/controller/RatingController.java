package com.cb.backend.controller;

import com.cb.backend.dto.RatingDto;
import com.cb.backend.service.RatingService;
import com.cb.backend.service.CrudService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * REST controller for managing {@link RatingDto} entities.
 *
 * <p>
 * Provides standard CRUD endpoints inherited from {@link AbstractCrudController}:
 * <ul>
 *     <li>GET /api/ratings – list all ratings,</li>
 *     <li>GET /api/ratings/{id} – get a rating by ID,</li>
 *     <li>POST /api/ratings – create a new rating,</li>
 *     <li>PUT /api/ratings/{id} – update an existing rating,</li>
 *     <li>DELETE /api/ratings/{id} – delete a rating by ID.</li>
 * </ul>
 * </p>
 *
 * <p>
 * Delegates all operations to {@link RatingService}.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@RestController
@RequestMapping("/api/ratings")
public class RatingController extends AbstractCrudController<RatingDto, Long> {
	private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    /**
     * Returns the service used by this controller for CRUD operations.
     *
     * @return the {@link CrudService} for ratings
     */
    @Override
    protected CrudService<RatingDto, Long> getService() {
        return ratingService;
    }
    
    /**
     * Gets all ratings for a specific recipe.
     *
     * @param recipeId the recipe ID
     * @return list of ratings for the recipe
     */
    @GetMapping("/recipe/{recipeId}")
    public List<RatingDto> getRatingsByRecipe(@PathVariable("recipeId") Long recipeId) {
        return ratingService.findByRecipeId(recipeId);
    }
    
    /**
     * Gets all ratings for a specific blog.
     *
     * @param blogId the blog ID
     * @return list of ratings for the blog
     */
    @GetMapping("/blog/{blogId}")
    public List<RatingDto> getRatingsByBlog(@PathVariable("blogId") Long blogId) {
        return ratingService.findByBlogId(blogId);
    }
    
    /**
     * Gets average rating for a recipe.
     *
     * @param recipeId the recipe ID
     * @return average rating
     */
    @GetMapping("/recipe/{recipeId}/average")
    public Map<String, Object> getAverageRatingByRecipe(@PathVariable("recipeId") Long recipeId) {
        Double average = ratingService.getAverageRatingByRecipe(recipeId);
        List<RatingDto> ratings = ratingService.findByRecipeId(recipeId);
        return Map.of(
            "average", average,
            "count", ratings.size()
        );
    }
    
    /**
     * Gets average rating for a blog.
     *
     * @param blogId the blog ID
     * @return average rating
     */
    @GetMapping("/blog/{blogId}/average")
    public Map<String, Object> getAverageRatingByBlog(@PathVariable("blogId") Long blogId) {
        Double average = ratingService.getAverageRatingByBlog(blogId);
        List<RatingDto> ratings = ratingService.findByBlogId(blogId);
        return Map.of(
            "average", average,
            "count", ratings.size()
        );
    }
    
    /**
     * Gets user's rating for a recipe.
     *
     * @param userId the user ID
     * @param recipeId the recipe ID
     * @return rating DTO or null
     */
    @GetMapping("/user/{userId}/recipe/{recipeId}")
    public ResponseEntity<RatingDto> getUserRatingForRecipe(
            @PathVariable("userId") Long userId,
            @PathVariable("recipeId") Long recipeId) {
        RatingDto rating = ratingService.findByUserIdAndRecipeId(userId, recipeId);
        if (rating != null) {
            return org.springframework.http.ResponseEntity.ok(rating);
        }
        return org.springframework.http.ResponseEntity.notFound().build();
    }
    
    /**
     * Gets user's rating for a blog.
     *
     * @param userId the user ID
     * @param blogId the blog ID
     * @return rating DTO or 404 if not found
     */
    @GetMapping("/user/{userId}/blog/{blogId}")
    public ResponseEntity<RatingDto> getUserRatingForBlog(
            @PathVariable("userId") Long userId,
            @PathVariable("blogId") Long blogId) {
        RatingDto rating = ratingService.findByUserIdAndBlogId(userId, blogId);
        if (rating != null) {
            return org.springframework.http.ResponseEntity.ok(rating);
        }
        return org.springframework.http.ResponseEntity.notFound().build();
    }
}