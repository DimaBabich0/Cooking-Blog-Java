package com.cb.backend.model;

import jakarta.persistence.*;

/**
 * Entity <b>Rating</b> represents a user rating assigned to a recipe.
 *
 * <p>
 * This entity is mapped to the <b>CB_RATINGS</b> table and is used to store
 * numerical ratings given by users to recipes.
 * </p>
 *
 * <p>
 * Each rating is associated with exactly one {@link User} and one {@link Recipe}.
 * </p>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
@Entity
@Table(name = "CB_RATINGS")
public class Rating {
	//--- Variables ---
	/**
     * Unique identifier of the rating.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Rating value given by the user.
     */
    @Column(name = "rating")
    private Integer rating;
    
    //--- Relationships ---
    /**
     * User who submitted the rating.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Recipe that is being rated.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;
    
    // --- Methods ---
    /**
     * Returns a string representation of the rating.
     */
    @Override
    public String toString() {
        return "Rating{" +
                "id=" + id +
                ", rating=" + rating +
                ", userId=" + (user != null ? user.getId() : null) +
                ", recipeId=" + (recipe != null ? recipe.getId() : null) +
                '}';
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Recipe getRecipe() { return recipe; }
    public void setRecipe(Recipe recipe) { this.recipe = recipe; }
}
