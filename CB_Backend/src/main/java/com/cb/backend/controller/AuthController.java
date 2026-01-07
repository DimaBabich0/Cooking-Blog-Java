package com.cb.backend.controller;

import com.cb.backend.dto.LoginRequest;
import com.cb.backend.dto.LoginResponse;
import com.cb.backend.dto.UserDto;
import com.cb.backend.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication and session
 * user management.
 *
 * <p>
 * Provides endpoints for:
 * <ul>
 *     <li>GET /api/auth/me – get info about the user,</li>
 *     <li>GET /api/auth/check – checks if the user is currently authenticated,</li>
 *     <li>POST /api/auth/login – authenticates the user and store user's ID,</li>
 *     <li>POST /api/auth/logout – logs out the user by invalidating the session.</li>
 * </ul>
 * </p>
 *
 * <p>
 * Authentication is implemented using sessions.
 * After a successful login, the user's ID is stored in the session
 * and used to identify the authenticated user in subsequent requests.
 * </p>
 * 
 * @author Artem Borisenko
 * @since 1.0
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    /**
     * Session attribute key used to store the authenticated user's ID.
     */
    private static final String SESSION_USER_ID = "userId";

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Authenticates a user using provided credentials.
     *
     * <p>
     * On successful authentication, the user's ID is stored
     * in the HTTP session to maintain authentication state.
     * </p>
     *
     * @param request login request containing user credentials
     * @param session HTTP session used to store authentication data
     * @return {@link LoginResponse} indicating success or failure
     */
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request, HttpSession session) {
        try {
            LoginResponse response = authService.login(request);
            
            if (response.isSuccess() && response.getUser() != null) {
                // Сохраняем ID пользователя в сессии
                session.setAttribute(SESSION_USER_ID, response.getUser().getId());
            }
            
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return new LoginResponse(false, "Ошибка сервера: " + e.getMessage(), null);
        }
    }

    /**
     * Logs out the current user.
     *
     * <p>
     * Invalidates the current HTTP session, removing all
     * stored authentication data.
     * </p>
     *
     * @param session current HTTP session
     */
    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }

    /**
     * Retrieves the currently authenticated user.
     *
     * <p>
     * If no user is authenticated, this method returns {@code null}.
     * The frontend is responsible for handling unauthenticated state.
     * </p>
     *
     * @param session HTTP session containing authentication data
     * @return {@link UserDto} of the authenticated user, or {@code null}
     */
    @GetMapping("/me")
    public UserDto getCurrentUser(HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute(SESSION_USER_ID);
            if (userId == null) {
                return null; // Вернет 200 с null, frontend обработает
            }
            return authService.getCurrentUser(userId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Checks whether a user is currently authenticated.
     *
     * @param session HTTP session containing authentication data
     * @return {@code true} if the user is authenticated, {@code false} otherwise
     */
    @GetMapping("/check")
    public boolean checkAuth(HttpSession session) {
        Long userId = (Long) session.getAttribute(SESSION_USER_ID);
        return userId != null;
    }
}
