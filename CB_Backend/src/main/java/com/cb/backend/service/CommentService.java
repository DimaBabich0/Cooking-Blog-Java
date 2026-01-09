package com.cb.backend.service;

import com.cb.backend.dto.CommentDto;
import com.cb.backend.mapper.CommentMapper;
import com.cb.backend.model.Comment;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.Blog;
import com.cb.backend.model.User;
import com.cb.backend.repository.CommentRepository;
import com.cb.backend.repository.RecipeRepository;
import com.cb.backend.repository.BlogRepository;
import com.cb.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class <b>CommentService</b> implements {@link CrudService} for
 * {@link CommentDto} objects.
 *
 * <p>
 * Provides CRUD operations for {@link Comment} entities, mapping between
 * {@link Comment} and {@link CommentDto} using {@link CommentMapper}.
 * Handles associations with {@link User} and {@link Recipe}.
 * </p>
 *
 * <p>
 * Throws {@link RuntimeException} if referenced user, recipe, or comment is not found.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@Service
public class CommentService implements CrudService<CommentDto, Long> {
    private final CommentRepository commentRepo;
    private final RecipeRepository recipeRepo;
    private final BlogRepository blogRepo;
    private final UserRepository userRepo;
    
    public CommentService(CommentRepository commentRepo, RecipeRepository recipeRepo, BlogRepository blogRepo, UserRepository userRepo) {
        this.commentRepo = commentRepo;
        this.recipeRepo = recipeRepo;
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
    }

    /**
     * Retrieves all comments.
     *
     * @return list of {@link CommentDto} representing all comments
     */
	@Override
	public List<CommentDto> findAll() {
		return commentRepo.findAll().stream()
                .map(CommentMapper::toDto)
                .collect(Collectors.toList());
	}

	/**
	 * Finds a comment by its ID.
	 *
	 * @param id the identifier of the comment
	 * @return {@link CommentDto} of the found comment, or {@code null} if not found
	 */
	@Override
	public CommentDto findById(Long id) {
		return commentRepo.findById(id)
                .map(CommentMapper::toDto)
                .orElse(null);
	}

	/**
	 * Creates a new comment.
	 *
	 * @param dto the {@link CommentDto} containing comment data
	 * @return {@link CommentDto} of the created comment
	 * @throws RuntimeException if the associated recipe or user is not found
	 */
	@Override
	public CommentDto create(CommentDto dto) {
		User user = userRepo.findById(dto.getUserDto().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
		
		Recipe recipe = null;
		Blog blog = null;
		
		if (dto.getRecipeId() != null) {
			recipe = recipeRepo.findById(dto.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
		} else if (dto.getBlogId() != null) {
			blog = blogRepo.findById(dto.getBlogId())
                .orElseThrow(() -> new RuntimeException("Blog not found"));
		} else {
			throw new RuntimeException("Either recipeId or blogId must be provided");
		}
		
		Comment comment = new Comment();
		CommentMapper.updateEntity(comment, dto, recipe, blog, user);
        return CommentMapper.toDto(commentRepo.save(comment));
	}


	/**
	 * Updates an existing comment.
	 *
	 * @param id  the identifier of the comment to update
	 * @param dto the {@link CommentDto} containing updated comment data
	 * @return {@link CommentDto} of the updated comment
	 * @throws RuntimeException if the comment, associated recipe, or user is not found
	 */
	@Override
	public CommentDto update(Long id, CommentDto dto) {
		User user = userRepo.findById(dto.getUserDto().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
		Recipe recipe = null;
		Blog blog = null;
		
		if (dto.getRecipeId() != null) {
			recipe = recipeRepo.findById(dto.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
		} else if (dto.getBlogId() != null) {
			blog = blogRepo.findById(dto.getBlogId())
                .orElseThrow(() -> new RuntimeException("Blog not found"));
		} else {
			throw new RuntimeException("Either recipeId or blogId must be provided");
		}
        
		Comment comment = commentRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Comment not found"));
		CommentMapper.updateEntity(comment, dto, recipe, blog, user);
        return CommentMapper.toDto(commentRepo.save(comment));
	}


	/**
	 * Deletes a comment by its ID.
	 *
	 * @param id the identifier of the comment to delete
	 */
	@Override
	public void deleteById(Long id) {
		commentRepo.deleteById(id);
	}
	
	/**
	 * Finds all comments for a specific recipe.
	 *
	 * @param recipeId the recipe ID
	 * @return list of comments for the recipe
	 */
	public List<CommentDto> findByRecipeId(Long recipeId) {
		return commentRepo.findByRecipeId(recipeId).stream()
				.map(CommentMapper::toDto)
				.collect(Collectors.toList());
	}
	
	/**
	 * Finds all comments for a specific blog.
	 *
	 * @param blogId the blog ID
	 * @return list of comments for the blog
	 */
	public List<CommentDto> findByBlogId(Long blogId) {
		return commentRepo.findByBlogId(blogId).stream()
				.map(CommentMapper::toDto)
				.collect(Collectors.toList());
	}
}