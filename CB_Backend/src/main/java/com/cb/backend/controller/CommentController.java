package com.cb.backend.controller;

import com.cb.backend.dto.CommentDto;
import com.cb.backend.service.CommentService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
public class CommentController extends AbstractCrudController<CommentDto, Long> {
	private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @Override
    protected CrudService<CommentDto, Long> getService() {
        return commentService;
    }
}