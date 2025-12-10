package com.cb.backend.service;

import com.cb.backend.dto.UserDto;
import com.cb.backend.mapper.UserMapper;
import com.cb.backend.model.User;
import com.cb.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
    }

    public UserDto findById(Long id) {
        return userRepository.findById(id)
        		.map(UserMapper::toDto)
        		.orElse(null);
    }

    public UserDto createUser(UserDto dto) {
        User user = new User();
        UserMapper.updateEntity(user, dto);
        return UserMapper.toDto(userRepository.save(user));
    }
    
    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        UserMapper.updateEntity(user, dto);
        return UserMapper.toDto(userRepository.save(user));
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}
