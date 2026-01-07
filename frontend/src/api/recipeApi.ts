const RECIPE_API = "http://localhost:8080/api/recipes";

export interface IngredientDto {
  recipeId?: number;
  productId?: number;
  productName: string;
  quantity?: number;
  unit?: string;
}

export interface RecipeDto {
  id: number;
  title: string;
  description?: string;
  text: string;
  photoUrl?: string;
  cookingTime?: number; // Оставляем для обратной совместимости
  prepTime?: number;
  cookTime?: number;
  // Nutrition Information
  calories?: number;
  totalFat?: number;
  protein?: number;
  carbohydrates?: number;
  cholesterol?: number;
  status?: string; // PENDING, PUBLISHED, REJECTED
  createdAt: string;
  updatedAt: string;
  userDto: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
  };
  categoryDtos?: Array<{
    id: number;
    name: string;
    description?: string;
    photoUrl?: string;
  }>;
  ingredientsDto?: IngredientDto[];
}

export async function getRecipes(): Promise<RecipeDto[]> {
  const res = await fetch(RECIPE_API);
  if (!res.ok) throw new Error("Error loading recipes");
  return res.json();
}

export async function getRecipe(id: number | string): Promise<RecipeDto> {
  const res = await fetch(`${RECIPE_API}/${id}`);
  if (!res.ok) {
    let errorMessage = "Error loading recipe";
    try {
      const text = await res.text();
      if (text) {
        try {
          const err = JSON.parse(text);
          errorMessage = err.error || err.message || errorMessage;
        } catch (parseError) {
          errorMessage = text || `Server error: ${res.status} ${res.statusText}`;
        }
      } else {
        errorMessage = `Server error: ${res.status} ${res.statusText}`;
      }
    } catch (e) {
      errorMessage = `Server error: ${res.status} ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function updateRecipe(id: number, recipe: Partial<RecipeDto>): Promise<RecipeDto> {
  const res = await fetch(`${RECIPE_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(recipe),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error updating recipe");
  }
  return res.json();
}

export async function deleteRecipe(id: number): Promise<void> {
  const res = await fetch(`${RECIPE_API}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Error deleting recipe");
  }
}

export async function createRecipe(recipe: Partial<RecipeDto>): Promise<RecipeDto> {
  // Подготавливаем данные для отправки
  const payload: any = {
    title: recipe.title,
    text: recipe.text,
  };

  // Добавляем опциональные поля только если они есть
  if (recipe.description) {
    payload.description = recipe.description;
  }
  if (recipe.photoUrl) {
    payload.photoUrl = recipe.photoUrl;
  }
  if (recipe.cookingTime) {
    payload.cookingTime = recipe.cookingTime;
  }
  if (recipe.userDto?.id) {
    payload.userDto = { id: recipe.userDto.id };
  }
  if (recipe.categoryDtos && recipe.categoryDtos.length > 0) {
    payload.categoriesDto = recipe.categoryDtos.map(cat => ({ id: cat.id }));
  }
  if (recipe.ingredientsDto && recipe.ingredientsDto.length > 0) {
    payload.ingredientsDto = recipe.ingredientsDto.filter(
      ing => ing.productName && ing.productName.trim() !== ""
    );
  }

  console.log("Sending recipe payload:", JSON.stringify(payload, null, 2));

  const res = await fetch(RECIPE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    let errorMessage = "Error creating recipe";
    try {
      const text = await res.text();
      console.error("Server error response:", text);
      if (text) {
        try {
          const err = JSON.parse(text);
          errorMessage = err.error || err.message || errorMessage;
        } catch (parseError) {
          errorMessage = text || `Server error: ${res.status} ${res.statusText}`;
        }
      } else {
        errorMessage = `Server error: ${res.status} ${res.statusText}`;
      }
    } catch (e) {
      errorMessage = `Server error: ${res.status} ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}
