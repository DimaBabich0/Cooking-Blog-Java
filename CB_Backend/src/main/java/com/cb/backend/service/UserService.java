package com.cb.backend.service;

import com.cb.backend.dto.UserDto;
import com.cb.backend.mapper.UserMapper;
import com.cb.backend.model.User;
import com.cb.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements CrudService<UserDto, Long> {
    private final UserRepository userRepo;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public List<UserDto> findAll() {
        return userRepo.findAll().stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto findById(Long id) {
        return userRepo.findById(id)
        		.map(UserMapper::toDto)
        		.orElse(null);
    }

    @Override
    public UserDto create(UserDto dto) {
        User user = new User();
        UserMapper.updateEntity(user, dto);
        return UserMapper.toDto(userRepo.save(user));
    }
    
    @Override
    public UserDto update(Long id, UserDto dto) {
        User user = userRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        UserMapper.updateEntity(user, dto);
        return UserMapper.toDto(userRepo.save(user));
    }
    
    @Override
    public void deleteById(Long id) {
    	userRepo.deleteById(id);
    }
    
    public List<UserDto> searchUsersByUsername(String username) {
        return userRepo.findByUsernameContainingIgnoreCase(username).stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
    }
}