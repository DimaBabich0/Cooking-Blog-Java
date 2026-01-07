package com.cb.backend.controller;

import com.cb.backend.dto.IngredientDto;
import com.cb.backend.model.RecipeIngredientKey;
import com.cb.backend.service.IngredientService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing {@link IngredientDto} entities.
 *
 * <p>
 * Provides standard CRUD endpoints inherited from {@link AbstractCrudController}:
 * <ul>
 *     <li>GET /api/ingredients – list all ingredients,</li>
 *     <li>GET /api/ingredients/{id} – get an ingredient by ID,</li>
 *     <li>POST /api/ingredients – create a new ingredient,</li>
 *     <li>PUT /api/ingredients/{id} – update an existing ingredient,</li>
 *     <li>DELETE /api/ingredients/{id} – delete an ingredient by ID.</li>
 * </ul>
 * </p>
 *
 * <p>
 * Delegates all operations to {@link IngredientService}.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@RestController
@RequestMapping("/api/ingredients")
public class IngredientController extends AbstractCrudController<IngredientDto, RecipeIngredientKey> {
	private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    /**
     * Returns the service used by this controller for CRUD operations.
     *
     * @return the {@link CrudService} for ingredients
     */
    @Override
    protected CrudService<IngredientDto, RecipeIngredientKey> getService() {
        return ingredientService;
    }
}