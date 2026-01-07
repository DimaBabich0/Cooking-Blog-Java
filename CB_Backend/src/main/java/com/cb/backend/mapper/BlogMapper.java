package com.cb.backend.mapper;

import com.cb.backend.dto.BlogDto;
import com.cb.backend.model.Blog;
import com.cb.backend.model.User;
import com.cb.backend.model.ContentStatus;

/**
 * Mapper class for converting between {@link Blog} entities and {@link BlogDto} data transfer objects.
 *
 * <p>
 * Provides methods to convert a Blog entity to a BlogDto and to update an existing Blog entity
 * with data from a BlogDto.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class BlogMapper {
    /**
     * Converts a {@link Blog} entity to a {@link BlogDto}.
     *
     * @param blog the {@link Blog} entity to convert
     * @return a {@link BlogDto} containing data from the Blog entity
     */
    public static BlogDto toDto(Blog blog) {
        BlogDto dto = new BlogDto();
        dto.setId(blog.getId());
        dto.setUserDto(blog.getUser() != null ? UserMapper.toDto(blog.getUser()) : null);
        dto.setPhotoUrl(blog.getPhotoUrl());
        dto.setTitle(blog.getTitle());
        dto.setText(blog.getText());
        dto.setDescription(blog.getDescription());
        dto.setCookingTime(blog.getCookingTime());
        dto.setStatus(blog.getStatus() != null ? blog.getStatus().name() : ContentStatus.PENDING.name());
        dto.setCreatedAt(blog.getCreatedAt());
        dto.setUpdatedAt(blog.getUpdatedAt());
        return dto;
    }

    /**
     * Updates an existing {@link Blog} entity with data from a {@link BlogDto}.
     *
     * @param blog the {@link Blog} entity to update
     * @param dto the {@link BlogDto} containing new values
     * @param user the {@link User} entity to set as the author of the blog
     */
    public static void updateEntity(Blog blog, BlogDto dto, User user) {
        blog.setPhotoUrl(dto.getPhotoUrl());
        blog.setTitle(dto.getTitle());
        blog.setUser(user);
        blog.setText(dto.getText());
        blog.setDescription(dto.getDescription());
        blog.setCookingTime(dto.getCookingTime());
        if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            blog.setStatus(ContentStatus.fromString(dto.getStatus()));
        } else if (blog.getStatus() == null) {
            blog.setStatus(ContentStatus.PENDING);
        }
        blog.setUpdatedAt(dto.getUpdatedAt());
    }
}
