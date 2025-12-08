package com.cb.backend.controller;

import com.cb.backend.dto.BlogDto;
import com.cb.backend.service.BlogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public List<BlogDto> getAllBlogs() {
        return blogService.findAll();
    }

    @GetMapping("/{id}")
    public BlogDto getBlog(@PathVariable("id") Long id) {
        return blogService.findById(id);
    }

    @PostMapping
    public BlogDto createBlog(@RequestBody BlogDto blog) {
        return blogService.createBlog(blog);
    }

    @PutMapping("/{id}")
    public BlogDto updateBlog(@PathVariable("id") Long id, @RequestBody BlogDto blog) {
        blog.setId(id);
    	return blogService.updateBlog(id, blog);
    }

    @DeleteMapping("/{id}")
    public void deleteBlog(@PathVariable("id") Long id) {
        blogService.deleteById(id);
    }
}
