package com.cb.backend.controller;

import com.cb.backend.dto.ProductDto;
import com.cb.backend.service.ProductService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing {@link ProductDto} entities.
 *
 * <p>
 * Provides standard CRUD endpoints inherited from {@link AbstractCrudController}:
 * <ul>
 *     <li>GET /api/products – list all products,</li>
 *     <li>GET /api/products/{id} – get a product by ID,</li>
 *     <li>POST /api/products – create a new product,</li>
 *     <li>PUT /api/products/{id} – update an existing product,</li>
 *     <li>DELETE /api/products/{id} – delete a product by ID.</li>
 * </ul>
 * </p>
 *
 * <p>
 * Delegates all operations to {@link ProductService}.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@RestController
@RequestMapping("/api/products")
public class ProductController extends AbstractCrudController<ProductDto, Long> {
	private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Returns the service used by this controller for CRUD operations.
     *
     * @return the {@link CrudService} for products
     */
    @Override
    protected CrudService<ProductDto, Long> getService() {
        return productService;
    }
}