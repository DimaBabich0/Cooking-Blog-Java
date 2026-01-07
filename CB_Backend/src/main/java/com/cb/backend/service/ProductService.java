package com.cb.backend.service;

import com.cb.backend.dto.ProductDto;
import com.cb.backend.mapper.ProductMapper;
import com.cb.backend.model.Product;
import com.cb.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class <b>ProductService</b> implements {@link CrudService} for
 * {@link ProductDto} objects.
 *
 * <p>
 * Provides CRUD operations for {@link Product} entities, mapping between
 * {@link Product} and {@link ProductDto} using {@link ProductMapper}.
 * </p>
 *
 * <p>
 * Throws {@link RuntimeException} if the product is not found when updating.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@Service
public class ProductService implements CrudService<ProductDto, Long> {
    private final ProductRepository productRepo;
    
    public ProductService(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }

    /**
     * Retrieves all products.
     *
     * @return list of {@link ProductDto} representing all products
     */
	@Override
	public List<ProductDto> findAll() {
		return productRepo.findAll().stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
	}

	/**
	 * Finds a product by its ID.
	 *
	 * @param id the identifier of the product
	 * @return {@link ProductDto} of the found product, or {@code null} if not found
	 */
	@Override
	public ProductDto findById(Long id) {
		return productRepo.findById(id)
        		.map(ProductMapper::toDto)
        		.orElse(null);
	}

	/**
	 * Creates a new product.
	 *
	 * @param dto the {@link ProductDto} containing product data
	 * @return {@link ProductDto} of the created product
	 */
	@Override
	public ProductDto create(ProductDto dto) {
        Product product = new Product();
        ProductMapper.updateEntity(product, dto);
        return ProductMapper.toDto(productRepo.save(product));
	}

	/**
	 * Updates an existing product.
	 *
	 * @param id  the identifier of the product to update
	 * @param dto the {@link ProductDto} containing updated product data
	 * @return {@link ProductDto} of the updated product
	 * @throws RuntimeException if the product is not found
	 */
	@Override
	public ProductDto update(Long id, ProductDto dto) {
		Product product = productRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Product not found"));
		ProductMapper.updateEntity(product, dto);
	    return ProductMapper.toDto(productRepo.save(product));
	}

	/**
	 * Deletes a product by its ID.
	 *
	 * @param id the identifier of the product to delete
	 */
	@Override
	public void deleteById(Long id) {
		productRepo.deleteById(id);		
	}
}