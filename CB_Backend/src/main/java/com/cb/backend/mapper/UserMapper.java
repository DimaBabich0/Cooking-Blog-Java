package com.cb.backend.mapper;

import com.cb.backend.model.User;
import com.cb.backend.dto.UserDto;

public class UserMapper {

    public static UserDto toDto(User u) {
        UserDto dto = new UserDto();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setFirstName(u.getFirstName());
        dto.setLastName(u.getLastName());
        dto.setEmail(u.getEmail());
        dto.setRole(u.getRole());
        dto.setPhotoUrl(u.getPhotoUrl());
        return dto;
    }

    public static void updateEntity(User user, UserDto dto, String hash, String salt) {
        user.setUsername(dto.getUsername());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setPhotoUrl(dto.getPhotoUrl());

        if (hash != null) {
            user.setPasswordHash(hash);
        }
        if (salt != null) {
            user.setPasswordSalt(salt);
        }
    }
}
