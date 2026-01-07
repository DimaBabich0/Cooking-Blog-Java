package com.cb.backend.mapper;

import com.cb.backend.dto.ProductDto;
import com.cb.backend.model.Product;

/**
 * Mapper class for converting between {@link Product} entities and {@link ProductDto} data transfer objects.
 *
 * <p>
 * Provides methods to convert a Product entity to a ProductDto and to update an existing Product
 * entity with data from a ProductDto.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class ProductMapper {
	/**
	 * Converts a {@link Product} entity to a {@link ProductDto}.
	 *
	 * @param product the entity to convert
	 * @return a ProductDto with values from the entity
	 */
    public static ProductDto toDto(Product product) {
    	ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        return dto;
    }

    /**
     * Updates an existing {@link Product} entity with data from a {@link ProductDto}.
     *
     * @param product the entity to update
     * @param dto the DTO containing new values
     */
    public static void updateEntity(Product product, ProductDto dto) {
    	product.setName(dto.getName());
    }
}
