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
    public List<BlogDto> getAll() {
        return blogService.findAll();
    }

    @GetMapping("/{id}")
    public BlogDto getOne(@PathVariable Long id) {
        return blogService.findById(id);
    }

    @PostMapping
    public BlogDto create(@RequestBody BlogDto dto) {
        return blogService.create(dto);
    }

    @PutMapping("/{id}")
    public BlogDto update(@PathVariable Long id, @RequestBody BlogDto dto) {
        return blogService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        blogService.deleteById(id);
    }
}
