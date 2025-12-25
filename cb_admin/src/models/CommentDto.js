import { UserDto } from "./UserDto";

export const CommentDto = {
    id: null,
    text: null,
    createdAt: null,
    updatedAt: null,
    recipeId: null,
    userDto: { ...UserDto },
};
