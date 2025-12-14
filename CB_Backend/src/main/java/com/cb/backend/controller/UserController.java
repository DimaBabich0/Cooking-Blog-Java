package com.cb.backend.controller;

import com.cb.backend.dto.UserDto;
import com.cb.backend.service.UserService;
import com.cb.backend.service.CrudService;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController extends AbstractCrudController<UserDto, Long> {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected CrudService<UserDto, Long> getService() {
        return userService;
    }
    
    @GetMapping("/search")
    public List<UserDto> searchUsers(@RequestParam("q") String query) {
        return userService.searchUsersByUsername(query);
    }
}