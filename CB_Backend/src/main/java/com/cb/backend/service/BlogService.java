package com.cb.backend.service;

import com.cb.backend.dto.BlogDto;
import com.cb.backend.mapper.BlogMapper;
import com.cb.backend.model.Blog;
import com.cb.backend.model.User;
import com.cb.backend.repository.BlogRepository;
import com.cb.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    public BlogService(BlogRepository blogRepository, UserRepository userRepository) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    public List<BlogDto> findAll() {
        return blogRepository.findAll().stream()
                .map(BlogMapper::toDto)
                .collect(Collectors.toList());
    }

    public BlogDto findById(Long id) {
        return blogRepository.findById(id)
                .map(BlogMapper::toDto)
                .orElse(null);
    }

    public BlogDto create(BlogDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Blog blog = new Blog();
        BlogMapper.updateEntity(blog, dto, user);
        return BlogMapper.toDto(blogRepository.save(blog));
    }

    public BlogDto update(Long id, BlogDto dto) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        BlogMapper.updateEntity(blog, dto, user);
        return BlogMapper.toDto(blogRepository.save(blog));
    }

    public void deleteById(Long id) {
        blogRepository.deleteById(id);
    }
}
