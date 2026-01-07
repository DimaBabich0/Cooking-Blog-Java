import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Header from "./components/Header/Header";
import BlogPage from "./pages/BlogPage/BlogPage";
import BlogPostPage from "./pages/BlogPostPage/BlogPostPage";
import CreateBlogPage from "./pages/CreateBlogPage/CreateBlogPage";
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import RecipesPage from "./pages/Recipes/RecipesPage";
import CreateRecipePage from "./pages/CreateRecipePage/CreateRecipePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ComponentsTestPage from "./pages/ComponentsTestPage/ComponentsTestPage";
// TODO: Uncomment when admin panel is ready
// import AdminPage from "./pages/AdminPage/AdminPage";
// import AdminUsersPage from "./pages/AdminPage/AdminUsersPage";
// import AdminRecipesPage from "./pages/AdminPage/AdminRecipesPage";
// import AdminBlogsPage from "./pages/AdminPage/AdminBlogsPage";
// import AdminCategoriesPage from "./pages/AdminPage/AdminCategoriesPage";
// import AdminRoute from "./components/AdminRoute/AdminRoute";
import Footer from "./components/Footer/Footer";
import { useAuth } from "./contexts/AuthContext";

function NotFound() {
  return <div style={{ padding: 24 }}>Page not found</div>;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 24, textAlign: "center" }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <div className="wrapper">
      <Header />
      <main>
        <Routes>
          <Route path="*" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route
            path="blog/create"
            element={
              <ProtectedRoute>
                <CreateBlogPage />
              </ProtectedRoute>
            }
          />
          <Route path="blog/:id" element={<BlogPostPage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="recipes/:id" element={<RecipesPage />} />
          <Route
            path="recipes/create"
            element={
              <ProtectedRoute>
                <CreateRecipePage />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="components-test" element={<ComponentsTestPage />} />
          {/* TODO: Uncomment when admin panel is ready
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/recipes"
            element={
              <AdminRoute>
                <AdminRecipesPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/blogs"
            element={
              <AdminRoute>
                <AdminBlogsPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/categories"
            element={
              <AdminRoute>
                <AdminCategoriesPage />
              </AdminRoute>
            }
          />
          */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
