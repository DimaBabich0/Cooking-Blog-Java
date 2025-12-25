import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryForm from "./CategoryForm.jsx";
import { getCategory, updateCategory } from "../../api/categoryApi.js";
import { CategoryDto } from "../../models/CategoryDto.js";

export default function CategoryEditPage() {
    const { id } = useParams();
    const [categoryData, setCategoryData] = useState({ ...CategoryDto });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getCategory(id);
            setCategoryData(data);
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!categoryData) return <p>Category not found</p>;

    return <CategoryForm categoryData={categoryData} onSave={data => updateCategory(id, data)} />;
}
