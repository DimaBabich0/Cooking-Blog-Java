package com.cb.backend.controller;

import com.cb.backend.dto.RecipeDto;
import com.cb.backend.model.ContentStatus;
import com.cb.backend.service.RecipeService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@RestController
@RequestMapping("/api/recipes")
public class RecipeController extends AbstractCrudController<RecipeDto, Long> {
	private final RecipeService recipeService;

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

    // Public endpoint - only returns published recipes
    @GetMapping("/public")
    public List<RecipeDto> getPublishedRecipes() {
        return recipeService.findAllByStatus(ContentStatus.PUBLISHED);
    }

    // Override getAll to return only published for public access
    // Admin endpoints should use /api/recipes/all or similar
    @Override
    @GetMapping
    public List<RecipeDto> getAll() {
        // For now, return all (admin panel needs all statuses)
        // In production, you might want to check user role here
        return recipeService.findAll();
    }
}