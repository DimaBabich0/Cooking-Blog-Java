import { BrowserRouter, Routes, Route } from "react-router-dom";

import UsersPage from "./pages/UsersPage";
import UserCreatePage from "./pages/UserCreatePage.jsx";
import UserViewPage from "./pages/UserViewPage";
import UserEditPage from "./pages/UserEditPage";

import BlogPage from "./pages/BlogPage";
import RecipesPage from "./pages/RecipesPage";
import CategoriesPage from "./pages/CategoriesPage";
import CommentsPage from "./pages/CommentsPage";
import RatingsPage from "./pages/RatingsPage";

import Navbar from "./components/Navbar";
import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<UsersPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/create" element={<UserCreatePage />} />
                <Route path="/users/:id" element={<UserViewPage />} />
                <Route path="/users/:id/edit" element={<UserEditPage />} />

                <Route path="/blog" element={<BlogPage />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/comments" element={<CommentsPage />} />
                <Route path="/ratings" element={<RatingsPage />} />
            </Routes>
        </BrowserRouter>
    );
}