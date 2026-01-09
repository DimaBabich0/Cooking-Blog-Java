package com.cb.backend.service;

import com.cb.backend.dto.RatingDto;
import com.cb.backend.mapper.RatingMapper;
import com.cb.backend.model.Rating;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.Blog;
import com.cb.backend.model.User;
import com.cb.backend.repository.RatingRepository;
import com.cb.backend.repository.RecipeRepository;
import com.cb.backend.repository.BlogRepository;
import com.cb.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class <b>RatingService</b> implements {@link CrudService} for
 * {@link RatingDto} objects.
 *
 * <p>
 * Provides CRUD operations for {@link Rating} entities, mapping between
 * {@link Rating} and {@link RatingDto} using {@link RatingMapper}.
 * Handles associations with {@link User} and {@link Recipe}.
 * </p>
 *
 * <p>
 * Throws {@link RuntimeException} if referenced user, recipe, or rating is not found.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@Service
public class RatingService implements CrudService<RatingDto, Long> {
    private final RatingRepository ratingRepo;
    private final UserRepository userRepo;
    private final RecipeRepository recipeRepo;
    private final BlogRepository blogRepo;
    
    public RatingService(RatingRepository ratingRepo, UserRepository userRepo, RecipeRepository recipeRepo, BlogRepository blogRepo) {
        this.ratingRepo = ratingRepo;
        this.userRepo = userRepo;
        this.recipeRepo = recipeRepo;
        this.blogRepo = blogRepo;
    }

    /**
     * Retrieves all ratings.
     *
     * @return list of {@link RatingDto} representing all ratings
     */
	@Override
	public List<RatingDto> findAll() {
        return ratingRepo.findAll().stream()
                .map(RatingMapper::toDto)
                .collect(Collectors.toList());
	}

	/**
	 * Finds a rating by its ID.
	 *
	 * @param id the identifier of the rating
	 * @return {@link RatingDto} of the found rating, or {@code null} if not found
	 */
	@Override
	public RatingDto findById(Long id) {
		return ratingRepo.findById(id)
                .map(RatingMapper::toDto)
                .orElse(null);
	}

	/**
	 * Creates a new rating.
	 * If a rating already exists for this user and recipe/blog, updates it instead.
	 *
	 * @param dto the {@link RatingDto} containing rating data
	 * @return {@link RatingDto} of the created or updated rating
	 * @throws RuntimeException if the associated user or recipe/blog is not found
	 */
	@Override
	public RatingDto create(RatingDto dto) {
		User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
		
		Recipe recipe = null;
		Blog blog = null;
		
		if (dto.getRecipeId() != null) {
			recipe = recipeRepo.findById(dto.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
			
			// Check if rating already exists for this user and recipe
			java.util.Optional<Rating> existingRating = ratingRepo.findByUserIdAndRecipeId(dto.getUserId(), dto.getRecipeId());
			if (existingRating.isPresent()) {
				// Update existing rating instead of creating new one
				Rating rating = existingRating.get();
				RatingMapper.updateEntity(rating, dto, recipe, blog, user);
				return RatingMapper.toDto(ratingRepo.save(rating));
			}
		} else if (dto.getBlogId() != null) {
			blog = blogRepo.findById(dto.getBlogId())
                .orElseThrow(() -> new RuntimeException("Blog not found"));
			
			// Check if rating already exists for this user and blog
			java.util.Optional<Rating> existingRating = ratingRepo.findByUserIdAndBlogId(dto.getUserId(), dto.getBlogId());
			if (existingRating.isPresent()) {
				// Update existing rating instead of creating new one
				Rating rating = existingRating.get();
				RatingMapper.updateEntity(rating, dto, recipe, blog, user);
				return RatingMapper.toDto(ratingRepo.save(rating));
			}
		} else {
			throw new RuntimeException("Either recipeId or blogId must be provided");
		}
		
        Rating rating = new Rating();
        RatingMapper.updateEntity(rating, dto, recipe, blog, user);
        return RatingMapper.toDto(ratingRepo.save(rating));
	}

	/**
	 * Updates an existing rating.
	 *
	 * @param id  the identifier of the rating to update
	 * @param dto the {@link RatingDto} containing updated rating data
	 * @return {@link RatingDto} of the updated rating
	 * @throws RuntimeException if the rating, associated user, or recipe is not found
	 */
	@Override
	public RatingDto update(Long id, RatingDto dto) {
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
		Recipe recipe = null;
		Blog blog = null;
		
		if (dto.getRecipeId() != null) {
			recipe = recipeRepo.findById(dto.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
		} else if (dto.getBlogId() != null) {
			blog = blogRepo.findById(dto.getBlogId())
                .orElseThrow(() -> new RuntimeException("Blog not found"));
		} else {
			throw new RuntimeException("Either recipeId or blogId must be provided");
		}
		
        Rating rating = ratingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));
        RatingMapper.updateEntity(rating, dto, recipe, blog, user);
        return RatingMapper.toDto(ratingRepo.save(rating));
	}

