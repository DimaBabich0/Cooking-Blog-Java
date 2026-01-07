package com.cb.backend.mapper;

import com.cb.backend.dto.IngredientDto;
import com.cb.backend.model.Ingredient;
import com.cb.backend.model.Product;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.RecipeIngredientKey;

/**
 * Mapper class for converting between {@link Ingredient} entities and {@link IngredientDto} data transfer objects.
 *
 * <p>
 * Provides methods to convert an Ingredient entity to a DTO, create a new entity from a DTO,
 * and update an existing entity from a DTO.
 * </p>
 *
 * <p>
 * Handles relationships with {@link Product} and {@link Recipe} entities, including composite primary keys.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class IngredientMapper {
	/**
	 * Converts an {@link Ingredient} entity to an {@link IngredientDto}.
	 *
	 * @param ingredient the entity to convert
	 * @return an IngredientDto containing values from the entity
	 */
    public static IngredientDto toDto(Ingredient ingredient) {
    	IngredientDto dto = new IngredientDto();
    	
    	RecipeIngredientKey id = ingredient.getId();
        dto.setRecipeId(id.getRecipeId());
        dto.setProductId(id.getProductId());
        
        dto.setProductName(ingredient.getProduct().getName());
        dto.setQuantity(ingredient.getQuantity());
        dto.setUnit(ingredient.getUnit());
        return dto;
    }

    /**
     * Converts an {@link IngredientDto} to a new {@link Ingredient} entity.
     *
     * @param dto the DTO with ingredient data
     * @param recipe the associated {@link Recipe} entity
     * @param product the associated {@link Product} entity
     * @return a new Ingredient entity
     */
    public static Ingredient toEntity(IngredientDto dto, Recipe recipe, Product product) {
        Ingredient ingredient = new Ingredient();

        RecipeIngredientKey key = new RecipeIngredientKey(
                recipe.getId(),
                product.getId()
        );

        ingredient.setId(key);
        ingredient.setRecipe(recipe);
        ingredient.setProduct(product);
        ingredient.setQuantity(dto.getQuantity());
        ingredient.setUnit(dto.getUnit());

        return ingredient;
    }
    
    public static Ingredient fromDto(IngredientDto dto, Recipe recipe, Product product) {
        Ingredient ingredient = new Ingredient();

        RecipeIngredientKey key = new RecipeIngredientKey(
                recipe.getId(),
                product.getId()
        );
        ingredient.setId(key);

        ingredient.setRecipe(recipe);
        ingredient.setProduct(product);

        ingredient.setQuantity(dto.getQuantity());
        ingredient.setUnit(dto.getUnit());

        return ingredient;
    }
    
    public static Ingredient fromDtoWithRecipe(IngredientDto dto, Recipe recipe) {
        Product product = recipe.getIngredients().stream()
                .map(Ingredient::getProduct)
                .filter(p -> p.getId().equals(dto.getProductId()))
                .findFirst()
                .orElse(null);

        Ingredient ingredient = new Ingredient();
        ingredient.setRecipe(recipe);
        ingredient.setProduct(product);

        ingredient.setQuantity(dto.getQuantity());
        ingredient.setUnit(dto.getUnit());

        ingredient.setId(new RecipeIngredientKey(
                recipe.getId(),
                dto.getProductId()
        ));

        return ingredient;
    }
    
    /**
     * Updates an existing {@link Ingredient} entity with data from a {@link IngredientDto}.
     *
     * @param ingredient the entity to update
     * @param dto the DTO containing new values
     * @param product the {@link Product} entity associated with the ingredient
     */
    public static void updateEntity(Ingredient ingredient, IngredientDto dto, Product product) {
        ingredient.setQuantity(dto.getQuantity());
        ingredient.setUnit(dto.getUnit());
        ingredient.setProduct(product);
        ingredient.getId().setProductId(product.getId());
    }
}