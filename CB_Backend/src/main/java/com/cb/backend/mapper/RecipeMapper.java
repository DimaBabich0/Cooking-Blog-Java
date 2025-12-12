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

public class RecipeMapper {
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

    public static void updateEntity(
    		Recipe recipe,
    		RecipeDto dto,
    		User user,
    		List<Category> categories,
    		List<Ingredient> ingredients) {
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
