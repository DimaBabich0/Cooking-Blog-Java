import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PhotoUploader from "../../components/PhotoUploader.jsx";
import FormField from "../../components/FormField.jsx";
import ActionButtons from "../../components/ActionButtons.jsx";
import UserSelect from "../../components/UserSelect.jsx";
import CategoryMultiSelect from "../../components/CategoryMultiSelect.jsx";
import IngredientsEditor from "../../components/IngredientsEditor.jsx";

import { RecipeDto } from "../../models/RecipeDto.js";
import { getUsers } from "../../api/userApi.js";
import { getCategories } from "../../api/categoryApi.js";

import "../../css/Form.css";

export default function RecipeForm({ recipeData = {}, onSave }) {
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState({...RecipeDto, ...recipeData,});

    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const [usersData, categoriesData] = await Promise.all([
            getUsers(),
            getCategories()
        ]);

        setUsers(usersData);
        setCategories(categoriesData);
        setLoading(false);
    }

    async function handleSave() {
        console.log(recipe);
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
                    onUpload={url =>
                        setRecipe({ ...recipe, photoUrl: url })
                    }
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
                    type="textarea"
                    value={recipe.text}
                    onChange={e => setRecipe({ ...recipe, text: e.target.value })}
                />
                <FormField
                    label="Cooking time (minutes)"
                    type="number"
                    min="1"
                    max="1440"
                    value={recipe.cookingTime || ""}
                    onChange={e => setRecipe({...recipe, cookingTime: Number(e.target.value)})}
                />
                <UserSelect
                    label="Author"
                    value={users.find(u => u.id === recipe.userDto.id)}
                    onChange={id => setRecipe({...recipe, userDto: { ...recipe.userDto, id }})}
                />
                <CategoryMultiSelect
                    categories={categories}
                    value={recipe.categoriesDto || []}
                    onChange={list => setRecipe({...recipe, categoriesDto: list})}
                />
                <IngredientsEditor
                    ingredients={recipe.ingredientsDto || []}
                    onChange={list => setRecipe({...recipe, ingredientsDto: list})}
                />

                <ActionButtons
                    onSave={handleSave}
                    onBack={() => navigate("/recipes")}
                />
            </div>
        </div>
    );
}
