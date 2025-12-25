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

import CategoriesPage from "./pages/category/CategoriesPage.jsx";
import CategoryCreatePage from "./pages/category/CategoryCreatePage.jsx";
import CategoryViewPage from "./pages/category/CategoryViewPage.jsx";
import CategoryEditPage from "./pages/category/CategoryEditPage.jsx";

import RecipesPage from "./pages/recipe/RecipesPage.jsx";
import RecipeCreatePage from "./pages/recipe/RecipeCreatePage.jsx";
import RecipeViewPage from "./pages/recipe/RecipeViewPage.jsx";
import RecipeEditPage from "./pages/recipe/RecipeEditPage.jsx";

import RatingsPage from "./pages/rating/RatingsPage.jsx";
import RatingCreatePage from "./pages/rating/RatingCreatePage.jsx";
import RatingViewPage from "./pages/rating/RatingViewPage.jsx";
import RatingEditPage from "./pages/rating/RatingEditPage.jsx";

import ProductsPage from "./pages/product/ProductsPage.jsx";
import ProductCreatePage from "./pages/product/ProductCreatePage.jsx";
import ProductViewPage from "./pages/product/ProductViewPage.jsx";
import ProductEditPage from "./pages/product/ProductEditPage.jsx";

import CommentsPage from "./pages/comment/CommentsPage.jsx";
import CommentCreatePage from "./pages/comment/CommentCreatePage.jsx";
import CommentViewPage from "./pages/comment/CommentViewPage.jsx";
import CommentEditPage from "./pages/comment/CommentEditPage.jsx";

import IngredientsPage from "./pages/ingredient/IngredientsPage.jsx";

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
                <Route path="/recipes/create" element={<RecipeCreatePage />} />
                <Route path="/recipes/:id" element={<RecipeViewPage />} />
                <Route path="/recipes/:id/edit" element={<RecipeEditPage />} />

                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/categories/create" element={<CategoryCreatePage />} />
                <Route path="/categories/:id" element={<CategoryViewPage />} />
                <Route path="/categories/:id/edit" element={<CategoryEditPage />} />

                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/create" element={<ProductCreatePage />} />
                <Route path="/products/:id" element={<ProductViewPage />} />
                <Route path="/products/:id/edit" element={<ProductEditPage />} />

                <Route path="/ingredients" element={<IngredientsPage />} />

                <Route path="/comments" element={<CommentsPage />} />
                <Route path="/comments/create" element={<CommentCreatePage />} />
                <Route path="/comments/:id" element={<CommentViewPage />} />
                <Route path="/comments/:id/edit" element={<CommentEditPage />} />

                <Route path="/ratings" element={<RatingsPage />} />
                <Route path="/ratings/create" element={<RatingCreatePage />} />
                <Route path="/ratings/:id" element={<RatingViewPage />} />
                <Route path="/ratings/:id/edit" element={<RatingEditPage />} />
            </Routes>
        </BrowserRouter>
    );
}