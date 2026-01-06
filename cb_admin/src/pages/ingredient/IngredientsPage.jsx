import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page.jsx";
import Table from "../../components/Table.jsx";
import { getIngredients } from "../../api/ingredientApi.js";

export default function IngredientsPage() {
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getIngredients();
        setIngredients(data);
        setLoading(false);
    }

    if (loading) return <p>Loading...</p>;

    return (
        <Page
            title="Ingredients"
        >
            <Table
                columns={[
                    { label: "Recipe Id", key: "recipeId" },
                    { label: "Product", key: "productName" },
                    { label: "Quantity", key: "quantity" },
                    { label: "Unit", key: "unit" },
                ]}
                data={ingredients}
                actions={[
                    { label: "View", type: "view", onClick: i => navigate(`/recipes/${i.recipeId}`) },
                ]}
            />
        </Page>
    );
}
