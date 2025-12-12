package com.cb.backend.service;

import com.cb.backend.dto.RatingDto;
import com.cb.backend.mapper.RatingMapper;
import com.cb.backend.model.Rating;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.User;
import com.cb.backend.repository.RatingRepository;
import com.cb.backend.repository.RecipeRepository;
import com.cb.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService implements CrudService<RatingDto, Long> {
    private final RatingRepository ratingRepo;
    private final UserRepository userRepo;
    private final RecipeRepository recipeRepo;
    
    public RatingService(RatingRepository ratingRepo, UserRepository userRepo, RecipeRepository recipeRepo) {
        this.ratingRepo = ratingRepo;
        this.userRepo = userRepo;
        this.recipeRepo = recipeRepo;
    }

	@Override
	public List<RatingDto> findAll() {
        return ratingRepo.findAll().stream()
                .map(RatingMapper::toDto)
                .collect(Collectors.toList());
	}

	@Override
	public RatingDto findById(Long id) {
		return ratingRepo.findById(id)
                .map(RatingMapper::toDto)
                .orElse(null);
	}

	@Override
	public RatingDto create(RatingDto dto) {
		User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
		
		Recipe recipe = recipeRepo.findById(dto.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
		
        Rating rating = new Rating();
        RatingMapper.updateEntity(rating, dto, recipe, user);
        return RatingMapper.toDto(ratingRepo.save(rating));
	}

	@Override
	public RatingDto update(Long id, RatingDto dto) {
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
		Recipe recipe = recipeRepo.findById(dto.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
		
        Rating rating = ratingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));
        RatingMapper.updateEntity(rating, dto, recipe, user);
        return RatingMapper.toDto(ratingRepo.save(rating));
	}

	@Override
	public void deleteById(Long id) {
		ratingRepo.deleteById(id);				
	}
}