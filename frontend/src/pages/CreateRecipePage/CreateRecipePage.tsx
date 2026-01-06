import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe, RecipeDto, IngredientDto } from "../../api/recipeApi";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  // Загружаем данные при загрузке страницы
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
          // Если пользователь не залогинен, загружаем первого пользователя
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
        setError("Ошибка загрузки данных");
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
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      // ImageUploader уже передает готовый HTML тег, просто вставляем его
      const newText = before + imageHtml + "\n" + after;
      handleChange("text", newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + imageHtml.length + 1, start + imageHtml.length + 1);
      }, 0);
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
      // Валидация обязательных полей
      if (!formData.title || formData.title.trim() === "") {
        setError("Заполните название рецепта");
        setLoading(false);
        return;
      }

      if (!formData.text || formData.text.trim() === "") {
        setError("Заполните описание рецепта (Directions)");
        setLoading(false);
        return;
      }

      if (!formData.userDto?.id) {
        setError("Не выбран автор рецепта");
        setLoading(false);
        return;
      }

      // Фильтруем пустые ингредиенты перед отправкой
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
      setError(err.message || "Ошибка создания рецепта");
      console.error("Recipe creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <section className={styles.createRecipe}>
        <div className="container">
          <p>Загрузка...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.createRecipe}>
      <div className="container">
        <div className={styles.form_wrapper}>
          <h1>Создать рецепт</h1>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>
                Название рецепта <span className={styles.required}>*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className={styles.input}
                required
                placeholder="Введите название рецепта"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Краткое описание</label>
              <textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                className={styles.textarea}
                rows={3}
                placeholder="Краткое описание рецепта"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Главное изображение рецепта (обложка)
              </label>
              <PhotoUploader
                onUpload={handleMainImageUpload}
                folder="recipe"
                initialUrl={formData.photoUrl || undefined}
              />
              <small className={styles.hint} style={{ marginTop: "0.5rem" }}>
                Или введите URL вручную:
              </small>
              <input
                id="photoUrl"
                type="text"
                value={formData.photoUrl || ""}
                onChange={(e) => handleChange("photoUrl", e.target.value)}
                className={styles.input}
                style={{ marginTop: "0.5rem" }}
                placeholder="http://example.com/image.jpg (опционально)"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Время приготовления (минуты)
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
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Категории</label>
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
              <label className={styles.label}>Ингредиенты</label>
              <div className={styles.ingredients_list}>
                {(formData.ingredientsDto || []).map((ing, index) => (
                  <div key={index} className={styles.ingredient_row}>
                    <input
                      type="text"
                      placeholder="Название продукта"
                      value={ing.productName || ""}
                      onChange={(e) => updateIngredient(index, "productName", e.target.value)}
                      className={styles.input}
                      style={{ flex: 2 }}
                    />
                    <input
                      type="number"
                      placeholder="Количество"
                      value={ing.quantity || ""}
                      onChange={(e) => updateIngredient(index, "quantity", Number(e.target.value))}
                      className={styles.input}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="Ед. изм. (г, мл, шт)"
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
                      Удалить
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIngredient}
                  className={styles.add_btn}
                >
                  + Добавить ингредиент
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Описание рецепта (Directions) <span className={styles.required}>*</span>
              </label>
              <small className={styles.hint}>
                Опишите шаги приготовления. Вы можете добавлять изображения прямо в текст.
              </small>
              <ImageUploader
                onImageInsert={handleImageInsert}
                folder="recipe"
              />
              <textarea
                ref={textareaRef}
                id="text"
                value={formData.text || ""}
                onChange={(e) => handleChange("text", e.target.value)}
                className={styles.textarea}
                rows={15}
                required
                placeholder="Опишите шаги приготовления рецепта..."
              />
              <small className={styles.hint}>
                Подсказка: Вы можете использовать HTML теги для форматирования. Изображения можно вставлять через кнопку выше.
              </small>
            </div>

            <div className={styles.actions}>
              <Button type="submit" disabled={loading}>
                {loading ? "Создание..." : "Создать рецепт"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/recipes")}
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
