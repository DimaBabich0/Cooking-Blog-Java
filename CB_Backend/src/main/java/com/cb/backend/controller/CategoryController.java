package com.cb.backend.controller;

import com.cb.backend.dto.CategoryDto;
import com.cb.backend.service.CategoryService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class CategoryController extends AbstractCrudController<CategoryDto, Long> {
	private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Override
    protected CrudService<CategoryDto, Long> getService() {
        return categoryService;
    }
}