package com.cb.backend.model;

/**
 * Enum <b>Role</b> represents user roles within the application.
 *
 * <p>
 * Roles are used to define access levels and permissions for users.
 * </p>
 *
 * <ul>
 *   <li>{@link #USER} – regular application user</li>
 *   <li>{@link #MODERATOR} – user with moderation privileges</li>
 *   <li>{@link #ADMIN} – user with full administrative access</li>
 * </ul>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
public enum Role {
    USER,        // Regular user - can only view content
    AUTHOR,      // Can create recipes and blogs (needs moderation)
    MODERATOR,   // Can moderate content
    ADMIN;       // Full access - can manage users and content
	
	/**
     * Converts a string value to a {@link Role}.
     *
     * <p>
     * The conversion is case-insensitive and ignores leading/trailing spaces.
     * </p>
     *
     * @param value string representation of the role
     * @return corresponding {@link Role} or {@code null} if the value is {@code null}
     * @throws IllegalArgumentException if the value does not match any role
     */
	public static Role fromString(String value) {
	    if (value == null) {
	        return null;
	    }
	    try {
	        return Role.valueOf(value.trim().toUpperCase());
	    } catch (Exception e) {
	        throw new IllegalArgumentException("Unknown role: " + value);
	    }
	}
	
    /**
     * Returns a string representation of the role.
     */
    @Override
    public String toString() {
        return name();
    }
}
