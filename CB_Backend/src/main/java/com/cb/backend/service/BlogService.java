package com.cb.backend.service;

import com.cb.backend.dto.BlogDto;
import com.cb.backend.mapper.BlogMapper;
import com.cb.backend.model.Blog;
import com.cb.backend.model.User;
import com.cb.backend.repository.BlogRepository;
import com.cb.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class <b>BlogService</b> implements {@link CrudService} for
 * {@link BlogDto} objects.
 *
 * <p>
 * Provides CRUD operations for {@link Blog} entities, converting between
 * {@link Blog} and {@link BlogDto} using {@link BlogMapper}.
 * </p>
 *
 * <p>
 * Handles association with {@link User} for creating and updating blog posts.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@Service
public class BlogService implements CrudService<BlogDto, Long> {
    private final BlogRepository blogRepo;
    private final UserRepository userRepo;
    
    public BlogService(BlogRepository blogRepo, UserRepository userRepo) {
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
    }
    
    /**
     * Retrieves all blog posts.
     *
     * @return list of {@link BlogDto} representing all blogs
     */
	@Override
	public List<BlogDto> findAll() {
		return findAllByStatus(null); // null means all statuses
	}

	/**
	 * Retrieves blog posts filtered by status.
	 *
	 * @param status the content status to filter by, or {@code null} for all statuses
	 * @return list of {@link BlogDto} representing filtered blogs
	 */
	public List<BlogDto> findAllByStatus(com.cb.backend.model.ContentStatus status) {
		List<com.cb.backend.model.Blog> blogs;
		if (status != null) {
			blogs = blogRepo.findAllByStatus(status);
		} else {
			blogs = blogRepo.findAll();
		}
		return blogs.stream()
				.map(BlogMapper::toDto)
				.collect(Collectors.toList());
	}

    /**
     * Finds a blog post by its ID.
     *
     * @param id the identifier of the blog
     * @return {@link BlogDto} of the found blog, or {@code null} if not found
     */
    @Override
    public BlogDto findById(Long id) {
        return blogRepo.findById(id)
                .map(BlogMapper::toDto)
                .orElse(null);
    }

    /**
     * Creates a new blog post.
     *
     * <p>
     * Retrieves the associated {@link User} by ID and maps the provided
     * {@link BlogDto} to a new {@link Blog} entity.
     * </p>
     *
     * @param dto the {@link BlogDto} containing blog data
     * @return {@link BlogDto} of the created blog
     * @throws RuntimeException if the associated user is not found
     */
    @Override
    public BlogDto create(BlogDto dto) {
        User user = userRepo.findById(dto.getUserDto().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user has permission to create content
        if (user.getRole() == null || 
            (user.getRole() != com.cb.backend.model.Role.AUTHOR && 
             user.getRole() != com.cb.backend.model.Role.ADMIN && 
             user.getRole() != com.cb.backend.model.Role.MODERATOR)) {
            throw new RuntimeException("Only users with AUTHOR, ADMIN, or MODERATOR role can create blogs");
        }
		
        Blog blog = new Blog();
        BlogMapper.updateEntity(blog, dto, user);
        return BlogMapper.toDto(blogRepo.save(blog));
    }

    /**
     * Updates an existing blog post.
     *
     * <p>
     * Retrieves the existing {@link Blog} and the associated {@link User} by ID,
     * then applies changes from the provided {@link BlogDto}.
     * </p>
     *
     * @param id  the identifier of the blog to update
     * @param dto the {@link BlogDto} containing updated blog data
     * @return {@link BlogDto} of the updated blog
     * @throws RuntimeException if the blog or associated user is not found
     */
    @Override
    public BlogDto update(Long id, BlogDto dto) {
        User user = userRepo.findById(dto.getUserDto().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Blog blog = blogRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        BlogMapper.updateEntity(blog, dto, user);
        return BlogMapper.toDto(blogRepo.save(blog));
    }

    /**
     * Deletes a blog post by its ID.
     *
     * @param id the identifier of the blog to delete
     */
    @Override
    public void deleteById(Long id) {
        blogRepo.deleteById(id);
    }
}