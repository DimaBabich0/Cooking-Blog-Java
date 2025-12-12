package com.cb.backend.repository;

import com.cb.backend.model.Ingredient;
import com.cb.backend.model.RecipeIngredientKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, RecipeIngredientKey> {
}