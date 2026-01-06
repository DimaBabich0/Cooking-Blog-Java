package com.cb.backend.model;

import jakarta.persistence.*;

/**
 * Entity <b>Ingredient</b> represents a link between a recipe and a product
 * with a specified quantity and measurement unit.
 *
 * <p>
 * This entity is mapped to the <b>CB_INGREDIENTS</b> table and serves as a
 * association table for the many-to-many relationship between
 * {@link Recipe} and {@link Product}, enriched with additional attributes
 * such as quantity and unit.
 * </p>
 *
 * <p>
 * The primary key is a composite key represented by {@link RecipeIngredientKey}.
 * </p>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
@Entity
@Table(name = "CB_INGREDIENTS")
public class Ingredient {
	// -- Variables ---
    /**
     * Composite primary key consisting of recipe ID and product ID.
     */
    @EmbeddedId
    private RecipeIngredientKey id = new RecipeIngredientKey();

    /**
     * Quantity of the product used in the recipe.
     * <p>Must not be {@code null}.</p>
     */
    @Column(nullable = false)
    private Double quantity;

    /**
     * Measurement unit for the quantity.
     * <p>Default value is {@code "g"}.</p>
     */
    @Column(length = 20)
    private String unit = "g";

    // --- Relationships ---   
    /**
     * Recipe to which this ingredient belongs.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("recipeId")
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;


    /**
     * Product used as an ingredient in the recipe.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;
    
    // --- Constructors --- 
    public Ingredient() {}
    
    /**
     * Creates a new ingredient for the given recipe and product.
     *
     * @param recipe   recipe to which the ingredient belongs
     * @param product  product used in the recipe
     * @param quantity amount of the product
     * @param unit     measurement unit
     */
    public Ingredient(Recipe recipe, Product product, Double quantity, String unit) {
        this.id = new RecipeIngredientKey(recipe.getId(), product.getId());
        this.recipe = recipe;
        this.product = product;
        this.quantity = quantity;
        this.unit = unit;
    }

    // --- Methods --- 
    /**
     * Returns a string representation of the ingredient.
     */
    @Override
    public String toString() {
        return "Ingredient{" +
                "recipeId=" + (recipe != null ? recipe.getId() : null) +
                ", productId=" + (product != null ? product.getId() : null) +
                ", quantity=" + quantity +
                ", unit='" + unit + '\'' +
                '}';
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
