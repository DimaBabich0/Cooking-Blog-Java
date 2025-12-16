import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecipeForm from "./RecipeForm.jsx";
import { getRecipe, updateRecipe } from "../../api/recipeApi.js";
import { RecipeDto } from "../../models/RecipeDto.js";

export default function RecipeEditPage() {
    const { id } = useParams();
    const [recipeData, setRecipeData] = useState({ ...RecipeDto });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, [id]);
    
    async function load() {
        const data = await getRecipe(id);
        setRecipeData(data);
        setLoading(false);
    }

    if (loading) return <p>Loading...</p>;
    if (!recipeData) return <p>Recipe not found</p>;

    return <RecipeForm recipeData={recipeData} onSave={data => updateRecipe(id, data)} />;
}
