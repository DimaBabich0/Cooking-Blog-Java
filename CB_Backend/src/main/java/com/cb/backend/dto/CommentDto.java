package com.cb.backend.dto;

import java.time.LocalDateTime;

/**
 * DTO representing a {@link com.cb.backend.model.Comment} entity.
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class CommentDto {
	// --- Variables ---
    private Long id;
    private String text;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long recipeId;
    private UserDto userDto;
	
    // --- Methods ---
    @Override
    public String toString() {
        return "CommentDto{" +
                "id=" + id +
                ", text=" + text + "" +
                ", createdAt=" + createdAt + "" +
                ", updatedAt=" + updatedAt + "" +
                ", recipeId=" + recipeId + "" +
                ", UserDto=" + userDto + "" +
                '}';
    }
    
    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getRecipeId() { return recipeId; }
    public void setRecipeId(Long recipeId) { this.recipeId = recipeId; }
    
    public UserDto getUserDto() { return userDto; }
    public void setUserDto(UserDto userDto) { this.userDto = userDto; }
}