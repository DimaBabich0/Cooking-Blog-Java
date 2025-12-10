package com.cb.backend.dto;

public class IngredientDto {
	// --- Variables ---
    private Long recipeId;
    private Long productId;
    private String productName;
    private Double quantity;
    private String unit;
    
    // --- Getters & Setters ---
	public Long getRecipeId() { return recipeId; }
	public void setRecipeId(Long recipeId) { this.recipeId = recipeId; }

	public Long getProductId() { return productId; }
	public void setProductId(Long productId) { this.productId = productId; }

	public String getProductName() { return productName; }
	public void setProductName(String productName) { this.productName = productName; }

	public Double getQuantity() { return quantity; }
	public void setQuantity(Double quantity) { this.quantity = quantity; }

	public String getUnit() { return unit; }
	public void setUnit(String unit) { this.unit = unit; }

}
