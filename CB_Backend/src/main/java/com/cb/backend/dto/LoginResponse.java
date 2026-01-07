package com.cb.backend.dto;

/**
 * DTO representing a login response.
 *
 * <p>
 * Returned to the client after a login attempt.
 * Contains information about whether authentication was successful,
 * an optional message, and authenticated user details.
 * </p>
 * 
 * @author Artem Borisenko
 * @since 1.0
 */
public class LoginResponse {
    private boolean success;
    private String message;
    private UserDto user;

    public LoginResponse() {}

    public LoginResponse(boolean success, String message, UserDto user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }
}
