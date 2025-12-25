import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page.jsx";
import Table from "../../components/Table.jsx";
import { getProducts, deleteProduct } from "../../api/productApi.js";

export default function ProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    }

    async function handleDelete(product) {
        if (!confirm(`Delete product "${product.name}"?`)) return;
        await deleteProduct(product.id);
        setProducts(products.filter(p => p.id !== product.id));
    }

    if (loading) return <p>Loading...</p>;

    return (
        <Page
            title="List of Products"
            actions={<button className="btn btn-create" onClick={() => navigate("/products/create")}>Create Product</button>}
        >
            <Table
                columns={[
                    { key: "id", label: "ID" },
                    { key: "name", label: "Name" },
                ]}
                data={products}
                actions={[
                    { label: "View", type: "view", onClick: p => navigate(`/products/${p.id}`) },
                    { label: "Edit", type: "edit", onClick: p => navigate(`/products/${p.id}/edit`) },
                    { label: "Delete", type: "delete", onClick: handleDelete },
                ]}
            />
        </Page>
    );
}
