import { UserDto } from "./UserDto";

export const RecipeDto = {
    id: null,
    title: "",
    description: "",
    text: "",
    photoUrl: null,
    cookingTime: null, // Устаревшее поле (для обратной совместимости)
    prepTime: null,
    cookTime: null,
    // Nutrition Information
    calories: null,
    totalFat: null,
    protein: null,
    carbohydrates: null,
    cholesterol: null,
    createdAt: null,
    updatedAt: null,
    userDto: { ...UserDto },
    categoriesDto: [],
    ingredientsDto: [],
};
