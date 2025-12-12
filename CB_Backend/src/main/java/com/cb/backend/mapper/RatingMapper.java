package com.cb.backend.mapper;

import com.cb.backend.dto.RatingDto;
import com.cb.backend.model.Rating;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.User;

public class RatingMapper {
    public static RatingDto toDto(Rating rating) {
    	RatingDto dto = new RatingDto();
        dto.setId(rating.getId());
        dto.setRating(rating.getRating());
        dto.setRecipeId(rating.getRecipe().getId());
        dto.setUserId(rating.getUser().getId());
        return dto;
    }

    public static void updateEntity(Rating rating, RatingDto dto, Recipe recipe, User user) {
    	rating.setRating(dto.getRating());
    	rating.setRecipe(recipe);
    	rating.setUser(user);
    }
}
