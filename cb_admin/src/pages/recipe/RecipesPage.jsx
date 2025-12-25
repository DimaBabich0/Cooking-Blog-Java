import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page.jsx";
import Table from "../../components/Table.jsx";
import { getRecipes, deleteRecipe } from "../../api/recipeApi.js";

export default function RecipesPage() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getRecipes();
        console.log(data[0]);
        setRecipes(data);
        setLoading(false);
    }

    async function handleDelete(recipe) {
        if (!confirm(`Delete recipe "${recipe.title}"?`)) return;
        await deleteRecipe(recipe.id);
        setRecipes(recipes.filter(b => b.id !== recipe.id));
    }

    if (loading) return <p>Loading...</p>;

    return (
        <Page
            title="List of Recipes"
            actions={<button className="btn btn-create" onClick={() => navigate("/recipes/create")}>Create recipe</button>}
        >
            <Table
                columns={[
                    { label: "ID", key: "id"  },
                    { label: "Author", render: recipe => recipe.userDto?.username ?? "—"},
                    { label: "Title", key: "title" },
                    { label: "Description", key: "description" },
                    { label: "Categories", render: recipe => recipe.categoriesDto.length ? recipe.categoriesDto.map(c => c.name).join(", ") : "—"},
                ]}
                data={recipes}
                actions={[
                    { label: "View", type: "view", onClick: b => navigate(`/recipes/${b.id}`) },
                    { label: "Edit", type: "edit", onClick: b => navigate(`/recipes/${b.id}/edit`) },
                    { label: "Delete", type: "delete", onClick: handleDelete },
                ]}
            />
        </Page>
    );
}
