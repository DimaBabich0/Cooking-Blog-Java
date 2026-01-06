package com.cb.backend.repository;

import com.cb.backend.model.User;
import java.util.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for <b>User</b> entities.
 *
 * <p>
 * Extends {@link JpaRepository} to provide CRUD operations and
 * pagination for {@link User} objects.
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
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds all users whose usernames contain the given string, ignoring case.
     *
     * @param username substring to search for within usernames
     * @return a collection of users matching the search criteria
     */
	Collection<User> findByUsernameContainingIgnoreCase(String username);
}
