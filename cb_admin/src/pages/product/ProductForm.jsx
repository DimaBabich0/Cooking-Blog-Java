import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../../components/FormField.jsx";
import ActionButtons from "../../components/ActionButtons.jsx";
import { ProductDto } from "../../models/ProductDto.js";
import "../../css/Form.css"

export default function ProductForm({ productData = {}, onSave }) {
    const navigate = useNavigate();
    const [product, setProduct] = useState({ ...ProductDto, ...productData });

    async function handleSave() {
        await onSave(product);
        navigate("/products");
    }

    return (
        <div className="form-container">
            <div className="form-card">
                <FormField
                    label="Name"
                    value={product.name}
                    onChange={e => setProduct({ ...product, name: e.target.value })}
                />
                <ActionButtons
                    onSave={handleSave}
                    onBack={() => navigate("/products")}
                />
            </div>
        </div>
    );
}
