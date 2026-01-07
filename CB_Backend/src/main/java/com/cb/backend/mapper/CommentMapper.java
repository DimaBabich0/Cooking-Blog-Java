package com.cb.backend.mapper;

import com.cb.backend.dto.CommentDto;
import com.cb.backend.model.Comment;
import com.cb.backend.model.Recipe;
import com.cb.backend.model.User;

/**
 * Mapper class for converting between {@link Comment} entities and {@link CommentDto} data transfer objects.
 *
 * <p>
 * Provides methods to convert a Comment entity to a CommentDto and to update an existing Comment
 * entity with data from a CommentDto.
 * </p>
 *
 * <p>
 * Handles relationships with {@link User} and {@link Recipe} entities.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class CommentMapper {
	/**
	 * Converts a {@link Comment} entity to a {@link CommentDto}.
	 *
	 * @param comment the entity to convert
	 * @return a CommentDto with values from the entity, including user and recipe IDs
	 */
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

    /**
     * Updates an existing {@link Comment} entity with data from a {@link CommentDto}.
     *
     * @param comment the entity to update
     * @param dto the DTO containing new values
     * @param recipe the {@link Recipe} entity associated with the comment
     * @param user the {@link User} entity who made the comment
     */
    public static void updateEntity(Comment comment, CommentDto dto, Recipe recipe, User user) {
    	comment.setText(dto.getText());
    	comment.setUpdatedAt(dto.getUpdatedAt());
    	comment.setRecipe(recipe);
    	comment.setUser(user);
    }
}
