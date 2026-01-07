package com.cb.backend.dto;

/**
 * DTO representing a {@link com.cb.backend.model.Category} entity.
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class CategoryDto {
	// --- Variables ---
    private Long id;
    private String name;
    private String description;
    private String photoUrl;
    
    // --- Methods ---
    @Override
    public String toString() {
        return "RecipeDto{" +
                "id=" + id +
                ", name=" + name + "" +
                ", description=" + description + "" +
                ", photoUrl=" + photoUrl + "" +
                '}';
    }
    
    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
}