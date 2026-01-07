package com.cb.backend.model;

public enum ContentStatus {
    PENDING,    // Awaiting moderation
    PUBLISHED,  // Approved and published
    REJECTED;   // Rejected by moderator
    
    public static ContentStatus fromString(String value) {
        if (value == null) {
            return PENDING; // Default status
        }
        try {
            return ContentStatus.valueOf(value.trim().toUpperCase());
        } catch (Exception e) {
            return PENDING; // Default to PENDING if invalid
        }
    }
}
