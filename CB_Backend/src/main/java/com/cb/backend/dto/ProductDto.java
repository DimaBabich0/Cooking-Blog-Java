package com.cb.backend.dto;

/**
 * DTO representing a {@link com.cb.backend.model.Product} entity.
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class ProductDto {
	// --- Variables ---
	private Long id;
    private String name;

    // --- Methods ---
    @Override
    public String toString() {
        return "ProductDto{" +
                "id=" + id +
                ", name=" + name +
                '}';
    }
    
    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}