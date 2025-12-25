import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoUploader from "../../components/PhotoUploader.jsx";
import FormField from "../../components/FormField.jsx";
import ActionButtons from "../../components/ActionButtons.jsx";
import { CategoryDto } from "../../models/CategoryDto.js";
import "../../css/Form.css"

export default function CategoryForm({ categoryData = {}, onSave }) {
    const navigate = useNavigate();
    const [category, setCategory] = useState({ ...CategoryDto, ...categoryData });

    async function handleSave() {
        await onSave(category);
        navigate("/categories");
    }

    return (
        <div className="form-container">
            <div className="form-card">
                <PhotoUploader
                    folder="category"
                    initialUrl={category.photoUrl}
                    onUpload={url => setCategory({ ...category, photoUrl: url })}
                />
                <FormField
                    label="Name"
                    value={category.name}
                    onChange={e => setCategory({ ...category, name: e.target.value })}
                />
                <FormField
                    label="Description"
                    value={category.description}
                    onChange={e => setCategory({ ...category, description: e.target.value })}
                />
                <ActionButtons
                    onSave={handleSave}
                    onBack={() => navigate("/categories")}
                />
            </div>
        </div>
    );
}
