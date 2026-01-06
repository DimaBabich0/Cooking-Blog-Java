package com.cb.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entity <b>User</b> represents an application user.
 *
 * <p>
 * This entity is mapped to the <b>CB_USERS</b> table and is used to store
 * authentication and profile information such as username, email,
 * password data, role, profile image, and creation date.
 * </p>
 *
 * <p>
 * Each user has exactly one {@link Role} that defines access level
 * within the application.
 * </p>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
@Entity
@Table(name = "CB_USERS")
public class User {
	// --- Variables ---
	/**
     * Unique identifier of the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique username of the user.
     * <p>Must not be {@code null}. Maximum length is 30 characters.</p>
     */
    @Column(unique = true, length = 30, nullable = false)
    private String username;

    /**
     * First name of the user.
     * <p>Maximum length is 30 characters.</p>
     */
    @Column(name = "first_name", length = 30)
    private String firstName;

    /**
     * Last name of the user.
     * <p>Maximum length is 30 characters.</p>
     */
    @Column(name = "last_name", length = 30)
    private String lastName;

    /**
     * Email address of the user.
     * <p>
     * Must not be {@code null} and must be unique.
     * Maximum length is 100 characters.
     * </p>
     */
    @Column(unique = true, length = 100, nullable = false)
    private String email;

    /**
     * Hashed password of the user.
     */
    @Column(name = "password_hash", length = 255, nullable = false)
    private String passwordHash;

    /**
     * Salt used for hashing the password.
     */
    @Column(name = "password_salt", length = 255)
    private String passwordSalt;

    /**
     * Role assigned to the user.
     */
    @Column(nullable = false)
    private Role role;

    /**
     * Path to the user's profile image.
     * <p>Maximum length is 255 characters.</p>
     */
    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    /**
     * Date when the user account was created.
     * <p>Automatically set before persisting the entity.</p>
     */
    @Column(name = "created_at")
    private LocalDate createdAt;

    // --- Methods ---
    /**
     * Called before the entity is persisted.
     * <p>
     * Initializes {@code createdAt} with the current date.
     * </p>
     */
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDate.now();
    }

    /**
     * Returns a string representation of the user.
     * <p>
     * Sensitive data such as passwords is not included.
     * </p>
     */
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                ", createdAt=" + createdAt +
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

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getPasswordSalt() { return passwordSalt; }
    public void setPasswordSalt(String passwordSalt) { this.passwordSalt = passwordSalt; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
