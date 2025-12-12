package com.cb.backend.service;

import com.cb.backend.dto.ProductDto;
import com.cb.backend.mapper.ProductMapper;
import com.cb.backend.model.Product;
import com.cb.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService implements CrudService<ProductDto, Long> {
    private final ProductRepository productRepo;
    
    public ProductService(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }

	@Override
	public List<ProductDto> findAll() {
		return productRepo.findAll().stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
	}

	@Override
	public ProductDto findById(Long id) {
		return productRepo.findById(id)
        		.map(ProductMapper::toDto)
        		.orElse(null);
	}

	@Override
	public ProductDto create(ProductDto dto) {
        Product product = new Product();
        ProductMapper.updateEntity(product, dto);
        return ProductMapper.toDto(productRepo.save(product));
	}

	@Override
	public ProductDto update(Long id, ProductDto dto) {
		Product product = productRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Product not found"));
		ProductMapper.updateEntity(product, dto);
	    return ProductMapper.toDto(productRepo.save(product));
	}

	@Override
	public void deleteById(Long id) {
		productRepo.deleteById(id);		
	}
}