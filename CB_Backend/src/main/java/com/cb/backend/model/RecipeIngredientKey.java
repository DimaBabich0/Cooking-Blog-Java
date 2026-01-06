package com.cb.backend.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * Embeddable class <b>RecipeIngredientKey</b> represents a composite primary key
 * for the {@link Ingredient} entity.
 *
 * <p>
 * This key is composed of a recipe identifier and a product identifier and is
 * used to uniquely identify the relationship between a {@link Recipe} and a
 * {@link Product}.
 * </p>
 *
 * <p>
 * The class implements {@link Serializable} as required by JPA for composite keys
 * and properly overrides {@link #equals(Object)} and {@link #hashCode()}.
 * </p>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
@Embeddable
public class RecipeIngredientKey implements Serializable {
	private static final long serialVersionUID = 1L;

	// --- Variables ---
	/**
     * Identifier of the recipe.
     */
    @Column(name = "recipe_id")
    private Long recipeId;

    /**
     * Identifier of the product.
     */
    @Column(name = "product_id")
    private Long productId;

    // --- Constructors ---
    public RecipeIngredientKey() {}

    /**
     * Creates a composite key using recipe and product identifiers.
     *
     * @param recipeId  identifier of the recipe
     * @param productId identifier of the product
     */
    public RecipeIngredientKey(Long recipeId, Long productId) {
        this.recipeId = recipeId;
        this.productId = productId;
    }
    
    // --- Methods ---
    /**
     * Returns a string representation of the composite key.
     */
    @Override
    public String toString() {
        return "RecipeIngredientKey{" +
                "recipeId=" + recipeId +
                ", productId=" + productId +
                '}';
    }
    
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

    // --- Getters & Setters ---
    public Long getRecipeId() { return recipeId; }
    public void setRecipeId(Long recipeId) { this.recipeId = recipeId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
}