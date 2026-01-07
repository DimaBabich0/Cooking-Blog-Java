package com.cb.backend.repository;

import com.cb.backend.model.Blog;
import com.cb.backend.model.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for <b>Blog</b> entities.
 *
 * <p>
 * Extends {@link JpaRepository} to provide CRUD operations and
 * pagination for {@link Blog} objects.
 * </p>
 *
 * <p>
 * Spring will automatically implement this interface at runtime.
 * </p>
 *
 * @author Dmytro Babich
 * @since 1.0
 */
@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    @Query("SELECT b FROM Blog b LEFT JOIN FETCH b.user WHERE b.status = :status")
    List<Blog> findAllByStatus(ContentStatus status);
}