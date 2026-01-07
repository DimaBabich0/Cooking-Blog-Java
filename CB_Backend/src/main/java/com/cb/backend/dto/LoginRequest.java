package com.cb.backend.dto;

/**
 * DTO representing a login request.
 * 
 * <p>
 * Contains user credentials required for authentication.
 * This object is sent from the client to the server when
 * performing a login operation.
 * </p>
 * 
 * @author Artem Borisenko
 * @since 1.0
 */
public class LoginRequest {
    private String username;
    private String password;

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
