package com.cb.backend.tests;

import com.cb.backend.model.Role;
import com.cb.backend.model.User;
import com.cb.backend.dto.UserDto;
import com.cb.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDate;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ObjectMapper objectMapper;
    
    private UserDto testDto;

    @BeforeEach
    void setUp() {
        userRepo.deleteAll();

        testDto = new UserDto();
        testDto.setUsername("testuser");
        testDto.setFirstName("John");
        testDto.setLastName("Doe");
        testDto.setEmail("test@example.com");
        testDto.setPassword("password123");
        testDto.setRole("USER");
        testDto.setPhotoUrl("photo.jpg");
        testDto.setCreatedAt(LocalDate.now());
    }

    @Test
    void testCreateUser() throws Exception {
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));

        List<User> users = userRepo.findAll();
        assertEquals(1, users.size());
        User savedUser = users.get(0);
        assertEquals("testuser", savedUser.getUsername());
        assertNotNull(savedUser.getPasswordHash());
        assertNotNull(savedUser.getPasswordSalt());
        assertEquals("photo.jpg", savedUser.getPhotoUrl());
    }

    @Test
    void testGetAllUsers() throws Exception {
        userRepo.save(createTestUser());

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].username").value("testuser"));
    }

    @Test
    void testGetUserById() throws Exception {
        User savedUser = userRepo.save(createTestUser());

        mockMvc.perform(get("/api/users/" + savedUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void testUpdateUser() throws Exception {
        User savedUser = userRepo.save(createTestUser());

        testDto.setUsername("updateduser");
        testDto.setEmail("updated@example.com");
        testDto.setPassword("newpassword");

        mockMvc.perform(put("/api/users/" + savedUser.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("updateduser"))
                .andExpect(jsonPath("$.email").value("updated@example.com"));

        User updatedUser = userRepo.findById(savedUser.getId()).orElse(null);
        assertNotNull(updatedUser);
        assertEquals("updateduser", updatedUser.getUsername());
        assertEquals("updated@example.com", updatedUser.getEmail());
        assertTrue(BCrypt.checkpw("newpassword", updatedUser.getPasswordHash()));
    }

    @Test
    void testDeleteUser() throws Exception {
        User savedUser = userRepo.save(createTestUser());

        mockMvc.perform(delete("/api/users/" + savedUser.getId()))
                .andExpect(status().isOk());

        assertFalse(userRepo.findById(savedUser.getId()).isPresent());
    }

    @Test
    void testSearchUsers() throws Exception {
        userRepo.save(createTestUser("testuser1", "test1@example.com"));
        userRepo.save(createTestUser("testuser2", "test2@example.com"));

        mockMvc.perform(get("/api/users/search?q=test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].username").value("testuser1"))
                .andExpect(jsonPath("$[1].username").value("testuser2"));
    }

    @Test
    void testGetUserByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/users/999"))
                .andExpect(status().isNotFound());
    }
    
    private User createTestUser() {
        return createTestUser("testuser", "test@example.com");
    }

    private User createTestUser(String username, String email) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash("hash");
        user.setPasswordSalt("salt");
        user.setRole(Role.USER);
        user.onCreate();
        return user;
    }
}