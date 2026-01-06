package com.cb.backend.mapper;

import java.util.ArrayList;
import java.util.List;
import com.cb.backend.dto.RecipeDto;
import com.cb.backend.dto.CategoryDto;
import com.cb.backend.dto.IngredientDto;
import com.cb.backend.model.Category;
import com.cb.backend.model.Ingredient;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.User;

/**
 * Mapper class for converting between {@link Recipe} entities and {@link RecipeDto} data transfer objects.
 *
 * <p>
 * Provides methods to convert a Recipe entity to a RecipeDto and to update an existing Recipe
 * entity with data from a RecipeDto.
 * </p>
 */
public class RecipeMapper {
	/**
	 * Converts a {@link Recipe} entity to a {@link RecipeDto}.
	 *
	 * <p>
	 * Maps basic fields, associated {@link User}, {@link Category} list, and {@link Ingredient} list.
	 * </p>
	 *
	 * @param recipe the entity to convert
	 * @return a RecipeDto containing values from the entity
	 */
    public static RecipeDto toDto(Recipe recipe) {
    	RecipeDto dto = new RecipeDto();
        dto.setId(recipe.getId());
        dto.setTitle(recipe.getTitle());
        dto.setDescription(recipe.getDescription());
        dto.setText(recipe.getText());
        dto.setPhotoUrl(recipe.getPhotoUrl());
        dto.setCookingTime(recipe.getCookingTime());
        dto.setCreatedAt(recipe.getCreatedAt());
        dto.setUpdatedAt(recipe.getUpdatedAt());
        
        dto.setUserDto(UserMapper.toDto(recipe.getUser()));
        
        List<CategoryDto> categoriesDto = new ArrayList<>();
        List<Category> categories = recipe.getCategories();
        for (Category category : categories) {
        	categoriesDto.add(CategoryMapper.toDto(category));
		}
        dto.setCategories(categoriesDto);
        
        List<IngredientDto> ingredientsDto = new ArrayList<>();
        List<Ingredient> Ingredients = recipe.getIngredients();
        for (Ingredient ingredient : Ingredients) {
        	ingredientsDto.add(IngredientMapper.toDto(ingredient));
		}
        dto.setIngredients(ingredientsDto);
        return dto;
    }

    /**
     * Updates an existing {@link Recipe} entity with data from a {@link RecipeDto}.
     *
     * <p>
     * Sets basic fields, updates the associated {@link User}, and replaces the lists
     * of {@link Category} and {@link Ingredient} entities.
     * </p>
     *
     * @param recipe the entity to update
     * @param dto the DTO containing new values
     * @param user the {@link User} entity associated with the recipe
     * @param categories list of {@link Category} entities to set
     * @param ingredients list of {@link Ingredient} entities to set
     */
    public static void updateEntity(
    		Recipe recipe,
    		RecipeDto dto,
    		User user,
    		List<Category> categories,
    		List<Ingredient> ingredients) {
    	if (dto.getTitle() == null || dto.getTitle().isBlank()) {
    		throw new RuntimeException("Recipe title is required");
    	}
    	if (dto.getText() == null || dto.getText().isBlank()) {
    		throw new RuntimeException("Recipe text is required");
    	}
    	
    	recipe.setTitle(dto.getTitle());
    	recipe.setDescription(dto.getDescription());
    	recipe.setText(dto.getText());
    	recipe.setPhotoUrl(dto.getPhotoUrl());
    	recipe.setCookingTime(dto.getCookingTime());
    	recipe.setUpdatedAt(dto.getUpdatedAt());
    	
    	recipe.setUser(user);
    	
    	recipe.getCategories().clear();
    	recipe.getCategories().addAll(categories);
    	
    	recipe.getIngredients().clear();
    	recipe.getIngredients().addAll(ingredients);
    }
}
