import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import PhotoUploader from "../../components/PhotoUploader.jsx";
import FormField from "../../components/FormField.jsx";
import ActionButtons from "../../components/ActionButtons.jsx";
import UserSelect from "../../components/UserSelect.jsx";
import CategoryMultiSelect from "../../components/CategoryMultiSelect.jsx";
import IngredientsEditor from "../../components/IngredientsEditor.jsx";
import ImageUploader from "../../components/ImageUploader.jsx";
import QuillEditor from "../../components/QuillEditor.jsx";

import { RecipeDto } from "../../models/RecipeDto.js";
import { getUsers } from "../../api/userApi.js";
import { getCategories } from "../../api/categoryApi.js";

import "../../css/Form.css";

export default function RecipeForm({ recipeData = {}, onSave }) {
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({ ...RecipeDto, ...recipeData });

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  function handleImageInsert(imgTag, imagePath) {
    // Используем глобальную функцию для вставки изображения в Quill
    if (window.__quillInsertImage) {
      window.__quillInsertImage(imgTag);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [usersData, categoriesData] = await Promise.all([
      getUsers(),
      getCategories(),
    ]);

    setUsers(usersData);
    setCategories(categoriesData);
    setLoading(false);
  }

  async function handleSave() {
    // Валидация обязательных полей
    if (!recipe.title || recipe.title.trim() === "") {
      alert("Title is required");
      return;
    }
    if (!recipe.text || recipe.text.trim() === "") {
      alert("Text is required");
      return;
    }
    if (!recipe.userDto || !recipe.userDto.id) {
      alert("Author is required");
      return;
    }

    // Подготавливаем данные для отправки
    // Убеждаемся, что userDto.id - это число, а не объект
    const userId = recipe.userDto.id;
    if (userId && typeof userId === "object") {
      alert("Invalid user ID format. Please select a user again.");
      return;
    }

    const recipeToSave = {
      ...recipe,
      userDto: { id: userId }, // Отправляем только ID пользователя
      categoriesDto: (recipe.categoriesDto || []).map((cat) => ({
        id: cat.id,
      })), // Отправляем только ID категорий
      ingredientsDto: (recipe.ingredientsDto || [])
        .filter((ing) => ing.productName && ing.productName.trim() !== "")
        .map((ing) => ({
          productName: ing.productName,
          quantity: ing.quantity || 0.0,
          unit: ing.unit || "g",
        })),
    };

    console.log("Saving recipe:", JSON.stringify(recipeToSave, null, 2));
    try {
      await onSave(recipeToSave);
      navigate("/recipes");
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert(error.message || "Error saving recipe");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <div className="form-card">
        <PhotoUploader
          folder="recipe"
          initialUrl={recipe.photoUrl}
          onUpload={(url) => setRecipe({ ...recipe, photoUrl: url })}
        />

        <FormField
          label="Title"
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
        />
        <FormField
          label="Description"
          value={recipe.description}
          onChange={(e) =>
            setRecipe({ ...recipe, description: e.target.value })
          }
        />
        <div className="form-field" style={{ width: "100%" }}>
          <label className="form-label">Images for text:</label>
          <ImageUploader
            onImageInsert={handleImageInsert}
            folder="recipe-content"
          />
        </div>

        <div className="form-field" style={{ width: "100%" }}>
          <label className="form-label">Text (Directions):</label>
          <QuillEditor
            value={recipe.text || ""}
            onChange={(value) => setRecipe({ ...recipe, text: value })}
            placeholder="Опишите шаги приготовления рецепта..."
            onImageInsert={handleImageInsert}
          />
        </div>
        <FormField
          label="Cooking time (minutes) - устаревшее поле"
          type="number"
          min="1"
          max="1440"
          value={recipe.cookingTime || ""}
          onChange={(e) =>
            setRecipe({ ...recipe, cookingTime: Number(e.target.value) })
          }
        />
        <FormField
          label="Prep time (minutes)"
          type="number"
          min="0"
          max="1440"
          value={recipe.prepTime || ""}
          onChange={(e) =>
            setRecipe({ ...recipe, prepTime: Number(e.target.value) || null })
          }
        />
        <FormField
          label="Cook time (minutes)"
          type="number"
          min="0"
          max="1440"
          value={recipe.cookTime || ""}
          onChange={(e) =>
            setRecipe({ ...recipe, cookTime: Number(e.target.value) || null })
          }
        />

        <div style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
          <h3
            style={{
              marginBottom: "1rem",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            Nutrition Information (опционально)
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <FormField
              label="Calories (kcal)"
              type="number"
              step="0.1"
              min="0"
              value={recipe.calories || ""}
              onChange={(e) =>
                setRecipe({
                  ...recipe,
                  calories: Number(e.target.value) || null,
                })
              }
            />
            <FormField
              label="Total Fat (g)"
              type="number"
              step="0.1"
              min="0"
              value={recipe.totalFat || ""}
              onChange={(e) =>
                setRecipe({
                  ...recipe,
                  totalFat: Number(e.target.value) || null,
                })
              }
            />
            <FormField
              label="Protein (g)"
              type="number"
              step="0.1"
              min="0"
              value={recipe.protein || ""}
              onChange={(e) =>
                setRecipe({
                  ...recipe,
                  protein: Number(e.target.value) || null,
                })
              }
            />
            <FormField
              label="Carbohydrates (g)"
              type="number"
              step="0.1"
              min="0"
              value={recipe.carbohydrates || ""}
              onChange={(e) =>
                setRecipe({
                  ...recipe,
                  carbohydrates: Number(e.target.value) || null,
                })
              }
            />
            <FormField
              label="Cholesterol (mg)"
              type="number"
              step="0.1"
              min="0"
              value={recipe.cholesterol || ""}
              onChange={(e) =>
                setRecipe({
                  ...recipe,
                  cholesterol: Number(e.target.value) || null,
                })
              }
            />
          </div>
        </div>

        <UserSelect
          label="Author"
          value={
            recipe.userDto && recipe.userDto.id
              ? users.find((u) => u.id === recipe.userDto.id)
              : null
          }
          onChange={(user) => {
            // UserSelect передает объект пользователя, нужно извлечь id
            const userId =
              user && typeof user === "object" && user.id ? user.id : null;
            setRecipe({ ...recipe, userDto: { id: userId } });
          }}
        />
        <CategoryMultiSelect
          categories={categories}
          value={recipe.categoriesDto || []}
          onChange={(list) => setRecipe({ ...recipe, categoriesDto: list })}
        />
        <IngredientsEditor
          ingredients={recipe.ingredientsDto || []}
          onChange={(list) => setRecipe({ ...recipe, ingredientsDto: list })}
        />

        <ActionButtons
          onSave={handleSave}
          onBack={() => navigate("/recipes")}
        />
      </div>
    </div>
  );
}
