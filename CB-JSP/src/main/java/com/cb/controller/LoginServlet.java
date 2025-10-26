package com.cb.controller;

import com.cb.dao.UserDAO;
import com.cb.model.User;

import java.io.IOException;
import java.util.Optional;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        try {
            Optional<User> optUser = new UserDAO().findByEmail(email);
            if (optUser.isPresent()) {
                User user = optUser.get();
                String hashed = org.apache.commons.codec.digest.DigestUtils.sha256Hex(password + user.getPasswordSalt());

                if (hashed.equals(user.getPasswordHash())) {
                    Cookie loginCookie = new Cookie("user", user.getUsername());
                    loginCookie.setMaxAge(7 * 24 * 60 * 60);
                    response.addCookie(loginCookie);
                    response.sendRedirect("index.jsp");
                    return;
                }
            }
            response.sendRedirect("login.jsp?error=invalid");
        } catch (RuntimeException e) {
            e.printStackTrace();
            response.sendRedirect("login.jsp?error=db");
        }
    }
}
