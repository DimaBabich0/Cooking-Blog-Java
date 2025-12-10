package com.cb.backend.mapper;

import com.cb.backend.dto.BlogDto;
import com.cb.backend.model.Blog;
import com.cb.backend.model.User;

public class BlogMapper {
    public static BlogDto toDto(Blog blog) {
        BlogDto dto = new BlogDto();
        dto.setId(blog.getId());
        dto.setUserId(blog.getUser() != null ? blog.getUser().getId() : null);
        dto.setUsername(blog.getUser() != null ? blog.getUser().getUsername() : null);
        dto.setPhotoUrl(blog.getPhotoUrl());
        dto.setTitle(blog.getTitle());
        dto.setText(blog.getText());
        dto.setDescription(blog.getDescription());
        dto.setCookingTime(blog.getCookingTime());
        dto.setCreatedAt(blog.getCreatedAt());
        dto.setUpdatedAt(blog.getUpdatedAt());
        return dto;
    }

    public static void updateEntity(Blog blog, BlogDto dto, User user) {
        blog.setPhotoUrl(dto.getPhotoUrl());
        blog.setTitle(dto.getTitle());
        blog.setUser(user);
        blog.setText(dto.getText());
        blog.setDescription(dto.getDescription());
        blog.setCookingTime(dto.getCookingTime());
        blog.setUpdatedAt(dto.getUpdatedAt());
    }
}
