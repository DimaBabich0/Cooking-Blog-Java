import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogs, updateBlog, deleteBlog, BlogDto } from "../../api/blogApi";
import { getImageUrl } from "../../api/filesApi";
import Button from "../../components/Button/Button";
import styles from "./AdminBlogsPage.module.scss";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    try {
      setLoading(true);
      const data = await getBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading blogs");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(blogId: number, newStatus: string) {
    try {
      const blog = blogs.find(b => b.id === blogId);
      if (!blog) return;

      await updateBlog(blogId, { ...blog, status: newStatus });
      await loadBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating blog status");
    }
  }

  async function handleDelete(blogId: number) {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
      await deleteBlog(blogId);
      await loadBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting blog");
    }
  }

  const filteredBlogs = statusFilter === "all" 
    ? blogs 
    : blogs.filter(b => b.status === statusFilter);

  const statusCounts = {
    all: blogs.length,
    PENDING: blogs.filter(b => b.status === "PENDING").length,
    PUBLISHED: blogs.filter(b => b.status === "PUBLISHED").length,
    REJECTED: blogs.filter(b => b.status === "REJECTED").length,
  };

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
          <h1 className={styles.title}>Blogs Management</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* Status Filter */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All ({statusCounts.all})</option>
              <option value="PENDING">Pending ({statusCounts.PENDING})</option>
              <option value="PUBLISHED">Published ({statusCounts.PUBLISHED})</option>
              <option value="REJECTED">Rejected ({statusCounts.REJECTED})</option>
            </select>
          </div>
        </div>

        <div className={styles.blogsGrid}>
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className={styles.blogCard}>
              <div className={styles.blogImage}>
                {blog.photoUrl ? (
                  <img src={getImageUrl(blog.photoUrl)} alt={blog.title} />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
              </div>
              <div className={styles.blogInfo}>
                <h3 className={styles.blogTitle}>{blog.title}</h3>
                <p className={styles.blogDescription}>
                  {blog.description || "No description"}
                </p>
                <div className={styles.blogMeta}>
                  <span className={styles.author}>
                    By: {blog.userDto?.username || "Unknown"}
                  </span>
                  <span className={styles.date}>
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className={styles.blogActions}>
                  <div className={styles.statusControl}>
                    <label>Status:</label>
                    <select
                      value={blog.status || "PENDING"}
                      onChange={(e) => handleStatusChange(blog.id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div className={styles.actionButtons}>
                    <Link to={`/blog/${blog.id}`}>
                      <Button variant="secondary">View</Button>
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className={styles.emptyState}>
            <p>No blog posts found with status: {statusFilter}</p>
          </div>
        )}
      </div>
    </section>
  );
}
