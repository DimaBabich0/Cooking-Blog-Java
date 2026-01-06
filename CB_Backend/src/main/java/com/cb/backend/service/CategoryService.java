package com.cb.backend.service;

import com.cb.backend.dto.CategoryDto;
import com.cb.backend.mapper.CategoryMapper;
import com.cb.backend.model.Category;
import com.cb.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class <b>CategoryService</b> implements {@link CrudService} for
 * {@link CategoryDto} objects.
 *
 * <p>
 * Provides CRUD operations for {@link Category} entities, converting between
 * {@link Category} and {@link CategoryDto} using {@link CategoryMapper}.
 * </p>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
@Service
public class CategoryService implements CrudService<CategoryDto, Long> {
    private final CategoryRepository categoryRepo;

    public CategoryService(CategoryRepository categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    /**
     * Retrieves all categories.
     *
     * @return list of {@link CategoryDto} representing all categories
     */
	@Override
	public List<CategoryDto> findAll() {
		return categoryRepo.findAll().stream()
				.map(CategoryMapper::toDto)
				.collect(Collectors.toList());
	}
	
	/**
	 * Finds a category by its ID.
	 *
	 * @param id the identifier of the category
	 * @return {@link CategoryDto} of the found category, or {@code null} if not found
	 */
	@Override
	public CategoryDto findById(Long id) {
		return categoryRepo.findById(id)
				.map(CategoryMapper::toDto)
				.orElse(null);
	}

	/**
	 * Creates a new category.
	 *
	 * @param dto the {@link CategoryDto} containing category data
	 * @return {@link CategoryDto} of the created category
	 */
	@Override
	public CategoryDto create(CategoryDto dto) {
		Category category = new Category();
		CategoryMapper.updateEntity(category, dto);
		return CategoryMapper.toDto(categoryRepo.save(category));
	}

	/**
	 * Updates an existing category.
	 *
	 * @param id  the identifier of the category to update
	 * @param dto the {@link CategoryDto} containing updated data
	 * @return {@link CategoryDto} of the updated category
	 * @throws RuntimeException if the category is not found
	 */
	@Override
	public CategoryDto update(Long id, CategoryDto dto) {
		Category category = categoryRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Category not found"));
		CategoryMapper.updateEntity(category, dto);
	    return CategoryMapper.toDto(categoryRepo.save(category));
	}


	/**
	 * Deletes a category by its ID.
	 *
	 * @param id the identifier of the category to delete
	 */
	@Override
	public void deleteById(Long id) {
		categoryRepo.deleteById(id);
	}
}