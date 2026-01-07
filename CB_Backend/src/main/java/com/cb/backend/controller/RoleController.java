package com.cb.backend.controller;

import com.cb.backend.model.Role;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;

/**
 * REST controller for providing the list of available roles.
 *
 * <p>
 * Provides the following endpoint:
 * <ul>
 *     <li>GET /api/roles – returns a list of all role names as strings.</li>
 * </ul>
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@RestController
@RequestMapping("/api/roles")
public class RoleController {
    /**
     * Returns a list of all available roles in {@link com.cb.backend.model.Role}.
     *
     * @return a list of role names as strings
     */
    @GetMapping
    public List<String> getRoles() {
        return Arrays.stream(Role.values())
                     .map(Enum::name)
                     .toList();
    }
}