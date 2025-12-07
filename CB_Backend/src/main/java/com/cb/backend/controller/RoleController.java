package com.cb.backend.controller;

import com.cb.backend.model.Role;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @GetMapping
    public List<String> getRoles() {
        return Arrays.stream(Role.values())
                     .map(Enum::name)
                     .toList();
    }
}