package com.cb.backend.mapper;

import com.cb.backend.dto.CategoryDto;
import com.cb.backend.model.Category;

/**
 * Mapper class for converting between {@link Category} entities and {@link CategoryDto} data transfer objects.
 *
 * <p>
 * Provides methods to convert a Category entity to a CategoryDto and to update an existing Category
 * entity with data from a CategoryDto.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class CategoryMapper {
	/**
	 * Converts a {@link Category} entity to a {@link CategoryDto}.
	 *
	 * @param category the entity to convert
	 * @return a CategoryDto with values from the entity
	 */
    public static CategoryDto toDto(Category category) {
    	CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setPhotoUrl(category.getPhotoUrl());
        return dto;
    }

    /**
     * Updates an existing {@link Category} entity with data from a {@link CategoryDto}.
     *
     * @param category the entity to update
     * @param dto the DTO containing new values
     */
    public static void updateEntity(Category category, CategoryDto dto) {
    	category.setName(dto.getName());
    	category.setDescription(dto.getDescription());
    	category.setPhotoUrl(dto.getPhotoUrl());
    }
}
