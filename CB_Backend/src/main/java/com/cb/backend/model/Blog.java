package com.cb.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.cb.backend.model.ContentStatus;

/**
 * Entity <b>Blog</b> represents a blog post stored in the database.
 * 
 * <p>
 * This entity is mapped to the <b>CB_BLOGS</b> table and is used to store
 * blog articles created by users. A blog post contains title, thumbnail, description,
 * article content and information about creation and update timestamps.
 * </p>
 *
 * <p>
 * Each blog post is associated with exactly one {@link User}.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@Entity
@Table(name = "CB_BLOGS")
public class Blog {
	// --- Variables ---
    /**
     * Unique identifier of the blog post.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Title of the blog post.
     * <p>Must not be {@code null}. Maximum length is 100 characters.</p>
     */
    @Column(length = 100, nullable = false)
    private String title;

    /**
     * Short description of the blog post.
     * <p>Maximum length is 100 characters.</p>
     */
    @Column(length = 100)
    private String description;
    
    /**
     * Main content of the blog post.
     * <p>
     * Must not be {@code null}.
     * Stored as a {@link Lob} to allow large amounts of text
     * (e.g. HTML, Markdown).
     * </p>
     */
    @Lob
    @Column(nullable = false)
    private String text;

    /**
     * Path to the image associated with the blog post.
     * <p>Maximum length is 255 characters.</p>
     */
    @Column(name = "photo_url", length = 255)
    private String photoUrl;
    
    /**
     * Cooking time in minutes.
     */
    @Column(name = "cooking_time")
    private Integer cookingTime;

    /**
     * Publication status of the blog post.
     * <p>Default value is {@link ContentStatus#PENDING}.</p>
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ContentStatus status = ContentStatus.PENDING;

    /**
     * Timestamp when the blog post was created.
     * <p>Automatically set before persisting the entity.</p>
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Timestamp when the blog post was last updated.
     * <p>Automatically updated before updating the entity.</p>
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- Relationships ---
    /**
     * Author of the blog post.
     * <p>
     * Many blog posts can belong to one user.
     * Loaded lazily to improve performance.
     * </p>
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // --- Methods ---
    /**
     * Called before the entity is persisted.
     * <p>
     * Initializes <b>createdAt</b> and <b>updatedAt</b>
     * with the current timestamp.
     * </p>
     */
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        if (this.status == null) {
            this.status = ContentStatus.PENDING;
        }
    }

    /**
     * Called before the entity is updated.
     * <p>
     * Updates <b>updatedAt</b> with the current timestamp.
     * </p>
     */
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Returns a string representation of the blog.
     */
    @Override
    public String toString() {
        return "Blog{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
                ", cookingTime=" + cookingTime +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", userId=" + (user != null ? user.getId() : null) +
                '}';
    }
    
    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public Integer getCookingTime() { return cookingTime; }
    public void setCookingTime(Integer cookingTime) { this.cookingTime = cookingTime; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public ContentStatus getStatus() { return status; }
    public void setStatus(ContentStatus status) { this.status = status; }
}
