package com.cb.backend.mapper;

import com.cb.backend.dto.CommentDto;
import com.cb.backend.model.Comment;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.User;

public class CommentMapper {
    public static CommentDto toDto(Comment comment) {
    	CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setText(comment.getText());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setRecipeId(comment.getRecipe().getId());
        dto.setUserDto(UserMapper.toDto(comment.getUser()));
        return dto;
    }

    public static void updateEntity(Comment comment, CommentDto dto, Recipe recipe, User user) {
    	comment.setText(dto.getText());
    	comment.setUpdatedAt(dto.getUpdatedAt());
    	comment.setRecipe(recipe);
    	comment.setUser(user);
    }
}
