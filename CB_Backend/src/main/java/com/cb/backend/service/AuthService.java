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

/**
 * Service class responsible for authentication-related operations.
 *
 * <p>
 * Provides functionality for:
 * <ul>
 *     <li>Authenticating users by username and password</li>
 *     <li>Retrieving the currently authenticated user</li>
 * </ul>
 * </p>
 *
 * <p>
 * This service uses {@link UserRepository} to access user data
 * and {@link BCrypt} for secure password verification.
 * </p>
 *
 * <p>
 * All authentication results are returned as {@link LoginResponse}
 * objects containing status, message, and user data (if applicable).
 * </p>
 * 
 * @author Artem Borisenko
 * @since 1.0
 */
@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Authenticates a user using provided login credentials.
     *
     * <p>
     * Validation steps:
     * <ul>
     *     <li>Username must not be {@code null} or empty</li>
     *     <li>Password must not be {@code null} or empty</li>
     *     <li>User must exist</li>
     *     <li>Password hash must be present</li>
     *     <li>Provided password must match stored BCrypt hash</li>
     * </ul>
     * </p>
     *
     * <p>
     * In case of validation or authentication failure,
     * a {@link LoginResponse} with {@code success = false}
     * and an appropriate message is returned.
     * </p>
     *
     * @param request login request containing username and password
     * @return {@link LoginResponse} describing the authentication result
     */
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
    
    /**
     * Retrieves the currently authenticated user by ID.
     *
     * <p>
     * Typically used after authentication when the user's ID
     * is stored in the HTTP session.
     * </p>
     *
     * @param userId ID of the authenticated user
     * @return {@link UserDto} of the user, or {@code null} if not found or invalid
     */
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
