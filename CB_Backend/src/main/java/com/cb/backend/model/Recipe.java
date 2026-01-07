package com.cb.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.cb.backend.model.ContentStatus;

/**
 * Entity <b>Recipe</b> represents a cooking recipe created by a user.
 *
 * <p>
 * This entity is mapped to the <b>CB_RECIPES</b> table and is used to store
 * detailed information about recipes, including title, description,
 * full recipe content, image, cooking time, and audit timestamps.
 * </p>
 *
 * <p>
 * Each recipe is authored by exactly one {@link User} and can be associated
 * with multiple {@link Category} and {@link Ingredient} entities.
 * </p>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
@Entity
@Table(name = "CB_RECIPES")
public class Recipe {
	//--- Variables ---
	/**
     * Unique identifier of the recipe.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Title of the recipe.
     * <p>Must not be {@code null}. Maximum length is 100 characters.</p>
     */
    @Column(length = 100, nullable = false)
    private String title;

    /**
     * Short description of the recipe.
     * <p>Maximum length is 500 characters.</p>
     */
    @Column(length = 500)
    private String description;

    /**
     * Full content of the recipe.
     * <p>
     * Must not be {@code null}.
     * Stored as a {@link Lob} to allow large amounts of text
     * (e.g. HTML, Markdown).
     * </p>
     */
    @Lob
    @Column(nullable = false)
    private String text;

    /**
     * Path to the image associated with the recipe.
     * <p>Maximum length is 255 characters.</p>
     */
    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    /**
     * Cooking time in minutes.
     */
    @Column(name = "cooking_time")
    private Integer cookingTime; // Оставляем для обратной совместимости
    
    @Column(name = "prep_time")
    private Integer prepTime;
    
    @Column(name = "cook_time")
    private Integer cookTime;
    
    // Nutrition Information
    @Column(name = "calories")
    private Double calories;
    
    @Column(name = "total_fat")
    private Double totalFat;
    
    @Column(name = "protein")
    private Double protein;
    
    @Column(name = "carbohydrates")
    private Double carbohydrates;
    
    @Column(name = "cholesterol")
    private Double cholesterol;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ContentStatus status = ContentStatus.PENDING;

    /**
     * Timestamp when the recipe was created.
     * <p>Automatically set before persisting the entity.</p>
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Timestamp when the recipe was last updated.
     * <p>Automatically updated before updating the entity.</p>
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    //--- Relationships ---
    /**
     * Author of the recipe.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Categories assigned to the recipe.
     * <p>
     * One recipe can belong to multiple categories,
     * and one category can contain multiple recipes.
     * </p>
     */
    @ManyToMany
    @JoinTable(
            name = "CB_RECIPE_CATEGORIES",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();
    
    /**
     * Ingredients used in the recipe.
     * <p>
     * One recipe can contain multiple ingredients.
     * </p>
     */
    @OneToMany(
            mappedBy = "recipe",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Ingredient> ingredients = new ArrayList<>();

    // --- Methods ---
    /**
     * Called before the entity is persisted.
     * <p>
     * Initializes {@code createdAt} and {@code updatedAt}
     * with the current timestamp.
     * </p>
     */
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        if (this.status == null) {
            this.status = ContentStatus.PENDING;
        }
    }

    /**
     * Called before the entity is updated.
     * <p>
     * Updates {@code updatedAt} with the current timestamp.
     * </p>
     */
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Returns a string representation of the recipe.
     */
    @Override
    public String toString() {
        return "Recipe{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
                ", cookingTime=" + cookingTime +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", userId=" + (user != null ? user.getId() : null) +
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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public List<Category> getCategories() { return categories; }
    
    public List<Ingredient> getIngredients() { return ingredients; }
    
    public ContentStatus getStatus() { return status; }
    public void setStatus(ContentStatus status) { this.status = status; }
}
