package com.cb.backend.service;

import com.cb.backend.dto.IngredientDto;
import com.cb.backend.dto.RecipeDto;
import com.cb.backend.mapper.CategoryMapper;
import com.cb.backend.mapper.IngredientMapper;
import com.cb.backend.mapper.RecipeMapper;
import com.cb.backend.model.Category;
import com.cb.backend.model.Ingredient;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.User;
import com.cb.backend.repository.CategoryRepository;
import com.cb.backend.repository.IngredientRepository;
import com.cb.backend.repository.RecipeRepository;
import com.cb.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService implements CrudService<RecipeDto, Long> {
    private final RecipeRepository recipeRepo;
    private final UserRepository userRepo;
    private final CategoryRepository categoryRepo;
    private final IngredientRepository ingredientRepo;

    public RecipeService(
    		RecipeRepository recipeRepo,
    		UserRepository userRepo,
    		CategoryRepository categoryRepo,
    		IngredientRepository ingredientRepo) {
        this.recipeRepo = recipeRepo;
        this.userRepo = userRepo;
        this.categoryRepo = categoryRepo;
        this.ingredientRepo = ingredientRepo;
    }

	@Override
	public List<RecipeDto> findAll() {
		return recipeRepo.findAll().stream()
				.map(RecipeMapper::toDto)
				.collect(Collectors.toList());
	}

	@Override
	public RecipeDto findById(Long id) {
		return recipeRepo.findById(id)
				.map(RecipeMapper::toDto)
				.orElse(null);
	}

	@Override
	public RecipeDto create(RecipeDto dto) {
        User user = userRepo.findById(dto.getUserDto().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Category> categories = dto.getCategories().stream()
                .map(c -> categoryRepo.findById(c.getId())
                        .orElseThrow(() -> new RuntimeException("Category not found: " + c.getId())))
                .toList();
	    
     // 1) Создаём рецепт без ингредиентов
        Recipe recipe = new Recipe();
        RecipeMapper.updateEntity(recipe, dto, user, categories, new ArrayList<>());
        
        recipe = recipeRepo.save(recipe); // обязательно чтобы появился ID

        // 2) Создаём ингредиенты
        List<Ingredient> ingredients = new ArrayList<>();

        if (dto.getIngredients() != null) {
            for (IngredientDto ingredientDto : dto.getIngredients()) {
                Ingredient ingredient = IngredientMapper.fromDtoWithRecipe(ingredientDto, recipe);
                ingredients.add(ingredient);
            }
        }

        // 3) Записываем ингредиенты
        ingredientRepo.saveAll(ingredients);

        // 4) Привязываем их к рецепту и сохраняем (не обязательно, но корректно)
        recipe.getIngredients().clear();
        recipe.getIngredients().addAll(ingredients);
        return RecipeMapper.toDto(recipeRepo.save(recipe));
	}

	@Override
	public RecipeDto update(Long id, RecipeDto dto) {
		Recipe recipe = recipeRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Recipe not found"));

	    var user = userRepo.findById(dto.getUserDto().getId())
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    List<Category> categories = dto.getCategories().stream()
                .map(c -> categoryRepo.findById(c.getId())
                        .orElseThrow(() -> new RuntimeException("Category not found: " + c.getId())))
                .toList();

        // 1) Обновляем основные поля рецепта
        RecipeMapper.updateEntity(recipe, dto, user, categories, new ArrayList<>());
        recipeRepo.save(recipe);

        // 2) Удаляем старые ингредиенты (orphanRemoval = true удалит автоматом)
        recipe.getIngredients().clear();
        recipeRepo.save(recipe);

        // 3) Добавляем новые ингредиенты
        List<Ingredient> newIngredients = new ArrayList<>();

        if (dto.getIngredients() != null) {
            for (IngredientDto ingDto : dto.getIngredients()) {
                Ingredient ing = IngredientMapper.fromDtoWithRecipe(ingDto, recipe);
                newIngredients.add(ing);
            }
        }

        ingredientRepo.saveAll(newIngredients);

        // 4) Вернуть связку в объект
        recipe.getIngredients().addAll(newIngredients);
        return RecipeMapper.toDto(recipeRepo.save(recipe));
	}

	@Override
	public void deleteById(Long id) {
		recipeRepo.deleteById(id);		
	}
}