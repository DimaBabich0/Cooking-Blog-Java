package com.cb.controller;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.IOException;

@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        Cookie cookie = new Cookie("user", "");
        cookie.setMaxAge(0);
        res.addCookie(cookie);
        res.sendRedirect("index.jsp");
    }
}
