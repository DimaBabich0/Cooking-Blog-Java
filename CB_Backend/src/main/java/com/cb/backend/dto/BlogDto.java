package com.cb.backend.dto;

import java.time.LocalDateTime;

public class BlogDto {
	// --- Variables ---
    private Long id;
    private String title;
    private String description;
    private String text;
    private String photoUrl;
    private Integer cookingTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDto userDto;

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public UserDto getUserDto() { return userDto; }
    public void setUserDto(UserDto userDto) { this.userDto = userDto; }
}