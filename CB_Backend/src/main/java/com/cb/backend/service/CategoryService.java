package com.cb.backend.service;

import com.cb.backend.dto.CategoryDto;
import com.cb.backend.mapper.CategoryMapper;
import com.cb.backend.model.Category;
import com.cb.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService implements CrudService<CategoryDto, Long> {
    private final CategoryRepository categoryRepo;

    public CategoryService(CategoryRepository categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

	@Override
	public List<CategoryDto> findAll() {
		return categoryRepo.findAll().stream()
				.map(CategoryMapper::toDto)
				.collect(Collectors.toList());
	}

	@Override
	public CategoryDto findById(Long id) {
		return categoryRepo.findById(id)
				.map(CategoryMapper::toDto)
				.orElse(null);
	}

	@Override
	public CategoryDto create(CategoryDto dto) {
		Category category = new Category();
		CategoryMapper.updateEntity(category, dto);
		return CategoryMapper.toDto(categoryRepo.save(category));
	}

	@Override
	public CategoryDto update(Long id, CategoryDto dto) {
		Category category = categoryRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Category not found"));
		CategoryMapper.updateEntity(category, dto);
	    return CategoryMapper.toDto(categoryRepo.save(category));
	}

	@Override
	public void deleteById(Long id) {
		categoryRepo.deleteById(id);
	}
}