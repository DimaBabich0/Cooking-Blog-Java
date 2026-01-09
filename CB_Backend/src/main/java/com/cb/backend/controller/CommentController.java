package com.cb.backend.controller;

import com.cb.backend.dto.CommentDto;
import com.cb.backend.service.CommentService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for managing {@link CommentDto} entities.
 *
 * <p>
 * Provides standard CRUD endpoints inherited from {@link AbstractCrudController}:
 * <ul>
 *     <li>GET /api/comments – list all comments,</li>
 *     <li>GET /api/comments/{id} – get a comment by ID,</li>
 *     <li>POST /api/comments – create a new comment,</li>
 *     <li>PUT /api/comments/{id} – update an existing comment,</li>
 *     <li>DELETE /api/comments/{id} – delete a comment by ID.</li>
 * </ul>
 * </p>
 *
 * <p>
 * Delegates all operations to {@link CommentService}.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@RestController
@RequestMapping("/api/comments")
public class CommentController extends AbstractCrudController<CommentDto, Long> {
	private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * Returns the service used by this controller for CRUD operations.
     *
     * @return the {@link CrudService} for comments
     */
    @Override
    protected CrudService<CommentDto, Long> getService() {
        return commentService;
    }
    
    /**
     * Gets all comments for a specific recipe.
     *
     * @param recipeId the recipe ID
     * @return list of comments for the recipe
     */
    @GetMapping("/recipe/{recipeId}")
    public List<CommentDto> getCommentsByRecipe(@PathVariable("recipeId") Long recipeId) {
        return commentService.findByRecipeId(recipeId);
    }
    
    /**
     * Gets all comments for a specific blog.
     *
     * @param blogId the blog ID
     * @return list of comments for the blog
     */
    @GetMapping("/blog/{blogId}")
    public List<CommentDto> getCommentsByBlog(@PathVariable("blogId") Long blogId) {
        return commentService.findByBlogId(blogId);
    }
}