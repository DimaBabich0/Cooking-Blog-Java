package com.cb.backend.controller;

import com.cb.backend.dto.CommentDto;
import com.cb.backend.service.CommentService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}