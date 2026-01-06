package com.cb.backend.model;

import jakarta.persistence.*;

/**
 * Entity <b>Product</b> represents a product that can be used as an ingredient
 * in recipes.
 *
 * <p>
 * This entity is mapped to the <b>CB_PRODUCT</b> table and is used to store
 * unique products such as food items, spices, or other components that can be
 * referenced by multiple recipes.
 * </p>
 *
 * <p>
 * Each product can be associated with multiple {@link Ingredient} entities,
 * allowing reuse of the same product across different recipes.
 * </p>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
@Entity
@Table(name = "CB_PRODUCT")
public class Product {
	// --- Variables ---
    /**
     * Unique identifier of the product.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the product.
     * <p>
     * Must not be {@code null} and must be unique.
     * </p>
     */
    @Column(nullable = false, unique = true)
    private String name;

    // --- Methods ---
    /**
     * Returns a string representation of the product.
     */
    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
