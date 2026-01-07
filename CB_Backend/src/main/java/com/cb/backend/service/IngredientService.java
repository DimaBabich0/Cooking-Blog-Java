package com.cb.backend.service;

import com.cb.backend.dto.IngredientDto;
import com.cb.backend.mapper.IngredientMapper;
import com.cb.backend.model.Ingredient;
import com.cb.backend.model.Product;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.RecipeIngredientKey;
import com.cb.backend.repository.IngredientRepository;
import com.cb.backend.repository.ProductRepository;
import com.cb.backend.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class <b>IngredientService</b> implements {@link CrudService} for
 * {@link IngredientDto} objects.
 *
 * <p>
 * Provides CRUD operations for {@link Ingredient} entities, converting between
 * {@link Ingredient} and {@link IngredientDto} using {@link IngredientMapper}.
 * Handles associations with {@link Recipe} and {@link Product}.
 * </p>
 *
 * <p>
 * Throws {@link RuntimeException} if referenced recipe, product, or ingredient is not found.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@Service
public class IngredientService implements CrudService<IngredientDto, RecipeIngredientKey> {
	private final IngredientRepository ingredientRepo;
    private final ProductRepository productRepo;
    private final RecipeRepository recipeRepo;

    public IngredientService(
    		IngredientRepository ingredientRepo,
    		ProductRepository productRepo,
            RecipeRepository recipeRepo) {
        this.ingredientRepo = ingredientRepo;
        this.productRepo = productRepo;
        this.recipeRepo = recipeRepo;
    }
    
    /**
     * Retrieves all ingredients.
     *
     * @return list of {@link IngredientDto} representing all ingredients
     */
    @Override
    public List<IngredientDto> findAll() {
        return ingredientRepo.findAll().stream()
                .map(IngredientMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Finds an ingredient by its composite key.
     *
     * @param id the {@link RecipeIngredientKey} of the ingredient
     * @return {@link IngredientDto} of the found ingredient, or {@code null} if not found
     */
    @Override
    public IngredientDto findById(RecipeIngredientKey id) {
        return ingredientRepo.findById(id)
                .map(IngredientMapper::toDto)
                .orElse(null);
    }

    /**
     * Creates a new ingredient.
     *
     * @param dto the {@link IngredientDto} containing ingredient data
     * @return {@link IngredientDto} of the created ingredient
     * @throws RuntimeException if the associated recipe or product is not found
     */
    @Override
    public IngredientDto create(IngredientDto dto) {
        Recipe recipe = recipeRepo.findById(dto.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found: " + dto.getRecipeId()));

        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + dto.getProductId()));

        Ingredient ingredient = IngredientMapper.fromDto(dto, recipe, product);
        return IngredientMapper.toDto(ingredientRepo.save(ingredient));
    }

    /**
     * Updates an existing ingredient.
     *
     * @param id  the {@link RecipeIngredientKey} of the ingredient to update
     * @param dto the {@link IngredientDto} containing updated data
     * @return {@link IngredientDto} of the updated ingredient
     * @throws RuntimeException if the ingredient or associated product is not found
     */
    @Override
    public IngredientDto update(RecipeIngredientKey id, IngredientDto dto) {
    	Ingredient ingredient = ingredientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + dto.getProductId()));

        IngredientMapper.updateEntity(ingredient, dto, product);
        return IngredientMapper.toDto(ingredientRepo.save(ingredient));
    }

    /**
     * Deletes an ingredient by its composite key.
     *
     * @param id the {@link RecipeIngredientKey} of the ingredient to delete
     */
    @Override
    public void deleteById(RecipeIngredientKey id) {
        ingredientRepo.deleteById(id);
    }
}