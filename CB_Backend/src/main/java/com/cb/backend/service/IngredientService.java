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

    @Override
    public List<IngredientDto> findAll() {
        return ingredientRepo.findAll().stream()
                .map(IngredientMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public IngredientDto findById(RecipeIngredientKey id) {
        return ingredientRepo.findById(id)
                .map(IngredientMapper::toDto)
                .orElse(null);
    }

    @Override
    public IngredientDto create(IngredientDto dto) {
        Recipe recipe = recipeRepo.findById(dto.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found: " + dto.getRecipeId()));

        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + dto.getProductId()));

        System.out.println("----------------------------------------------------");
        Ingredient ingredient = IngredientMapper.fromDto(dto, recipe, product);
//        Ingredient ingredient = IngredientMapper.toEntity(dto, recipe, product);
        System.out.println(ingredient);
        System.out.println("----------------------------------------------------");
        return IngredientMapper.toDto(ingredientRepo.save(ingredient));
    }

    @Override
    public IngredientDto update(RecipeIngredientKey id, IngredientDto dto) {
    	Ingredient ingredient = ingredientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + dto.getProductId()));

        IngredientMapper.updateEntity(ingredient, dto, product);
        return IngredientMapper.toDto(ingredientRepo.save(ingredient));
    }

    @Override
    public void deleteById(RecipeIngredientKey id) {
        ingredientRepo.deleteById(id);
    }
}