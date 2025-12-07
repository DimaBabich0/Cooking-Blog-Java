package com.cb.backend.model;

public enum Role {
    USER,
    MODERATOR,
    ADMIN;
	
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
}
