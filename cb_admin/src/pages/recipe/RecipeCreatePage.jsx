import React from "react";
import RecipeForm from "./RecipeForm.jsx";
import { createRecipe } from "../../api/RecipeApi.js";
import { RecipeDto } from "../../models/RecipeDto.js";

export default function RecipeCreatePage() {
    return <RecipeForm onSave={createRecipe} RecipeData={{ ...RecipeDto }} />;
}
