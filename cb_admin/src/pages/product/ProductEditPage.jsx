import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductForm from "./ProductForm.jsx";
import { getProduct, updateProduct } from "../../api/productApi.js";
import { ProductDto } from "../../models/ProductDto.js";

export default function ProductEditPage() {
    const { id } = useParams();
    const [productData, setProductData] = useState({ ...ProductDto });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getProduct(id);
            setProductData(data);
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!productData) return <p>Product not found</p>;

    return <ProductForm productData={productData} onSave={data => updateProduct(id, data)} />;
}