	/**
	 * Deletes a rating by its ID.
	 *
	 * @param id the identifier of the rating to delete
	 */
	@Override
	public void deleteById(Long id) {
		ratingRepo.deleteById(id);				
	}
	
	/**
	 * Finds all ratings for a specific recipe.
	 *
	 * @param recipeId the recipe ID
	 * @return list of ratings for the recipe
	 */
	public List<RatingDto> findByRecipeId(Long recipeId) {
		return ratingRepo.findByRecipeId(recipeId).stream()
				.map(RatingMapper::toDto)
				.collect(Collectors.toList());
	}
	
	/**
	 * Finds all ratings for a specific blog.
	 *
	 * @param blogId the blog ID
	 * @return list of ratings for the blog
	 */
	public List<RatingDto> findByBlogId(Long blogId) {
		return ratingRepo.findByBlogId(blogId).stream()
				.map(RatingMapper::toDto)
				.collect(Collectors.toList());
	}
	
	/**
	 * Finds a rating by user and recipe.
	 *
	 * @param userId the user ID
	 * @param recipeId the recipe ID
	 * @return rating DTO or null if not found
	 */
	public RatingDto findByUserIdAndRecipeId(Long userId, Long recipeId) {
		return ratingRepo.findByUserIdAndRecipeId(userId, recipeId)
				.map(RatingMapper::toDto)
				.orElse(null);
	}
	
	/**
	 * Finds a rating by user and blog.
	 *
	 * @param userId the user ID
	 * @param blogId the blog ID
	 * @return rating DTO or null if not found
	 */
	public RatingDto findByUserIdAndBlogId(Long userId, Long blogId) {
		return ratingRepo.findByUserIdAndBlogId(userId, blogId)
				.map(RatingMapper::toDto)
				.orElse(null);
	}
	
	/**
	 * Calculates average rating for a recipe.
	 *
	 * @param recipeId the recipe ID
	 * @return average rating or 0 if no ratings
	 */
	public Double getAverageRatingByRecipe(Long recipeId) {
		List<RatingDto> ratings = findByRecipeId(recipeId);
		if (ratings.isEmpty()) {
			return 0.0;
		}
		double sum = ratings.stream()
				.mapToInt(RatingDto::getRating)
				.sum();
		return sum / ratings.size();
	}
	
	/**
	 * Calculates average rating for a blog.
	 *
	 * @param blogId the blog ID
	 * @return average rating or 0 if no ratings
	 */
	public Double getAverageRatingByBlog(Long blogId) {
		List<RatingDto> ratings = findByBlogId(blogId);
		if (ratings.isEmpty()) {
			return 0.0;
		}
		double sum = ratings.stream()
				.mapToInt(RatingDto::getRating)
				.sum();
		return sum / ratings.size();
	}
}