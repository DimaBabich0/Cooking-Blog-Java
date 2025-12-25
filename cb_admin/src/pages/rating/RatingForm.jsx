import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../../components/FormField.jsx";
import ActionButtons from "../../components/ActionButtons.jsx";
import { RatingDto } from "../../models/RatingDto.js";
import { getUsers } from "../../api/userApi.js";
import { getRecipes } from "../../api/recipeApi.js";
import UserSelect from "../../components/UserSelect.jsx";
import RecipeSelect from "../../components/RecipeSelect.jsx";
import "../../css/Form.css"

export default function RatingForm({ ratingData = {}, onSave }) {
    const navigate = useNavigate();
    const [rating, setRating] = useState({ ...RatingDto, ...ratingData });
    const [users, setUsers] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        const [usersData, recipesData] = await Promise.all([getUsers(), getRecipes()]);
        setUsers(usersData);
        setRecipes(recipesData);
        setLoading(false);
    }

    async function handleSave() {
        await onSave(rating);
        navigate("/ratings");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="form-container">
            <div className="form-card">
                <UserSelect
                    label="User"
                    value={users.find(u => u.id === rating.userId)}
                    onChange={id => setRating({ ...rating, userId: id })}
                />
                <RecipeSelect
                    label="Recipe"
                    recipes={recipes}
                    value={rating.recipeId}
                    onChange={id => setRating({ ...rating, recipeId: id })}
                />
                <FormField
                    label="Rating"
                    type="number"
                    min="0"
                    max="5"
                    value={rating.rating}
                    onChange={e => setRating({ ...rating, rating: e.target.value })}
                />
                <ActionButtons
                    onSave={handleSave}
                    onBack={() => navigate("/ratings")}
                />
            </div>
        </div>
    );
}
