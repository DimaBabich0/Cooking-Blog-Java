package com.cb.backend.tests;

import com.cb.backend.model.Blog;
import com.cb.backend.model.Role;
import com.cb.backend.model.User;
import com.cb.backend.dto.BlogDto;
import com.cb.backend.dto.UserDto;
import com.cb.backend.repository.BlogRepository;
import com.cb.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDateTime;
import java.util.List;
import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BlogIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private BlogRepository blogRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private BlogDto blogDto;

    @BeforeEach
    void setUp() {
        blogRepo.deleteAll();
        userRepo.deleteAll();

        testUser = createUser();
        blogDto = createBlogDto(testUser.getId());
    }

    @Test
    void testCreateBlog() throws Exception {
        mockMvc.perform(post("/api/blogs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(blogDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test blog"))
                .andExpect(jsonPath("$.userDto.id").value(testUser.getId()));

        List<Blog> blogs = blogRepo.findAll();
        assertThat(blogs).hasSize(1);
        assertThat(blogs.get(0).getCreatedAt()).isNotNull();
    }

    @Test
    void testGetAllBlogs() throws Exception {
        blogRepo.save(createBlog(testUser));

        mockMvc.perform(get("/api/blogs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Existing blog"));
    }

    @Test
    void testGetBlogById() throws Exception {
        Blog blog = blogRepo.save(createBlog(testUser));

        mockMvc.perform(get("/api/blogs/" + blog.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Existing blog"));
    }

    @Test
    void testGetBlogByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/blogs/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateBlog() throws Exception {
        Blog blog = blogRepo.save(createBlog(testUser));

        blogDto.setTitle("Updated title");
        blogDto.setText("Updated content");

        mockMvc.perform(put("/api/blogs/" + blog.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(blogDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated title"));

        Blog updated = blogRepo.findById(blog.getId()).orElseThrow();
        assertThat(updated.getUpdatedAt()).isAfter(updated.getCreatedAt());
    }

    @Test
    void testDeleteBlog() throws Exception {
        Blog blog = blogRepo.save(createBlog(testUser));

        mockMvc.perform(delete("/api/blogs/" + blog.getId()))
                .andExpect(status().isOk());

        assertThat(blogRepo.findById(blog.getId())).isEmpty();
    }

    private User createUser() {
        User user = new User();
        user.setUsername("bloguser");
        user.setEmail("blog@test.com");
        user.setPasswordHash("hash");
        user.setPasswordSalt("salt");
        user.setRole(Role.USER);
        user.onCreate();
        return userRepo.save(user);
    }

    private Blog createBlog(User user) {
        Blog blog = new Blog();
        blog.setTitle("Existing blog");
        blog.setDescription("Desc");
        blog.setText("Blog content");
        blog.setPhotoUrl("photo.jpg");
        blog.setCookingTime(30);
        blog.setUser(user);
        blog.onCreate();
        return blog;
    }

    private BlogDto createBlogDto(Long userId) {
        BlogDto dto = new BlogDto();
        dto.setTitle("Test blog");
        dto.setDescription("Short desc");
        dto.setText("Long blog text");
        dto.setPhotoUrl("img.jpg");
        dto.setCookingTime(15);

        UserDto userDto = new UserDto();
        userDto.setId(userId);
        dto.setUserDto(userDto);

        dto.setCreatedAt(LocalDateTime.now());
        return dto;
    }
}