import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser, UserDto } from "../../api/userApi";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button/Button";
import styles from "./SignUpPage.module.scss";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const [formData, setFormData] = useState<Partial<UserDto & { password: string; confirmPassword: string }>>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
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
      if (!formData.username || !formData.username.trim()) {
        throw new Error("Username is required");
      }
      if (!formData.email || !formData.email.trim()) {
        throw new Error("Email is required");
      }
      if (!formData.password || formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const userToCreate: Partial<UserDto & { password: string }> = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "USER",
      };

      const createdUser = await createUser(userToCreate);
      
      // Автоматически входим после регистрации
      setAuthUser(createdUser);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.signUpPage}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>Sign Up</h1>

        {error && <div className={styles.error}>{error}</div>}

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
              placeholder="Enter username"
              required
              autoComplete="username"
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
              placeholder="example@email.com"
              required
              autoComplete="email"
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
              placeholder="Enter first name"
              autoComplete="given-name"
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
              placeholder="Enter last name"
              autoComplete="family-name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password *
            </label>
            <input
              id="password"
              type="password"
              value={formData.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
              className={styles.input}
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword || ""}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={styles.input}
              placeholder="Repeat password"
              required
              autoComplete="new-password"
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </div>

          <div className={styles.footer}>
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
