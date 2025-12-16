import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page.jsx";
import Table from "../../components/Table.jsx";
import { getRecipess, deleteRecipe } from "../../api/recipeApi.js";

export default function RecipessPage() {
    const navigate = useNavigate();
    const [recipes, setRecipess] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getRecipess();
        setRecipess(data);
        setLoading(false);
    }

    async function handleDelete(recipe) {
        if (!confirm(`Delete recipe "${recipe.title}"?`)) return;
        await deleteRecipe(recipe.id);
        setRecipess(recipes.filter(b => b.id !== recipe.id));
    }

    if (loading) return <p>Loading...</p>;

    return (
        <Page
            title="List of Recipess"
            actions={<button className="btn btn-create" onClick={() => navigate("/recipes/create")}>Create recipe</button>}
        >
            <Table
                columns={[
                    { label: "ID", key: "id"  },
                    { label: "Author", key: "username" },
                    { label: "Title", key: "title" },
                    { label: "Description", key: "description" },
                    { label: "Categories", key: "categories" },
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
