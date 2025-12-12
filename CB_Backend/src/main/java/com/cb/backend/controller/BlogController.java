package com.cb.backend.controller;

import com.cb.backend.dto.BlogDto;
import com.cb.backend.service.BlogService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blogs")
public class BlogController extends AbstractCrudController<BlogDto, Long> {
    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @Override
    protected CrudService<BlogDto, Long> getService() {
        return blogService;
    }
}