package com.cb.backend.controller;

import com.cb.backend.dto.BlogDto;
import com.cb.backend.model.ContentStatus;
import com.cb.backend.service.BlogService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing {@link BlogDto} entities.
 *
 * <p>
 * Provides standard CRUD endpoints inherited from {@link AbstractCrudController}:
 * <ul>
 *     <li>GET /api/blogs – list all blogs,</li>
 *     <li>GET /api/blogs/{id} – get a blog by ID,</li>
 *     <li>POST /api/blogs – create a new blog,</li>
 *     <li>PUT /api/blogs/{id} – update an existing blog,</li>
 *     <li>DELETE /api/blogs/{id} – delete a blog by ID.</li>
 * </ul>
 * </p>
 *
 * <p>
 * Delegates all operations to {@link BlogService}.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@RestController
@RequestMapping("/api/blogs")
public class BlogController extends AbstractCrudController<BlogDto, Long> {
    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    /**
     * Returns the service used by this controller for CRUD operations.
     *
     * @return the {@link CrudService} for blogs
     */
    @Override
    protected CrudService<BlogDto, Long> getService() {
        return blogService;
    }

    // Public endpoint - only returns published blogs
    @GetMapping("/public")
    public List<BlogDto> getPublishedBlogs() {
        return blogService.findAllByStatus(ContentStatus.PUBLISHED);
    }

    // Override getAll to return only published for public access
    @Override
    @GetMapping
    public List<BlogDto> getAll() {
        // For now, return all (admin panel needs all statuses)
        // In production, you might want to check user role here
        return blogService.findAll();
    }
}