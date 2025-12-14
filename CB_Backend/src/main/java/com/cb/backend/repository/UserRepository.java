package com.cb.backend.repository;

import com.cb.backend.model.User;
import java.util.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Collection<User> findByUsernameContainingIgnoreCase(String username);
}
