package com.cb.backend.controller;

import com.cb.backend.dto.CategoryDto;
import com.cb.backend.service.CategoryService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing {@link CategoryDto} entities.
 *
 * <p>
 * Provides standard CRUD endpoints inherited from {@link AbstractCrudController}:
 * <ul>
 *     <li>GET /api/categories – list all categories,</li>
 *     <li>GET /api/categories/{id} – get a category by ID,</li>
 *     <li>POST /api/categories – create a new category,</li>
 *     <li>PUT /api/categories/{id} – update an existing category,</li>
 *     <li>DELETE /api/categories/{id} – delete a category by ID.</li>
 * </ul>
 * </p>
 *
 * <p>
 * Delegates all operations to {@link CategoryService}.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController extends AbstractCrudController<CategoryDto, Long> {
	private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Returns the service used by this controller for CRUD operations.
     *
     * @return the {@link CrudService} for categories
     */
    @Override
    protected CrudService<CategoryDto, Long> getService() {
        return categoryService;
    }
}