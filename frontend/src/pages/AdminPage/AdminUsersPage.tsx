import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers, updateUser, UserDto } from "../../api/userApi";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button/Button";
import styles from "./AdminUsersPage.module.scss";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading users");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: number, newRole: string) {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      await updateUser(userId, { ...user, role: newRole });
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating user role");
    }
  }

  if (loading) {
    return (
      <section className={styles.adminPage}>
        <div className="container">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.adminPage}>
      <div className="container">
        <div className={styles.header}>
          <Link to="/admin" className={styles.backLink}>
            ← Back to Admin Panel
          </Link>
          <h1 className={styles.title}>Users Management</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.firstName || user.lastName
                      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                      : "-"}
                  </td>
                  <td>
                    {currentUser?.role === "ADMIN" ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={styles.roleSelect}
                      >
                        <option value="USER">USER</option>
                        <option value="AUTHOR">AUTHOR</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    ) : (
                      <span className={styles.roleBadge}>{user.role}</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link to={`/admin/users/${user.id}`}>
                        <Button variant="secondary">View</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
