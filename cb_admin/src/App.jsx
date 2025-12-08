import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage.jsx";

import UsersPage from "./pages/user/UsersPage.jsx";
import UserCreatePage from "./pages/user/UserCreatePage.jsx";
import UserViewPage from "./pages/user/UserViewPage.jsx";
import UserEditPage from "./pages/user/UserEditPage.jsx";

import BlogPage from "./pages/blog/BlogPage.jsx";
import BlogCreatePage from "./pages/blog/BlogCreatePage.jsx";
import BlogViewPage from "./pages/blog/BlogViewPage.jsx";
import BlogEditPage from "./pages/blog/BlogEditPage.jsx";

import RecipesPage from "./pages/recipes/RecipesPage.jsx";
import CategoriesPage from "./pages/categories/CategoriesPage.jsx";
import CommentsPage from "./pages/comments/CommentsPage.jsx";
import RatingsPage from "./pages/ratings/RatingsPage.jsx";

import Navbar from "./components/Navbar";
import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<MainPage />} />

                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/create" element={<UserCreatePage />} />
                <Route path="/users/:id" element={<UserViewPage />} />
                <Route path="/users/:id/edit" element={<UserEditPage />} />

                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/blogs/create" element={<BlogCreatePage />} />
                <Route path="/blogs/:id" element={<BlogViewPage />} />
                <Route path="/blogs/:id/edit" element={<BlogEditPage />} />


                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/comments" element={<CommentsPage />} />
                <Route path="/ratings" element={<RatingsPage />} />
            </Routes>
        </BrowserRouter>
    );
}