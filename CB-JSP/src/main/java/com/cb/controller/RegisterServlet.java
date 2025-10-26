package com.cb.controller;

import com.cb.dao.UserDAO;
import com.cb.model.User;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import org.apache.commons.codec.digest.DigestUtils;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String username = request.getParameter("username");
        String firstName = request.getParameter("first_name");
        String lastName = request.getParameter("last_name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // Генерация соли и хэш пароля
        String salt = generateSalt();
        String hash = hashPassword(password, salt);

        User user = new User(username, firstName, lastName, email, hash, salt,
                             "user", "img/photo_profile.png", new java.util.Date());

        try {
            new UserDAO().addUser(user);
            response.sendRedirect("login.jsp?success=1");
        } catch (RuntimeException e) {
            e.printStackTrace();
            response.sendRedirect("register.jsp?error=db");
        }
    }

    private String generateSalt() {
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    private String hashPassword(String password, String salt) {
        return DigestUtils.sha256Hex(password + salt);
    }
}
