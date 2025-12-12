package com.cb.backend.service;

import com.cb.backend.dto.BlogDto;
import com.cb.backend.mapper.BlogMapper;
import com.cb.backend.model.Blog;
import com.cb.backend.model.User;
import com.cb.backend.repository.BlogRepository;
import com.cb.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService implements CrudService<BlogDto, Long> {
    private final BlogRepository blogRepo;
    private final UserRepository userRepo;
    
    public BlogService(BlogRepository blogRepo, UserRepository userRepo) {
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
    }
    
	@Override
	public List<BlogDto> findAll() {
        return blogRepo.findAll().stream()
                .map(BlogMapper::toDto)
                .collect(Collectors.toList());
	}

	@Override
	public BlogDto findById(Long id) {
		return blogRepo.findById(id)
                .map(BlogMapper::toDto)
                .orElse(null);
	}

	@Override
	public BlogDto create(BlogDto dto) {
		User user = userRepo.findById(dto.getUserDto().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
		
        Blog blog = new Blog();
        BlogMapper.updateEntity(blog, dto, user);
        return BlogMapper.toDto(blogRepo.save(blog));
	}

	@Override
	public BlogDto update(Long id, BlogDto dto) {
        User user = userRepo.findById(dto.getUserDto().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
		Blog blog = blogRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        BlogMapper.updateEntity(blog, dto, user);
        return BlogMapper.toDto(blogRepo.save(blog));
	}

	@Override
	public void deleteById(Long id) {
		blogRepo.deleteById(id);		
	}
}