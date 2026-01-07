package com.cb.backend.service;

import com.cb.backend.dto.UserDto;
import com.cb.backend.mapper.UserMapper;
import com.cb.backend.model.User;
import com.cb.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class <b>UserService</b> implements {@link CrudService} for
 * {@link UserDto} objects.
 *
 * <p>
 * Provides CRUD operations for {@link User} entities, mapping between
 * {@link User} and {@link UserDto} using {@link UserMapper}.
 * </p>
 *
 * <p>
 * Supports searching users by username with {@link #searchUsersByUsername(String)}.
 * Throws {@link RuntimeException} if the user is not found when updating.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@Service
public class UserService implements CrudService<UserDto, Long> {
    private final UserRepository userRepo;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    /**
     * Retrieves all users.
     *
     * @return list of {@link UserDto} representing all users
     */
    @Override
    public List<UserDto> findAll() {
        return userRepo.findAll().stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
    }

	/**
	 * Finds a user by its ID.
	 *
	 * @param id the identifier of the user
	 * @return {@link UserDto} of the found user, or {@code null} if not found
	 */
    @Override
    public UserDto findById(Long id) {
        return userRepo.findById(id)
        		.map(UserMapper::toDto)
        		.orElse(null);
    }

    /**
     * Creates a new user.
     *
     * @param dto the {@link UserDto} containing user data
     * @return {@link UserDto} of the created user
     */
    @Override
    public UserDto create(UserDto dto) {
        User user = new User();
        UserMapper.updateEntity(user, dto);
        return UserMapper.toDto(userRepo.save(user));
    }
    
    /**
     * Updates an existing user.
     *
     * @param id  the identifier of the user to update
     * @param dto the {@link UserDto} containing updated user data
     * @return {@link UserDto} of the updated user
     * @throws RuntimeException if the user is not found
     */
    @Override
    public UserDto update(Long id, UserDto dto) {
        User user = userRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        UserMapper.updateEntity(user, dto);
        return UserMapper.toDto(userRepo.save(user));
    }
    
    /**
     * Deletes a user by its ID.
     *
     * @param id the identifier of the user to delete
     */
    @Override
    public void deleteById(Long id) {
    	userRepo.deleteById(id);
    }

    /**
     * Searches users by partial username (not case-sensitive).
     *
     * @param username the partial username to search for
     * @return list of {@link UserDto} matching the search criteria
     */
    public List<UserDto> searchUsersByUsername(String username) {
        return userRepo.findByUsernameContainingIgnoreCase(username).stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
    }
}