import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecipes, updateRecipe, deleteRecipe, RecipeDto } from "../../api/recipeApi";
import { getImageUrl } from "../../api/filesApi";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button/Button";
import styles from "./AdminRecipesPage.module.scss";

export default function AdminRecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      setLoading(true);
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading recipes");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(recipeId: number, newStatus: string) {
    try {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return;

      // Check if status is actually changing
      const currentStatus = recipe.status || "PENDING";
      if (currentStatus.toUpperCase() === newStatus.toUpperCase()) {
        return; // No change needed
      }

      // Ask for confirmation
      const statusLabels: { [key: string]: string } = {
        PENDING: "Pending",
        PUBLISHED: "Published",
        REJECTED: "Rejected",
      };
      
      const currentLabel = statusLabels[currentStatus.toUpperCase()] || currentStatus;
      const newLabel = statusLabels[newStatus.toUpperCase()] || newStatus;
      
      const confirmed = window.confirm(
        `Are you sure you want to change the status of "${recipe.title}" from "${currentLabel}" to "${newLabel}"?`
      );
      
      if (!confirmed) {
        // Reset select to original value
        const select = document.querySelector(
          `select[data-recipe-id="${recipeId}"]`
        ) as HTMLSelectElement;
        if (select) {
          select.value = currentStatus;
        }
        return;
      }

      // Create minimal payload with only necessary fields + status
      const updatePayload: Partial<RecipeDto> = {
        id: recipe.id,
        title: recipe.title,
        text: recipe.text,
        description: recipe.description,
        photoUrl: recipe.photoUrl,
        cookingTime: recipe.cookingTime,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        calories: recipe.calories,
        totalFat: recipe.totalFat,
        protein: recipe.protein,
        carbohydrates: recipe.carbohydrates,
        cholesterol: recipe.cholesterol,
        status: newStatus, // Explicitly set status
        userDto: recipe.userDto,
        categoryDtos: recipe.categoryDtos,
        ingredientsDto: recipe.ingredientsDto,
      };
      
      await updateRecipe(recipeId, updatePayload);
      await loadRecipes();
    } catch (err) {
      console.error("Error updating recipe status:", err);
      setError(err instanceof Error ? err.message : "Error updating recipe status");
    }
  }

  async function handleDelete(recipeId: number) {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    
    try {
      await deleteRecipe(recipeId);
      await loadRecipes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting recipe");
    }
  }

  const filteredRecipes = statusFilter === "all" 
    ? recipes 
    : recipes.filter(r => r.status === statusFilter);

  const statusCounts = {
    all: recipes.length,
    PENDING: recipes.filter(r => r.status === "PENDING").length,
    PUBLISHED: recipes.filter(r => r.status === "PUBLISHED").length,
    REJECTED: recipes.filter(r => r.status === "REJECTED").length,
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
          <h1 className={styles.title}>Recipes Management</h1>
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

        <div className={styles.recipesGrid}>
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className={styles.recipeCard}>
              <div className={styles.recipeImage}>
                {recipe.photoUrl ? (
                  <img src={getImageUrl(recipe.photoUrl)} alt={recipe.title} />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
              </div>
              <div className={styles.recipeInfo}>
                <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                <p className={styles.recipeDescription}>
                  {recipe.description || "No description"}
                </p>
                <div className={styles.recipeMeta}>
                  <span className={styles.author}>
                    By: {recipe.userDto?.username || "Unknown"}
                  </span>
                  <span className={styles.date}>
                    {recipe.createdAt
                      ? new Date(recipe.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className={styles.recipeActions}>
                  <div className={styles.statusControl}>
                    <label>Status:</label>
                    <select
                      data-recipe-id={recipe.id}
                      value={recipe.status || "PENDING"}
                      onChange={(e) => handleStatusChange(recipe.id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div className={styles.actionButtons}>
                    <Link to={`/recipes/${recipe.id}`}>
                      <Button variant="secondary">View</Button>
                    </Link>
                    {/* Admin can only edit their own recipes */}
                    {user?.id === recipe.userDto?.id && (
                      <Link to={`/recipes/create?edit=${recipe.id}`}>
                        <Button variant="secondary">Edit</Button>
                      </Link>
                    )}
                    {/* Admin can delete all recipes */}
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(recipe.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className={styles.emptyState}>
            <p>No recipes found with status: {statusFilter}</p>
          </div>
        )}
      </div>
    </section>
  );
}
