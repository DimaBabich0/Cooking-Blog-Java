package com.cb.backend.controller;

import com.cb.backend.dto.LoginRequest;
import com.cb.backend.dto.LoginResponse;
import com.cb.backend.dto.UserDto;
import com.cb.backend.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private static final String SESSION_USER_ID = "userId";

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

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

    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }

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

    @GetMapping("/check")
    public boolean checkAuth(HttpSession session) {
        Long userId = (Long) session.getAttribute(SESSION_USER_ID);
        return userId != null;
    }
}
