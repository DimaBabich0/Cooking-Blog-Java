package com.cb.backend.controller;

import com.cb.backend.dto.UserDto;
import com.cb.backend.service.UserService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
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
}