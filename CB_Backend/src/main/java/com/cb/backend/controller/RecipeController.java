package com.cb.backend.controller;

import com.cb.backend.dto.RecipeDto;
import com.cb.backend.service.RecipeService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController extends AbstractCrudController<RecipeDto, Long> {
	private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @Override
    protected CrudService<RecipeDto, Long> getService() {
        return recipeService;
    }
}