package com.cb.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "CB_INGREDIENTS")
public class Ingredient {
	// -- Variables ---
    @EmbeddedId
    private RecipeIngredientKey id = new RecipeIngredientKey();

    @Column(nullable = false)
    private Double quantity;

    @Column(length = 20)
    private String unit = "g";

    // --- Relationships ---
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("recipeId")
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;
    
    // --- Constructors ---
    public Ingredient() {}

    public Ingredient(Recipe recipe, Product product, Double quantity, String unit) {
        this.id = new RecipeIngredientKey(recipe.getId(), product.getId());
        this.recipe = recipe;
        this.product = product;
        this.quantity = quantity;
        this.unit = unit;
    }

    // --- Getters & Setters ---
    public RecipeIngredientKey getId() { return id; }
    public void setId(RecipeIngredientKey id) { this.id = id; }

    public Recipe getRecipe() { return recipe; }
    public void setRecipe(Recipe recipe) { this.recipe = recipe; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}
