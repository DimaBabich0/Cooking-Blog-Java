package com.cb.backend.dto;

/**
 * DTO representing a {@link com.cb.backend.model.Rating} entity.
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class RatingDto {
	// --- Variables ---
    private Long id;
    private Integer rating;
    private Long userId;
    private Long recipeId;

    // --- Methods ---
    @Override
    public String toString() {
        return "RatingDto{" +
                "id=" + id +
                ", rating=" + rating +
                ", userId=" + userId +
                ", recipeId=" + recipeId +
                '}';
    }
    
    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getRecipeId() { return recipeId; }
    public void setRecipeId(Long recipeId) { this.recipeId = recipeId; }
}