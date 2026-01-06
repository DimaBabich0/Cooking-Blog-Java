import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, LoginRequest } from "../../api/authApi";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button/Button";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LoginRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.username.trim()) {
        throw new Error("Имя пользователя обязательно");
      }
      if (!formData.password) {
        throw new Error("Пароль обязателен");
      }

      const response = await login(formData);

      if (response.success && response.user) {
        setAuthUser(response.user);
        navigate("/");
      } else {
        setError(response.message || "Ошибка входа");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.loginPage}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>Вход</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Имя пользователя *
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className={styles.input}
              placeholder="Введите имя пользователя"
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Пароль *
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={styles.input}
              placeholder="Введите пароль"
              required
              autoComplete="current-password"
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Вход..." : "Войти"}
            </Button>
          </div>

          <div className={styles.footer}>
            <p>
              Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
