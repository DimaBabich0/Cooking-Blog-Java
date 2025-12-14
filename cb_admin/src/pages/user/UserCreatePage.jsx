import React from "react";
import UserForm from "./UserForm.jsx";
import { createUser } from "../../api/userApi.js";
import { UserDto } from "../../models/UserDto.js";

export default function UserCreatePage() {
    return <UserForm onSave={createUser} userData={{ ...UserDto }} />;
}
