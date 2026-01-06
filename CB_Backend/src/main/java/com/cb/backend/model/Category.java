package com.cb.backend.model;

import java.util.List;
import jakarta.persistence.*;

/**
 * Entity <b>Category</b> represents a category used to group recipes.
 *
 * <p>
 * This entity is mapped to the <b>CB_CATEGORY</b> table and is used to store
 * recipe categories such as cuisine types, meal types, or thematic groups.
 * A category contains a name, optional description, thumbnail image,
 * and a list of associated recipes.
 * </p>
 *
 * <p>
 * Each category can be associated with multiple {@link Recipe} entities,
 * and each recipe can belong to multiple categories.
 * </p>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
@Entity
@Table(name = "CB_CATEGORY")
public class Category {
	// --- Variables ---
	/**
     * Unique identifier of the category.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the category.
     * <p>Must not be {@code null}.</p>
     */
    @Column(nullable = false)
    private String name;

    /**
     * Short description of the category.
     * <p>Maximum length is 255 characters.</p>
     */
    @Column(length = 255)
    private String description;

    /**
     * Path to the image associated with the category.
     * <p>Maximum length is 255 characters.</p>
     */
    @Column(name = "photo_url", length = 255)
    private String photoUrl;
    
    // --- Relationships ---
    /**
     * List of recipes associated with this category.
     * <p>
     * Many categories can be assigned to one recipe,
     * and one category can contain multiple recipes.
     * </p>
     */
    @ManyToMany(mappedBy = "categories")
    private List<Recipe> recipes;

    // --- Methods ---
    /**
     * Returns a string representation of the category.
     */
    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
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

    public List<Recipe> getRecipes() { return recipes; }
    public void setRecipes(List<Recipe> recipes) { this.recipes = recipes; }
}
