import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar() {
    const links = [
        { name: "Users", path: "/users" },
        { name: "Blogs", path: "/blogs" },
        { name: "Recipes", path: "/recipes" },
        { name: "Categories", path: "/categories" },
        { name: "Products", path: "/products" },
        { name: "Ingredients", path: "/ingredients" },
        { name: "Comments", path: "/comments" },
        { name: "Ratings", path: "/ratings" },
    ];

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                {links.map(link => (
                    <li key={link.path} className="navbar-item">
                        <NavLink
                            to={link.path}
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                            {link.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
