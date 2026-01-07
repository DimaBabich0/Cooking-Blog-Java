import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe, RecipeDto, IngredientDto } from "../../api/recipeApi";
import QuillEditor from "../../components/QuillEditor/QuillEditor";
import { getUsers, UserDto } from "../../api/userApi";
import { getCategories, CategoryDto } from "../../api/categoryApi";
import { useAuth } from "../../contexts/AuthContext";
import PhotoUploader from "../../components/PhotoUploader/PhotoUploader";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import Button from "../../components/Button/Button";
import styles from "./CreateRecipePage.module.scss";

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const [formData, setFormData] = useState<Partial<RecipeDto>>({
    title: "",
    description: "",
    text: "",
    photoUrl: "",
    cookingTime: 0,
    userDto: {
      id: 0,
      username: "",
    },
    categoryDtos: [],
    ingredientsDto: [],
  });

  // Load data on page load
  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesData] = await Promise.all([
          getCategories(),
        ]);
        setCategories(categoriesData);
        
        if (user) {
          setFormData((prev) => ({
            ...prev,
            userDto: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              photoUrl: user.photoUrl,
            },
          }));
        } else {
          // If user is not logged in, load first user
          const users = await getUsers();
          if (users && users.length > 0) {
            const firstUser = users[0];
            setFormData((prev) => ({
              ...prev,
              userDto: {
                id: firstUser.id,
                username: firstUser.username,
                firstName: firstUser.firstName,
                lastName: firstUser.lastName,
                photoUrl: firstUser.photoUrl,
              },
            }));
          }
        }
      } catch (err) {
        setError("Error loading data");
        console.error(err);
      } finally {
        setInitializing(false);
      }
    }

    loadData();
  }, [user]);

  const handleChange = (field: keyof RecipeDto, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMainImageUpload = (imagePath: string) => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: imagePath,
    }));
  };

  const handleImageInsert = (imageHtml: string, imagePath: string) => {
    // Use global function to insert image into Quill
    if ((window as any).__quillInsertImage) {
      (window as any).__quillInsertImage(imageHtml);
    }
  };

  const addIngredient = () => {
    const newIngredient: IngredientDto = {
      productName: "",
      quantity: 0,
      unit: "g",
    };
    setFormData((prev) => ({
      ...prev,
      ingredientsDto: [...(prev.ingredientsDto || []), newIngredient],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredientsDto: (prev.ingredientsDto || []).filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, field: keyof IngredientDto, value: any) => {
    setFormData((prev) => {
      const ingredients = [...(prev.ingredientsDto || [])];
      ingredients[index] = { ...ingredients[index], [field]: value };
      return { ...prev, ingredientsDto: ingredients };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || formData.title.trim() === "") {
        setError("Please fill in the recipe title");
        setLoading(false);
        return;
      }

      if (!formData.text || formData.text.trim() === "") {
        setError("Please fill in the recipe description (Directions)");
        setLoading(false);
        return;
      }

      if (!formData.userDto?.id) {
        setError("Recipe author not selected");
        setLoading(false);
        return;
      }

      // Filter empty ingredients before submission
      const filteredIngredients = (formData.ingredientsDto || []).filter(
        (ing) => ing.productName && ing.productName.trim() !== ""
      );

      const recipeToSubmit = {
        ...formData,
        title: formData.title.trim(),
        text: formData.text.trim(),
        ingredientsDto: filteredIngredients,
      };

      console.log("Submitting recipe:", recipeToSubmit);

      await createRecipe(recipeToSubmit);
      navigate("/recipes");
    } catch (err: any) {
      setError(err.message || "Error creating recipe");
      console.error("Recipe creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <section className={styles.createRecipe}>
        <div className="container">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.createRecipe}>
      <div className="container">
        <div className={styles.form_wrapper}>
          <h1>Create Recipe</h1>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>
                Recipe Title <span className={styles.required}>*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className={styles.input}
                required
                placeholder="Enter recipe title"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Short Description</label>
              <textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                className={styles.textarea}
                rows={3}
                placeholder="Short recipe description"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Main Recipe Image (Cover)
              </label>
              <PhotoUploader
                onUpload={handleMainImageUpload}
                folder="recipe"
                initialUrl={formData.photoUrl || undefined}
              />
              <small className={styles.hint} style={{ marginTop: "0.5rem" }}>
                Or enter URL manually:
              </small>
              <input
                id="photoUrl"
                type="text"
                value={formData.photoUrl || ""}
                onChange={(e) => handleChange("photoUrl", e.target.value)}
                className={styles.input}
                style={{ marginTop: "0.5rem" }}
                placeholder="http://example.com/image.jpg (optional)"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Cooking Time (minutes) - deprecated field
              </label>
              <input
                id="cookingTime"
                type="number"
                min="1"
                max="1440"
                value={formData.cookingTime || ""}
                onChange={(e) => handleChange("cookingTime", Number(e.target.value))}
                className={styles.input}
                placeholder="30"
              />
              <small className={styles.hint}>
                Use PREP TIME and COOK TIME below
              </small>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Prep Time (PREP TIME, minutes)
              </label>
              <input
                id="prepTime"
                type="number"
                min="0"
                max="1440"
                value={formData.prepTime || ""}
                onChange={(e) => handleChange("prepTime", Number(e.target.value) || undefined)}
                className={styles.input}
                placeholder="15"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Cook Time (COOK TIME, minutes)
              </label>
              <input
                id="cookTime"
                type="number"
                min="0"
                max="1440"
                value={formData.cookTime || ""}
                onChange={(e) => handleChange("cookTime", Number(e.target.value) || undefined)}
                className={styles.input}
                placeholder="15"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Nutrition Information (optional)
              </label>
              <div className={styles.nutrition_grid}>
                <div>
                  <label htmlFor="calories" className={styles.sublabel}>
                    Calories (kcal)
                  </label>
                  <input
                    id="calories"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.calories || ""}
                    onChange={(e) => handleChange("calories", Number(e.target.value) || undefined)}
                    className={styles.input}
                    placeholder="219.8"
                  />
                </div>
                <div>
                  <label htmlFor="totalFat" className={styles.sublabel}>
                    Total Fat (g)
                  </label>
                  <input
                    id="totalFat"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.totalFat || ""}
                    onChange={(e) => handleChange("totalFat", Number(e.target.value) || undefined)}
                    className={styles.input}
                    placeholder="19.7"
                  />
                </div>
                <div>
                  <label htmlFor="protein" className={styles.sublabel}>
                    Protein (g)
                  </label>
                  <input
                    id="protein"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.protein || ""}
                    onChange={(e) => handleChange("protein", Number(e.target.value) || undefined)}
                    className={styles.input}
                    placeholder="7.8"
                  />
                </div>
                <div>
                  <label htmlFor="carbohydrates" className={styles.sublabel}>
                    Carbohydrates (g)
                  </label>
                  <input
                    id="carbohydrates"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.carbohydrates || ""}
                    onChange={(e) => handleChange("carbohydrates", Number(e.target.value) || undefined)}
                    className={styles.input}
                    placeholder="22.3"
                  />
                </div>
                <div>
                  <label htmlFor="cholesterol" className={styles.sublabel}>
                    Cholesterol (mg)
                  </label>
                  <input
                    id="cholesterol"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.cholesterol || ""}
                    onChange={(e) => handleChange("cholesterol", Number(e.target.value) || undefined)}
                    className={styles.input}
                    placeholder="37.4"
                  />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Categories</label>
              <div className={styles.categories_list}>
                {categories.map((cat) => (
                  <label key={cat.id} className={styles.category_checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.categoryDtos?.some((c) => c.id === cat.id) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            categoryDtos: [...(prev.categoryDtos || []), cat],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            categoryDtos: (prev.categoryDtos || []).filter((c) => c.id !== cat.id),
                          }));
                        }
                      }}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Ingredients</label>
              <div className={styles.ingredients_list}>
                {(formData.ingredientsDto || []).map((ing, index) => (
                  <div key={index} className={styles.ingredient_row}>
                    <input
                      type="text"
                      placeholder="Product name"
                      value={ing.productName || ""}
                      onChange={(e) => updateIngredient(index, "productName", e.target.value)}
                      className={styles.input}
                      style={{ flex: 2 }}
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={ing.quantity || ""}
                      onChange={(e) => updateIngredient(index, "quantity", Number(e.target.value))}
                      className={styles.input}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="Unit (g, ml, pcs)"
                      value={ing.unit || ""}
                      onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                      className={styles.input}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className={styles.remove_btn}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIngredient}
                  className={styles.add_btn}
                >
                  + Add Ingredient
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Recipe Description (Directions) <span className={styles.required}>*</span>
              </label>
              <small className={styles.hint} style={{ display: "block", marginBottom: "0.5rem" }}>
                Upload images below and click "Insert" to add them to the text at cursor position
              </small>
              <ImageUploader
                onImageInsert={handleImageInsert}
                folder="recipe-content"
              />
              <QuillEditor
                value={formData.text || ""}
                onChange={(value) => handleChange("text", value)}
                placeholder="Describe the recipe preparation steps..."
                onImageInsert={handleImageInsert}
              />
              <small className={styles.hint}>
                Use the toolbar to format text. Images can be inserted via the button above.
              </small>
            </div>

            <div className={styles.actions}>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Recipe"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/recipes")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
