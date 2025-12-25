import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ViewCard from "../../components/ViewCard.jsx";
import { getCategory, deleteCategory } from "../../api/categoryApi.js";
import { CategoryDto } from "../../models/CategoryDto.js";

export default function CategoryViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getCategory(id);
            setCategory({ ...CategoryDto, ...data });
            setLoading(false);
        }
        load();
    }, [id]);

    async function handleDelete() {
        if (!confirm("Delete this category?")) return;
        await deleteCategory(id);
        navigate("/categories");
    }

    if (loading) return <p>Loading...</p>;
    if (!category) return <p>Category not found</p>;

    const fields = [
        { label: "Name", value: category.name },
        { label: "Description", value: category.description },
    ];

    return (
        <ViewCard
            photoUrl={category.photoUrl && `http://localhost:8080/api/files/images/${category.photoUrl}`}
            title={`Id: #${id}`}
            fields={fields}
            actions={{
                onEdit: () => navigate(`/categories/${id}/edit`),
                onDelete: handleDelete,
                onBack: () => navigate("/categories")
            }}
        />
    );
}
