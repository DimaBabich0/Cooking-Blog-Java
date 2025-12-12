package com.cb.backend.controller;

import com.cb.backend.dto.ProductDto;
import com.cb.backend.service.ProductService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController extends AbstractCrudController<ProductDto, Long> {
	private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @Override
    protected CrudService<ProductDto, Long> getService() {
        return productService;
    }
}