package com.cb.backend.mapper;

import com.cb.backend.dto.ProductDto;
import com.cb.backend.model.Product;

public class ProductMapper {
    public static ProductDto toDto(Product product) {
    	ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        return dto;
    }

    public static void updateEntity(Product product, ProductDto dto) {
    	product.setName(dto.getName());
    }
}
