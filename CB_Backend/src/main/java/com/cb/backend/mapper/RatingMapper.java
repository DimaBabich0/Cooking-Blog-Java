package com.cb.backend.mapper;

import com.cb.backend.dto.RatingDto;
import com.cb.backend.model.Rating;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.User;

/**
 * Mapper class for converting between {@link Rating} entities and {@link RatingDto} data transfer objects.
 *
 * <p>
 * Provides methods to convert a Rating entity to a RatingDto and to update an existing Rating
 * entity with data from a RatingDto.
 * </p>
 *
 * <p>
 * Handles relationships with {@link User} and {@link Recipe} entities.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class RatingMapper {
	/**
	 * Converts a {@link Rating} entity to a {@link RatingDto}.
	 *
	 * @param rating the entity to convert
	 * @return a RatingDto with values from the entity, including user and recipe IDs
	 */
    public static RatingDto toDto(Rating rating) {
    	RatingDto dto = new RatingDto();
        dto.setId(rating.getId());
        dto.setRating(rating.getRating());
        dto.setRecipeId(rating.getRecipe().getId());
        dto.setUserId(rating.getUser().getId());
        return dto;
    }

    /**
     * Updates an existing {@link Rating} entity with data from a {@link RatingDto}.
     *
     * @param rating the entity to update
     * @param dto the DTO containing new values
     * @param recipe the associated {@link Recipe} entity
     * @param user the {@link User} entity who made the rating
     */
    public static void updateEntity(Rating rating, RatingDto dto, Recipe recipe, User user) {
    	rating.setRating(dto.getRating());
    	rating.setRecipe(recipe);
    	rating.setUser(user);
    }
}
