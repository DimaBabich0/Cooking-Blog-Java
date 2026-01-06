package com.cb.backend.controller;

import com.cb.backend.dto.RecipeDto;
import com.cb.backend.service.RecipeService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing {@link RecipeDto} entities.
 *
 * <p>
 * Provides standard CRUD endpoints inherited from {@link AbstractCrudController}:
 * <ul>
 *     <li>GET /api/recipes – list all recipes,</li>
 *     <li>GET /api/recipes/{id} – get a recipe by ID,</li>
 *     <li>POST /api/recipes – create a new recipe,</li>
 *     <li>PUT /api/recipes/{id} – update an existing recipe,</li>
 *     <li>DELETE /api/recipes/{id} – delete a recipe by ID.</li>
 * </ul>
 * </p>
 *
 * <p>
 * Delegates all operations to {@link RecipeService}.
 * </p>
 */
@RestController
@RequestMapping("/api/recipes")
public class RecipeController extends AbstractCrudController<RecipeDto, Long> {
	private final RecipeService recipeService;

    /**
     * Constructs a RecipeController with the provided RecipeService.
     *
     * @param recipeService the service used for recipe CRUD operations
     */
    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    /**
     * Returns the service used by this controller for CRUD operations.
     *
     * @return the {@link CrudService} for recipes
     */
    @Override
    protected CrudService<RecipeDto, Long> getService() {
        return recipeService;
    }
}