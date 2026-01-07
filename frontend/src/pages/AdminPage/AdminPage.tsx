import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getRecipes, RecipeDto } from "../../api/recipeApi";
import { getBlogs, BlogDto } from "../../api/blogApi";
import { getUsers, UserDto } from "../../api/userApi";
import { useState, useEffect } from "react";
import styles from "./AdminPage.module.scss";

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalBlogs: 0,
    pendingModeration: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const [users, recipes, blogs] = await Promise.all([
        getUsers(),
        getRecipes(),
        getBlogs(),
      ]);

      const pending = [
        ...recipes.filter(r => r.status === "PENDING"),
        ...blogs.filter(b => b.status === "PENDING"),
      ].length;

      setStats({
        totalUsers: users.length,
        totalRecipes: recipes.length,
        totalBlogs: blogs.length,
        pendingModeration: pending,
      });
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  }

  const adminSections = [
    {
      title: "Users",
      description: "Manage users, roles, and permissions",
      path: "/admin/users",
      icon: "👥",
    },
    {
      title: "Recipes",
      description: "View, edit, and moderate recipes",
      path: "/admin/recipes",
      icon: "📝",
    },
    {
      title: "Blogs",
      description: "View, edit, and moderate blog posts",
      path: "/admin/blogs",
      icon: "📄",
    },
    {
      title: "Categories",
      description: "Manage recipe and blog categories",
      path: "/admin/categories",
      icon: "🏷️",
    },
    {
      title: "Products",
      description: "Manage product database",
      path: "/admin/products",
      icon: "🥘",
    },
    {
      title: "Comments",
      description: "Moderate user comments",
      path: "/admin/comments",
      icon: "💬",
    },
  ];

  return (
    <section className={styles.adminPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.subtitle}>
            Welcome, {user?.firstName || user?.username}! Manage your content and users.
          </p>
        </div>

        <div className={styles.sectionsGrid}>
          {adminSections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className={styles.sectionCard}
            >
              <div className={styles.sectionIcon}>{section.icon}</div>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <p className={styles.sectionDescription}>{section.description}</p>
            </Link>
          ))}
        </div>

        <div className={styles.quickStats}>
          <h2 className={styles.statsTitle}>Quick Stats</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {loading ? "..." : stats.totalUsers}
              </div>
              <div className={styles.statLabel}>Total Users</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {loading ? "..." : stats.totalRecipes}
              </div>
              <div className={styles.statLabel}>Total Recipes</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {loading ? "..." : stats.pendingModeration}
              </div>
              <div className={styles.statLabel}>Pending Moderation</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {loading ? "..." : stats.totalBlogs}
              </div>
              <div className={styles.statLabel}>Total Blogs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
