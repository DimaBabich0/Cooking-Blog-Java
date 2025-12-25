package com.cb.backend.service;

import com.cb.backend.dto.IngredientDto;
import com.cb.backend.dto.RecipeDto;
import com.cb.backend.mapper.CategoryMapper;
import com.cb.backend.mapper.IngredientMapper;
import com.cb.backend.mapper.RecipeMapper;
import com.cb.backend.model.Category;
import com.cb.backend.model.Ingredient;
import com.cb.backend.model.Product;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.User;
import com.cb.backend.repository.CategoryRepository;
import com.cb.backend.repository.IngredientRepository;
import com.cb.backend.repository.ProductRepository;
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
    private final ProductRepository productRepo;
    private final IngredientRepository ingredientRepo;

    public RecipeService(
    		RecipeRepository recipeRepo,
    		UserRepository userRepo,
    		CategoryRepository categoryRepo,
    		ProductRepository productRepo,
    		IngredientRepository ingredientRepo) {
        this.recipeRepo = recipeRepo;
        this.userRepo = userRepo;
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
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

        List<Category> categories = dto.getCategoriesDto() == null
                ? List.of()
                : dto.getCategoriesDto().stream()
                    .map(c -> categoryRepo.findById(c.getId())
                        .orElseThrow(() -> new RuntimeException("Category not found: " + c.getId())))
                    .toList();

	    
        Recipe recipe = new Recipe();
        RecipeMapper.updateEntity(recipe, dto, user, categories, new ArrayList<>());
        recipeRepo.save(recipe);

        List<Ingredient> ingredients = createIngredientsForRecipe(dto, recipe);
        ingredientRepo.saveAll(ingredients);
        recipe.getIngredients().addAll(ingredients);

        return RecipeMapper.toDto(recipeRepo.save(recipe));
    }

	@Override
	public RecipeDto update(Long id, RecipeDto dto) {
		Recipe recipe = recipeRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Recipe not found"));

	    var user = userRepo.findById(dto.getUserDto().getId())
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    List<Category> categories = dto.getCategoriesDto() == null
	            ? List.of()
	            : dto.getCategoriesDto().stream()
	                .map(c -> categoryRepo.findById(c.getId())
	                    .orElseThrow(() -> new RuntimeException("Category not found: " + c.getId())))
	                .toList();

	    RecipeMapper.updateEntity(recipe, dto, user, categories, new ArrayList<>());
        recipeRepo.save(recipe);

        ingredientRepo.deleteAll(recipe.getIngredients());
        recipe.getIngredients().clear();
        recipeRepo.save(recipe);

        List<Ingredient> ingredients = createIngredientsForRecipe(dto, recipe);
        ingredientRepo.saveAll(ingredients);
        recipe.getIngredients().addAll(ingredients);

        return RecipeMapper.toDto(recipeRepo.save(recipe));
	}

	@Override
	public void deleteById(Long id) {
		recipeRepo.deleteById(id);
	}
	
	private List<Ingredient> createIngredientsForRecipe(RecipeDto dto, Recipe recipe) {
        List<Ingredient> ingredients = new ArrayList<>();

        if (dto.getIngredientsDto() != null) {
            for (IngredientDto ingredientDto : dto.getIngredientsDto()) {
                if (ingredientDto.getProductName() == null || ingredientDto.getProductName().isBlank()) {
                    throw new RuntimeException("Ingredient product name is required");
                }

                Product product = productRepo
                        .findByNameIgnoreCase(ingredientDto.getProductName().trim())
                        .orElseGet(() -> {
                            Product newProduct = new Product();
                            newProduct.setName(ingredientDto.getProductName().trim());
                            return productRepo.save(newProduct);
                        });

                Ingredient ingredient = new Ingredient();
                ingredient.setRecipe(recipe);
                ingredient.setProduct(product);
                ingredient.setQuantity(ingredientDto.getQuantity());

                ingredients.add(ingredient);
            }
        }

        return ingredients;
    }
}