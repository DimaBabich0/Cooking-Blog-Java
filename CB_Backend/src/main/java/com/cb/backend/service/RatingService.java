package com.cb.backend.service;

import com.cb.backend.dto.RatingDto;
import com.cb.backend.mapper.RatingMapper;
import com.cb.backend.model.Rating;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.User;
import com.cb.backend.repository.RatingRepository;
import com.cb.backend.repository.RecipeRepository;
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
    
    public RatingService(RatingRepository ratingRepo, UserRepository userRepo, RecipeRepository recipeRepo) {
        this.ratingRepo = ratingRepo;
        this.userRepo = userRepo;
        this.recipeRepo = recipeRepo;
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
	 *
	 * @param dto the {@link RatingDto} containing rating data
	 * @return {@link RatingDto} of the created rating
	 * @throws RuntimeException if the associated user or recipe is not found
	 */
	@Override
	public RatingDto create(RatingDto dto) {
		User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
		
		Recipe recipe = recipeRepo.findById(dto.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
		
        Rating rating = new Rating();
        RatingMapper.updateEntity(rating, dto, recipe, user);
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
        
		Recipe recipe = recipeRepo.findById(dto.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
		
        Rating rating = ratingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));
        RatingMapper.updateEntity(rating, dto, recipe, user);
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
}