package com.cb.backend.controller;

import com.cb.backend.dto.UserDto;
import com.cb.backend.service.UserService;
import com.cb.backend.service.CrudService;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing {@link UserDto} entities.
 *
 * <p>
 * Provides standard CRUD endpoints inherited from {@link AbstractCrudController}:
 * <ul>
 *     <li>GET /api/users – list all users,</li>
 *     <li>GET /api/users/{id} – get a user by ID,</li>
 *     <li>POST /api/users – create a new user,</li>
 *     <li>PUT /api/users/{id} – update an existing user,</li>
 *     <li>DELETE /api/users/{id} – delete a user by ID.</li>
 * </ul>
 * </p>
 *
 * <p>
 * Provides an additional search endpoint:
 * <ul>
 *     <li>GET /api/users/search?q={query} – search users by username containing the query string.</li>
 * </ul>
 * </p>
 *
 * <p>
 * Delegates all operations to {@link UserService}.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@RestController
@RequestMapping("/api/users")
public class UserController extends AbstractCrudController<UserDto, Long> {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Returns the service used by this controller for CRUD operations.
     *
     * @return the {@link CrudService} for users
     */
    @Override
    protected CrudService<UserDto, Long> getService() {
        return userService;
    }
    
    /**
     * Searches for users whose usernames contain the specified query string.
     *
     * @param query the search string to match against usernames
     * @return a list of {@link UserDto} objects representing users that match the query
     */
    @GetMapping("/search")
    public List<UserDto> searchUsers(@RequestParam("q") String query) {
        return userService.searchUsersByUsername(query);
    }
}