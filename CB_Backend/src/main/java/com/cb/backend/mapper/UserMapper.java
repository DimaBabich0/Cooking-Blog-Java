package com.cb.backend.mapper;

import com.cb.backend.model.Role;
import com.cb.backend.model.User;
import com.cb.backend.dto.UserDto;
import org.springframework.security.crypto.bcrypt.BCrypt;

public class UserMapper {
    public static UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        dto.setPhotoUrl(user.getPhotoUrl());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public static void updateEntity(User user, UserDto dto) {
        user.setUsername(dto.getUsername());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        if (dto.getRole() != null) {
            user.setRole(Role.fromString(dto.getRole()));
        }
        user.setPhotoUrl(dto.getPhotoUrl());
        user.setCreatedAt(dto.getCreatedAt());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            String salt = BCrypt.gensalt();
            String hash = BCrypt.hashpw(dto.getPassword(), salt);
            user.setPasswordSalt(salt);
            user.setPasswordHash(hash);
            // Test in console data:
            System.out.println("Update user data:");
            System.out.println(dto.getPassword());
            System.out.println(salt);
            System.out.println(hash);
        }
    }
}
