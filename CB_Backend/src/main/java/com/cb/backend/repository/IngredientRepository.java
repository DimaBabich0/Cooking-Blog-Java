package com.cb.backend.repository;

import com.cb.backend.model.Ingredient;
import com.cb.backend.model.RecipeIngredientKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for <b>Ingredient</b> entities.
 *
 * <p>
 * Extends {@link JpaRepository} to provide CRUD operations, pagination, and
 * other JPA functionalities for {@link Ingredient} objects.
 * Each ingredient is uniquely identified by a {@link RecipeIngredientKey}.
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
public interface IngredientRepository extends JpaRepository<Ingredient, RecipeIngredientKey> {
}