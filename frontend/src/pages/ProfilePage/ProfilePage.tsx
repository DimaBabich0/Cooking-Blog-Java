import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { updateUser, UserDto } from "../../api/userApi";
import { getRecipes, RecipeDto } from "../../api/recipeApi";
import { getBlogs, BlogDto } from "../../api/blogApi";
import { getImageUrl } from "../../api/filesApi";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import Button from "../../components/Button/Button";
import styles from "./ProfilePage.module.scss";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [blogs, setBlogs] = useState<BlogDto[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<UserDto & { password: string; confirmPassword: string }>>({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    photoUrl: user?.photoUrl || "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user statistics
  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  async function loadUserStats() {
    try {
      setStatsLoading(true);
      const [allRecipes, allBlogs] = await Promise.all([
        getRecipes(),
        getBlogs(),
      ]);
      
      // Filter by current user
      const userRecipes = allRecipes.filter(r => r.userDto?.id === user?.id);
      const userBlogs = allBlogs.filter(b => b.userDto?.id === user?.id);
      
      setRecipes(userRecipes);
      setBlogs(userBlogs);
    } catch (err) {
      console.error("Error loading user stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setFormData({
      username: user.username || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      photoUrl: user.photoUrl || "",
      password: "",
      confirmPassword: "",
    });
  }, [user, navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleImageUpload = (imgTag: string, imagePath: string) => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: imagePath,
    }));
    setSuccess("Photo uploaded! Click 'Save changes' to apply.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!formData.username || !formData.username.trim()) {
        throw new Error("Username is required");
      }
      if (!formData.email || !formData.email.trim()) {
        throw new Error("Email is required");
      }
      if (formData.password && formData.password.length > 0) {
        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
      }

      const userToUpdate: Partial<UserDto & { password?: string }> = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: user.role,
      };

      if (formData.password && formData.password.length > 0) {
        userToUpdate.password = formData.password;
      }

      if (formData.photoUrl) {
        userToUpdate.photoUrl = formData.photoUrl;
      }

      const updatedUser = await updateUser(user.id, userToUpdate);
      await refreshUser();
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      
      setFormData({
        username: updatedUser.username || "",
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        photoUrl: updatedUser.photoUrl || "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    setFormData({
      username: user?.username || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      photoUrl: user?.photoUrl || "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  const canCreateContent = user.role === "AUTHOR" || user.role === "ADMIN" || user.role === "MODERATOR";
  const userRecipesCount = recipes.length;
  const userBlogsCount = blogs.length;

  return (
    <section className={styles.profilePage}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>My Profile</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Profile Header Card */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            {(formData.photoUrl || user.photoUrl) ? (
              <img
                src={getImageUrl(formData.photoUrl || user.photoUrl || "")}
                alt={user.username}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user.username?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username}
            </h2>
            <p className={styles.profileUsername}>@{user.username}</p>
            <div className={styles.roleBadge}>
              <span className={styles.roleLabel}>Role:</span>
              <span className={styles.roleValue}>{user.role}</span>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        {canCreateContent && (
          <div className={styles.statsCard}>
            <h3 className={styles.statsTitle}>Your Content</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>📝</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {statsLoading ? "..." : userRecipesCount}
                  </div>
                  <div className={styles.statLabel}>Recipes</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>📄</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>
                    {statsLoading ? "..." : userBlogsCount}
                  </div>
                  <div className={styles.statLabel}>Blog Posts</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Information Card */}
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Profile Information</h3>
            {!isEditing && (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                variant="secondary"
              >
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="username" className={styles.label}>
                  Username *
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username || ""}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="firstName" className={styles.label}>
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName || ""}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName" className={styles.label}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName || ""}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Profile Photo</label>
                <ImageUploader
                  onImageInsert={handleImageUpload}
                  folder="avatars"
                />
                <small className={styles.hint}>
                  Upload a new profile photo and click "Save changes"
                </small>
                {formData.photoUrl && formData.photoUrl !== user.photoUrl && (
                  <div className={styles.previewHint}>
                    ✓ New photo uploaded and will be applied after saving
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={styles.input}
                  placeholder="Leave empty to keep current password"
                />
              </div>

              {formData.password && formData.password.length > 0 && (
                <div className={styles.field}>
                  <label htmlFor="confirmPassword" className={styles.label}>
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword || ""}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className={styles.input}
                  />
                </div>
              )}

              <div className={styles.actions}>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="secondary"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className={styles.viewMode}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Username:</span>
                <span className={styles.infoValue}>{user.username}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
              {user.firstName && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>First Name:</span>
                  <span className={styles.infoValue}>{user.firstName}</span>
                </div>
              )}
              {user.lastName && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Last Name:</span>
                  <span className={styles.infoValue}>{user.lastName}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        {canCreateContent && (
          <div className={styles.actionsCard}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
            <div className={styles.quickActions}>
              <Link to="/recipes/create" className={styles.actionLink}>
                <Button variant="primary" showIcon iconPosition="left">
                  Create Recipe
                </Button>
              </Link>
              <Link to="/blog/create" className={styles.actionLink}>
                <Button variant="primary" showIcon iconPosition="left">
                  Create Blog Post
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* TODO: Uncomment when admin panel is ready
        Admin Panel Link
        {(user.role === "ADMIN" || user.role === "MODERATOR") && (
          <div className={styles.actionsCard}>
            <h3 className={styles.cardTitle}>Administration</h3>
            <div className={styles.quickActions}>
              <Link to="/admin" className={styles.actionLink}>
                <Button variant="secondary" showIcon iconPosition="left">
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        )}
        */}

        {/* Logout Button */}
        <div className={styles.logoutSection}>
          <Button
            type="button"
            onClick={handleLogout}
            variant="secondary"
          >
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
}
