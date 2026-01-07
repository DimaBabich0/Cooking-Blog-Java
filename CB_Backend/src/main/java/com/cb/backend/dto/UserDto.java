package com.cb.backend.dto;

import java.time.LocalDate;

/**
 * DTO representing a {@link com.cb.backend.model.User} entity.
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public class UserDto {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String photoUrl;
    private String password;
    private LocalDate createdAt;

    // --- Methods ---
    @Override
    public String toString() {
        return "UserDto{" +
                "id=" + id +
                ", username=" + username  +
                ", firstName=" + firstName  +
                ", lastName=" + lastName  +
                ", email=" + email  +
                ", password=" + password  +
                ", role=" + role  +
                ", photoUrl='" + photoUrl + '\'' +
                ", createdAt='" + createdAt + '\'' +
                '}';
    }
    
    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
