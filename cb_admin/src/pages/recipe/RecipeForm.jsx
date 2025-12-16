import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoUploader from "../../components/PhotoUploader.jsx";
import FormField from "../../components/FormField.jsx";
import ActionButtons from "../../components/ActionButtons.jsx";
import { RecipeDto } from "../../models/RecipeDto.js";
import "../../css/Form.css"
import { getUsers } from "../../api/userApi.js";
import { getCategories } from "../../api/categoryApi.js";
import { getIngredients } from "../../api/ingredientApi.js";


export default function RecipeForm({ recipeData = {}, onSave }) {
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({ ...RecipeDto, ...recipeData });
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        loadUsers();
        loadCategories();
        loadIngredients();
        setLoading(false);
    }, []);

    async function loadUsers() {
        const data = await getUsers();
        setUsers(data);
    }

    async function loadCategories() {
        const data = await getCategories();
        setCategories(data);
    }

    async function loadIngredients() {
        const data = await getIngredients();
        setIngredients(data);
    }

    async function handleSave() {
        await onSave(recipe);
        navigate("/recipes");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="form-container">
            <div className="form-card">
                <PhotoUploader
                    folder="recipe"
                    initialUrl={recipe.photoUrl}
                    onUpload={url => setRecipe({ ...recipe, photoUrl: url })}
                />

                <FormField
                    label="Title"
                    value={recipe.title}
                    onChange={e => setRecipe({ ...recipe, title: e.target.value })}
                />

                <FormField
                    label="Description"
                    value={recipe.description}
                    onChange={e => setRecipe({ ...recipe, description: e.target.value })}
                />

                <FormField
                    label="Text"
                    value={recipe.text}
                    onChange={e => setRecipe({ ...recipe, text: e.target.value })}
                />

                <FormField
                    label="Cooking time (minutes)"
                    type="number"
                    value={recipe.cookingTime}
                    onChange={e => setBlog({ ...recipe, cookingTime: e.target.value })}
                    min="1" max="1440"
                />

                <UserSelect
                    label="Author"
                    value={users.find(u => u.id === blog.userId)}
                    onChange={id => setBlog({ ...blog, userId: id })}
                />

                {/* Add selector of categories */}
                {/* Add selector of ingredients */}

                <ActionButtons
                    onSave={handleSave}
                    onBack={() => navigate("/recipes")}
                />
            </div>
        </div>
    );
}
