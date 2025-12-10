package com.cb.backend.mapper;

import com.cb.backend.dto.CategoryDto;
import com.cb.backend.model.Category;

public class CategoryMapper {
    public static CategoryDto toDto(Category category) {
    	CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setPhotoUrl(category.getPhotoUrl());
        return dto;
    }

    public static void updateEntity(Category category, CategoryDto dto) {
    	category.setName(dto.getName());
    	category.setDescription(dto.getDescription());
    	category.setPhotoUrl(dto.getPhotoUrl());
    }
}
