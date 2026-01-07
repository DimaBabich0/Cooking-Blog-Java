package com.cb.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO representing a {@link com.cb.backend.model.Recipe} entity.
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class RecipeDto {
	// --- Variables ---
    private Long id;
    private String title;
    private String description;
    private String text;
    private String photoUrl;
    private Integer cookingTime; // Оставляем для обратной совместимости
    private Integer prepTime;
    private Integer cookTime;
    // Nutrition Information
    private Double calories;
    private Double totalFat;
    private Double protein;
    private Double carbohydrates;
    private Double cholesterol;
    private String status; // PENDING, PUBLISHED, REJECTED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDto userDto;
    private List<CategoryDto> categoriesDto;
    private List<IngredientDto> ingredientsDto;

    // --- Methods ---
    @Override
    public String toString() {
    	int categoriesDtoSize = categoriesDto != null ? categoriesDto.size() : 0;
    	int ingredientsDtoSize = ingredientsDto != null ? ingredientsDto.size() : 0;
    	
        return "RecipeDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", text='" + (text != null ? text.substring(0, Math.min(text.length(), 50)) + "..." : null) + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
                ", cookingTime=" + cookingTime +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", userDto=" + (userDto != null ? userDto : null) +
                ", categoriesDtoDto[" + categoriesDtoSize + "]=" + (categoriesDto != null ? categoriesDto.toString() : null)  +
                ", ingredientsDtoDto[" + ingredientsDtoSize + "]=" + (ingredientsDto != null ? ingredientsDto.toString() : null) +
                '}';
    }
    
    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getPhotoUrl() { return photoUrl; }
	public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    
    public Integer getCookingTime() { return cookingTime; }
    public void setCookingTime(Integer cookingTime) { this.cookingTime = cookingTime; }
    
    public Integer getPrepTime() { return prepTime; }
    public void setPrepTime(Integer prepTime) { this.prepTime = prepTime; }
    
    public Integer getCookTime() { return cookTime; }
    public void setCookTime(Integer cookTime) { this.cookTime = cookTime; }
    
    public Double getCalories() { return calories; }
    public void setCalories(Double calories) { this.calories = calories; }
    
    public Double getTotalFat() { return totalFat; }
    public void setTotalFat(Double totalFat) { this.totalFat = totalFat; }
    
    public Double getProtein() { return protein; }
    public void setProtein(Double protein) { this.protein = protein; }
    
    public Double getCarbohydrates() { return carbohydrates; }
    public void setCarbohydrates(Double carbohydrates) { this.carbohydrates = carbohydrates; }
    
    public Double getCholesterol() { return cholesterol; }
    public void setCholesterol(Double cholesterol) { this.cholesterol = cholesterol; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public UserDto getUserDto() { return userDto; }
    public void setUserDto(UserDto userDto) { this.userDto = userDto; }

    @JsonProperty("categoryDtos")
    public List<CategoryDto> getCategoriesDto() { return categoriesDto; }
    public void setCategories(List<CategoryDto> categoriesDto) { this.categoriesDto = categoriesDto; }
    
    @JsonProperty("ingredientsDto")
    public List<IngredientDto> getIngredientsDto() { return ingredientsDto; }
    public void setIngredients(List<IngredientDto> ingredientsDto) { this.ingredientsDto = ingredientsDto; }
}