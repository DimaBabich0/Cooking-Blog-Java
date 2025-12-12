package com.cb.backend.mapper;

import com.cb.backend.dto.IngredientDto;
import com.cb.backend.model.Ingredient;
import com.cb.backend.model.Product;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.RecipeIngredientKey;

public class IngredientMapper {
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

        // PK
        RecipeIngredientKey key = new RecipeIngredientKey(
                recipe.getId(),
                product.getId()
        );
        ingredient.setId(key);

        // relations
        ingredient.setRecipe(recipe);
        ingredient.setProduct(product);

        // fields
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

        // лучше грузить product через repo в сервисе, но можно так оставить

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
    
    public static void updateEntity(Ingredient ingredient, IngredientDto dto, Product product) {
        ingredient.setQuantity(dto.getQuantity());
        ingredient.setUnit(dto.getUnit());
        ingredient.setProduct(product);
        ingredient.getId().setProductId(product.getId());
    }
}