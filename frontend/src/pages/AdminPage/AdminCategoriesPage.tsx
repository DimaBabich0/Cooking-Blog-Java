import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories, createCategory, updateCategory, deleteCategory, CategoryDto } from "../../api/categoryApi";
import { getImageUrl } from "../../api/filesApi";
import Button from "../../components/Button/Button";
import styles from "./AdminCategoriesPage.module.scss";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CategoryDto>>({
    name: "",
    description: "",
    photoUrl: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading categories");
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setIsCreating(true);
    setEditingId(null);
    setFormData({ name: "", description: "", photoUrl: "" });
    setError(null);
    setSuccess(null);
  }

  function startEdit(category: CategoryDto) {
    setIsCreating(false);
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
      photoUrl: category.photoUrl || "",
    });
    setError(null);
    setSuccess(null);
  }

  function cancelEdit() {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: "", description: "", photoUrl: "" });
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!formData.name || formData.name.trim() === "") {
        throw new Error("Category name is required");
      }

      if (isCreating) {
        await createCategory(formData);
        setSuccess("Category created successfully");
      } else if (editingId) {
        await updateCategory(editingId, formData);
        setSuccess("Category updated successfully");
      }

      await loadCategories();
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving category");
    }
  }

  async function handleDelete(categoryId: number) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await deleteCategory(categoryId);
      await loadCategories();
      setSuccess("Category deleted successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting category");
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
          <div className={styles.headerActions}>
            <h1 className={styles.title}>Categories Management</h1>
            {!isCreating && editingId === null && (
              <Button onClick={startCreate} variant="primary">
                + Create Category
              </Button>
            )}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Create/Edit Form */}
        {(isCreating || editingId !== null) && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>
              {isCreating ? "Create New Category" : "Edit Category"}
            </h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="description" className={styles.label}>
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="photoUrl" className={styles.label}>
                  Photo URL
                </label>
                <input
                  id="photoUrl"
                  type="text"
                  value={formData.photoUrl || ""}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className={styles.input}
                  placeholder="http://example.com/image.jpg"
                />
              </div>

              <div className={styles.formActions}>
                <Button type="button" onClick={cancelEdit} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {isCreating ? "Create" : "Update"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <div key={category.id} className={styles.categoryCard}>
              <div className={styles.categoryImage}>
                {category.photoUrl ? (
                  <img src={getImageUrl(category.photoUrl)} alt={category.name} />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
              </div>
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                {category.description && (
                  <p className={styles.categoryDescription}>{category.description}</p>
                )}
                <div className={styles.categoryActions}>
                  <Button
                    onClick={() => startEdit(category)}
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(category.id)}
                    variant="secondary"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && !isCreating && (
          <div className={styles.emptyState}>
            <p>No categories found. Create your first category!</p>
          </div>
        )}
      </div>
    </section>
  );
}
