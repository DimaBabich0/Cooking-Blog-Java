package com.cb.backend.repository;

import com.cb.backend.model.Product;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for <b>Product</b> entities.
 *
 * <p>
 * Extends {@link JpaRepository} to provide CRUD operations and
 * pagination for {@link Product} objects.
 * </p>
 *
 * <p>
 * Spring will automatically implement this interface at runtime.
 * </p>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    /**
     * Finds a product by its name, ignoring case.
     *
     * @param name the name of the product
     * @return an {@link Optional} containing the product if found, or empty otherwise
     */
    Optional<Product> findByNameIgnoreCase(String name);
}