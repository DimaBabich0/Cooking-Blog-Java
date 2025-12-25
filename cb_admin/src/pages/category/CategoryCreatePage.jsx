import React from "react";
import CategoryForm from "./CategoryForm.jsx";
import { createCategory } from "../../api/categoryApi.js";
import { CategoryDto } from "../../models/CategoryDto.js";

export default function CategoryCreatePage() {
    return <CategoryForm onSave={createCategory} categoryData={{ ...CategoryDto }} />;
}
