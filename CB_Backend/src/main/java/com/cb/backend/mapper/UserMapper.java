package com.cb.backend.mapper;

import com.cb.backend.model.Role;
import com.cb.backend.model.User;
import com.cb.backend.dto.UserDto;

import java.util.Random;

import org.springframework.security.crypto.bcrypt.BCrypt;

/**
 * Mapper class for converting between {@link User} entities and {@link UserDto} data transfer objects.
 *
 * <p>
 * Provides methods to convert a User entity to a UserDto and to update an existing User
 * entity with data from a UserDto.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class UserMapper {
	/**
	 * Converts a {@link User} entity to a {@link UserDto}.
	 *
	 * @param user the entity to convert
	 * @return a UserDto containing values from the entity
	 */
    public static UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername() != null ? user.getUsername() : "");
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail() != null ? user.getEmail() : "");
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        dto.setPhotoUrl(user.getPhotoUrl());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    /**
     * Updates an existing {@link User} entity with data from a {@link UserDto}.
     *
     * <p>
     * Sets username, name, email, role (default USER if missing), photo URL (default random avatar if missing),
     * creation date, and password (hashed with BCrypt if provided).
     * </p>
     *
     * @param user the entity to update
     * @param dto the DTO containing new values
     */
    public static void updateEntity(User user, UserDto dto) {
        user.setUsername(dto.getUsername());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        
        // For new users (id is null), always set USER role regardless of what's in DTO
        // For existing users, only update role if explicitly provided and user has permission
        if (user.getId() == null) {
            // New user - always USER role for security
            user.setRole(Role.USER);
        } else {
            // Existing user - only update role if provided, otherwise keep current role
            if (dto.getRole() != null && !dto.getRole().isEmpty()) {
                user.setRole(Role.fromString(dto.getRole()));
            }
            // If role not provided, keep existing role
        }
        
        // Set random photo or the uploaded photo
        if (dto.getPhotoUrl() == null || dto.getPhotoUrl().isEmpty()) {
        	Random r = new Random();
            user.setPhotoUrl("avatars/default_avatar_0" + r.nextInt(5) + ".jpg");
        } else {
            user.setPhotoUrl(dto.getPhotoUrl());
        }
        
        user.setCreatedAt(dto.getCreatedAt());

        // Generate salt and hash the password using BCrypt
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            String salt = BCrypt.gensalt();
            String hash = BCrypt.hashpw(dto.getPassword(), salt);
            user.setPasswordSalt(salt);
            user.setPasswordHash(hash);
        }
    }
}
