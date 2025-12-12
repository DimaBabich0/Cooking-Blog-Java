package com.cb.backend.controller;

import com.cb.backend.dto.IngredientDto;
import com.cb.backend.model.RecipeIngredientKey;
import com.cb.backend.service.IngredientService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController extends AbstractCrudController<IngredientDto, RecipeIngredientKey> {
	private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @Override
    protected CrudService<IngredientDto, RecipeIngredientKey> getService() {
        return ingredientService;
    }
}