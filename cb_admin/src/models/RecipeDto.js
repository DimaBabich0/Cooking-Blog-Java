import { UserDto } from "./UserDto";

export const RecipeDto = {
    id: null,
    title: "",
    description: "",
    text: "",
    photoUrl: null,
    cookingTime: null,
    createdAt: null,
    updatedAt: null,
    userDto: { ...UserDto },
    categoriesDto: [],
    ingredientsDto: [],
};
