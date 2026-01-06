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
import com.cb.backend.model.RecipeIngredientKey;
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
        try {
            System.out.println("Creating recipe with DTO: " + dto);
            
            if (dto.getUserDto() == null || dto.getUserDto().getId() == null) {
                throw new RuntimeException("User ID is required");
            }
            
            User user = userRepo.findById(dto.getUserDto().getId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserDto().getId()));

            List<Category> categories = dto.getCategoriesDto() == null
                    ? List.of()
                    : dto.getCategoriesDto().stream()
                        .map(c -> {
                            if (c.getId() == null) {
                                throw new RuntimeException("Category ID is required");
                            }
                            return categoryRepo.findById(c.getId())
                                .orElseThrow(() -> new RuntimeException("Category not found: " + c.getId()));
                        })
                        .toList();

            Recipe recipe = new Recipe();
            RecipeMapper.updateEntity(recipe, dto, user, categories, new ArrayList<>());
            // Сохраняем рецепт сначала, чтобы получить ID
            recipe = recipeRepo.save(recipe);

            // Теперь создаем ингредиенты с привязкой к сохраненному рецепту
            List<Ingredient> ingredients = createIngredientsForRecipe(dto, recipe);
            if (!ingredients.isEmpty()) {
                try {
                    System.out.println("Adding " + ingredients.size() + " ingredients to recipe ID: " + recipe.getId());
                    // Добавляем ингредиенты в коллекцию рецепта
                    // Благодаря cascade = CascadeType.ALL, они сохранятся автоматически при сохранении рецепта
                    for (Ingredient ingredient : ingredients) {
                        recipe.getIngredients().add(ingredient);
                    }
                    // Сохраняем рецепт - ингредиенты сохранятся каскадно
                    recipe = recipeRepo.save(recipe);
                    System.out.println("Successfully saved recipe with ingredients");
                    
                    // Проверяем, что ингредиенты действительно сохранились
                    final Long recipeId = recipe.getId(); // Сохраняем ID в final переменную для использования в лямбде
                    List<Ingredient> savedIngredients = ingredientRepo.findAll().stream()
                        .filter(ing -> ing.getId().getRecipeId().equals(recipeId))
                        .toList();
                    System.out.println("Verified: " + savedIngredients.size() + " ingredients found in database for recipe ID: " + recipeId);
                } catch (Exception e) {
                    System.err.println("Error saving ingredients for recipe ID " + recipe.getId() + ": " + e.getMessage());
                    e.printStackTrace();
                    // Выбрасываем исключение с понятным сообщением
                    String errorMsg = "Ошибка при сохранении ингредиентов: " + 
                        (e.getCause() != null ? e.getCause().getMessage() : e.getMessage());
                    throw new RuntimeException(errorMsg, e);
                }
            }

            return RecipeMapper.toDto(recipe);
        } catch (RuntimeException e) {
            System.err.println("Error creating recipe: " + e.getMessage());
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected error creating recipe: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error creating recipe: " + e.getMessage(), e);
        }
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

        if (dto.getIngredientsDto() != null && !dto.getIngredientsDto().isEmpty()) {
            // Рецепт должен быть уже сохранен, чтобы иметь ID
            if (recipe.getId() == null) {
                throw new RuntimeException("Recipe must be saved before creating ingredients");
            }
            
            for (IngredientDto ingredientDto : dto.getIngredientsDto()) {
                if (ingredientDto.getProductName() == null || ingredientDto.getProductName().isBlank()) {
                    throw new RuntimeException("Ingredient product name is required");
                }

                Product product = productRepo
                        .findByNameIgnoreCase(ingredientDto.getProductName().trim())
                        .orElseGet(() -> {
                            Product newProduct = new Product();
                            newProduct.setName(ingredientDto.getProductName().trim());
                            Product saved = productRepo.save(newProduct);
                            System.out.println("Created new product: " + saved.getId() + " - " + saved.getName());
                            return saved;
                        });

                if (product.getId() == null) {
                    throw new RuntimeException("Product ID is null after save for: " + ingredientDto.getProductName());
                }

                // Создаем ключ с ID рецепта и продукта
                RecipeIngredientKey key = new RecipeIngredientKey(recipe.getId(), product.getId());
                System.out.println("Creating ingredient with key: recipeId=" + recipe.getId() + ", productId=" + product.getId());
                
                Ingredient ingredient = new Ingredient();
                ingredient.setId(key);
                ingredient.setRecipe(recipe);
                ingredient.setProduct(product);
                
                // Quantity обязателен, используем 0 по умолчанию если не указан
                if (ingredientDto.getQuantity() != null) {
                    ingredient.setQuantity(ingredientDto.getQuantity());
                } else {
                    ingredient.setQuantity(0.0);
                }
                
                if (ingredientDto.getUnit() != null && !ingredientDto.getUnit().isBlank()) {
                    ingredient.setUnit(ingredientDto.getUnit());
                }

                ingredients.add(ingredient);
            }
        }

        return ingredients;
    }
}