package com.cb.backend.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class RecipeIngredientKey implements Serializable {
	// --- Variables ---
    @Column(name = "recipe_id")
    private Long recipeId;

    @Column(name = "product_id")
    private Long productId;

    // --- Constructors ---
    public RecipeIngredientKey() {}

    public RecipeIngredientKey(Long recipeId, Long productId) {
        this.recipeId = recipeId;
        this.productId = productId;
    }

    // --- Getters & Setters ---
    public Long getRecipeId() { return recipeId; }
    public void setRecipeId(Long recipeId) { this.recipeId = recipeId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    // --- Equals & HashCode ---
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RecipeIngredientKey)) return false;
        RecipeIngredientKey that = (RecipeIngredientKey) o;
        return Objects.equals(recipeId, that.recipeId) &&
               Objects.equals(productId, that.productId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(recipeId, productId);
    }
}