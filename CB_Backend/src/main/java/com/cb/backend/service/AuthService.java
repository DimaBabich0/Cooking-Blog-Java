package com.cb.backend.service;

import com.cb.backend.dto.LoginRequest;
import com.cb.backend.dto.LoginResponse;
import com.cb.backend.dto.UserDto;
import com.cb.backend.mapper.UserMapper;
import com.cb.backend.model.User;
import com.cb.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {
        try {
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return new LoginResponse(false, "Имя пользователя обязательно", null);
            }

            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                return new LoginResponse(false, "Пароль обязателен", null);
            }

            Optional<User> userOpt = userRepository.findAll().stream()
                    .filter(u -> u.getUsername() != null && u.getUsername().equalsIgnoreCase(request.getUsername()))
                    .findFirst();

            if (userOpt.isEmpty()) {
                return new LoginResponse(false, "Неверное имя пользователя или пароль", null);
            }

            User user = userOpt.get();

            // Проверка пароля
            if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
                return new LoginResponse(false, "Пароль не установлен для этого пользователя", null);
            }

            try {
                boolean passwordMatches = BCrypt.checkpw(request.getPassword(), user.getPasswordHash());
                if (!passwordMatches) {
                    return new LoginResponse(false, "Неверное имя пользователя или пароль", null);
                }
            } catch (IllegalArgumentException e) {
                // Если hash неправильного формата
                return new LoginResponse(false, "Ошибка проверки пароля", null);
            }

            UserDto userDto = UserMapper.toDto(user);
            return new LoginResponse(true, "Успешный вход", userDto);
        } catch (Exception e) {
            e.printStackTrace();
            return new LoginResponse(false, "Ошибка сервера: " + e.getMessage(), null);
        }
    }

    public UserDto getCurrentUser(Long userId) {
        try {
            if (userId == null) {
                return null;
            }
            return userRepository.findById(userId)
                    .map(UserMapper::toDto)
                    .orElse(null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
