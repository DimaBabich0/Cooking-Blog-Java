import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page.jsx";
import Table from "../../components/Table.jsx";
import { getCategories, deleteCategory } from "../../api/categoryApi.js";

export default function CategoriesPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
    }

    async function handleDelete(category) {
        if (!confirm(`Delete category "${category.name}"?`)) return;
        await deleteCategory(category.id);
        setCategories(categories.filter(c => c.id !== category.id));
    }

    if (loading) return <p>Loading...</p>;

    return (
        <Page
            title="List of Categories"
            actions={<button className="btn btn-create" onClick={() => navigate("/categories/create")}>Create Category</button>}
        >
            <Table
                columns={[
                    { key: "id", label: "ID" },
                    { key: "name", label: "Name" },
                    { key: "description", label: "Description" },
                ]}
                data={categories}
                actions={[
                    { label: "View", type: "view", onClick: c => navigate(`/categories/${c.id}`) },
                    { label: "Edit", type: "edit", onClick: c => navigate(`/categories/${c.id}/edit`) },
                    { label: "Delete", type: "delete", onClick: handleDelete },
                ]}
            />
        </Page>
    );
}
