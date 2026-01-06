import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { updateUser, UserDto } from "../../api/userApi";
import { getImageUrl } from "../../api/filesApi";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import Button from "../../components/Button/Button";
import styles from "./ProfilePage.module.scss";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
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
    // Обновляем photoUrl после загрузки (используем только путь, без тега img)
    setFormData((prev) => ({
      ...prev,
      photoUrl: imagePath,
    }));
    // Показываем превью сразу после загрузки
    setSuccess("Фото загружено! Нажмите 'Сохранить изменения' для применения.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!formData.username || !formData.username.trim()) {
        throw new Error("Имя пользователя обязательно");
      }
      if (!formData.email || !formData.email.trim()) {
        throw new Error("Email обязателен");
      }
      if (formData.password && formData.password.length > 0) {
        if (formData.password.length < 6) {
          throw new Error("Пароль должен содержать минимум 6 символов");
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Пароли не совпадают");
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
      setSuccess("Профиль успешно обновлен");
      // Обновляем formData с новыми данными пользователя
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
      setError(err instanceof Error ? err.message : "Ошибка обновления профиля");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <section className={styles.profilePage}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>Мой профиль</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.profileInfo}>
          <div className={styles.avatarSection}>
            {(formData.photoUrl || user.photoUrl) && (
              <img
                src={getImageUrl(formData.photoUrl || user.photoUrl || "")}
                alt={user.username}
                className={styles.avatar}
              />
            )}
            {!formData.photoUrl && !user.photoUrl && (
              <div className={styles.avatarPlaceholder}>
                {user.username?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <div className={styles.role}>Роль: {user.role}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Имя пользователя *
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
              Имя
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
              Фамилия
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
            <label className={styles.label}>Фото профиля</label>
            <ImageUploader
              onImageInsert={handleImageUpload}
              folder="avatars"
            />
            <small className={styles.hint}>
              Загрузите новое фото профиля и нажмите "Сохранить изменения"
            </small>
            {formData.photoUrl && formData.photoUrl !== user.photoUrl && (
              <div className={styles.previewHint}>
                ✓ Новое фото загружено и будет применено после сохранения
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Новый пароль
            </label>
            <input
              id="password"
              type="password"
              value={formData.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
              className={styles.input}
              placeholder="Оставьте пустым, чтобы не менять"
            />
          </div>

          {formData.password && formData.password.length > 0 && (
            <div className={styles.field}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Подтвердите новый пароль
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
              onClick={handleLogout}
              variant="secondary"
            >
              Выйти
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
