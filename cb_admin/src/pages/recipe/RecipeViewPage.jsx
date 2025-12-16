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
        { label: "Author", value: recipe.userDto.username },
        { label: "Description", value: recipe.description },
        { label: "Text", value: recipe.text },
        { label: "Cooking time", value: `${recipe.cookingTime} minutes` },
        { label: "Create date", value: format(new Date(recipe.createdAt), "HH:mm:ss, d MMMM yyyy") },
        { label: "Update date", value: format(new Date(recipe.updatedAt), "HH:mm:ss, d MMMM yyyy") },
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
