import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ViewCard from "../../components/ViewCard.jsx";
import { getRecipe, deleteRecipe } from "../../api/recipeApi.js";
import { format } from "date-fns";
import { RecipeDto } from "../../models/RecipeDto.js";

export default function RecipeViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const recipe = await getRecipe(id);
        setRecipe({...RecipeDto, ...recipe});
        console.log(recipe);
        setLoading(false);
    }

    async function handleDelete() {
        if (!confirm("Delete this recipe?")) return;
        await deleteRecipe(id);
        navigate("/recipes");
    }

    if (loading) return <p>Loading...</p>;
    if (!recipe) return <p>Recipe not found</p>;

    const fields = [
        { label: "Title", value: recipe.title },
        { label: "Author", value: recipe.userDto?.username || "N/A" },
        { label: "Description", value: recipe.description || "N/A" },
        { label: "Text", value: recipe.text || "N/A" },
        { label: "Cooking time (устаревшее)", value: recipe.cookingTime ? `${recipe.cookingTime} minutes` : "N/A" },
        { label: "Prep time", value: recipe.prepTime ? `${recipe.prepTime} minutes` : "N/A" },
        { label: "Cook time", value: recipe.cookTime ? `${recipe.cookTime} minutes` : "N/A" },
        { label: "Create date", value: recipe.createdAt ? format(new Date(recipe.createdAt), "HH:mm:ss, d MMMM yyyy") : "N/A" },
        { label: "Update date", value: recipe.updatedAt ? format(new Date(recipe.updatedAt), "HH:mm:ss, d MMMM yyyy") : "N/A" },
        { label: "Categories", value: recipe.categoriesDto?.length > 0 ? recipe.categoriesDto.map(c => c.name).join(", ") : "N/A" },
        { label: "Ingredients", value:
                recipe.ingredientsDto?.length > 0 ? recipe.ingredientsDto.map(i =>
                    `${i.productName} — ${i.quantity} ${i.unit || "g"}`
                ).join("; ") : "N/A"
        },
        // Nutrition Information
        { label: "Calories", value: recipe.calories ? `${recipe.calories.toFixed(1)} kcal` : "N/A" },
        { label: "Total Fat", value: recipe.totalFat ? `${recipe.totalFat.toFixed(1)} g` : "N/A" },
        { label: "Protein", value: recipe.protein ? `${recipe.protein.toFixed(1)} g` : "N/A" },
        { label: "Carbohydrates", value: recipe.carbohydrates ? `${recipe.carbohydrates.toFixed(1)} g` : "N/A" },
        { label: "Cholesterol", value: recipe.cholesterol ? `${recipe.cholesterol.toFixed(1)} mg` : "N/A" },
    ];

    return (
        <ViewCard
            photoUrl={recipe.photoUrl && `http://localhost:8080/api/files/images/${recipe.photoUrl}`}
            title={`Id: #${id}`}
            fields={fields}
            actions={{
                onEdit: () => navigate(`/recipes/${id}/edit`),
                onDelete: handleDelete,
                onBack: () => navigate("/recipes")
            }}
        />
    );
}
