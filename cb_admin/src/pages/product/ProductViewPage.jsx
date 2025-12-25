import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ViewCard from "../../components/ViewCard.jsx";
import { getProduct, deleteProduct } from "../../api/productApi.js";
import { ProductDto } from "../../models/ProductDto.js";

export default function ProductViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getProduct(id);
            setProduct({ ...ProductDto, ...data });
            setLoading(false);
        }
        load();
    }, [id]);

    async function handleDelete() {
        if (!confirm("Delete this product?")) return;
        await deleteProduct(id);
        navigate("/products");
    }

    if (loading) return <p>Loading...</p>;
    if (!product) return <p>Product not found</p>;

    const fields = [
        { label: "Name", value: product.name },
    ];

    return (
        <ViewCard
            title={`Id: #${id}`}
            fields={fields}
            actions={{
                onEdit: () => navigate(`/products/${id}/edit`),
                onDelete: handleDelete,
                onBack: () => navigate("/products")
            }}
        />
    );
}
