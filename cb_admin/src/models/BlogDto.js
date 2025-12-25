import { UserDto } from "./UserDto";

export const BlogDto = {
    id: null,
    title: "",
    description: "",
    text: "",
    photoUrl: "",
    cookingTime: null,
    createdAt: null,
    updatedAt: null,
    userDto: { ...UserDto },
};
