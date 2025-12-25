import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../../components/FormField.jsx";
import ActionButtons from "../../components/ActionButtons.jsx";
import { CommentDto } from "../../models/CommentDto.js";
import { getUsers } from "../../api/userApi.js";
import { getRecipes } from "../../api/recipeApi.js";
import UserSelect from "../../components/UserSelect.jsx";
import RecipeSelect from "../../components/RecipeSelect.jsx";
import "../../css/Form.css"

export default function CommentForm({ commentData = {}, onSave }) {
    const navigate = useNavigate();
    const [comment, setComment] = useState({ ...CommentDto, ...commentData });
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
        await onSave(comment);
        navigate("/comments");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="form-container">
            <div className="form-card">
                <UserSelect
                    label="User"
                    value={users.find(u => u.id === comment.userDto.id)}
                    onChange={id => setComment({ ...comment, userDto: { ...comment.userDto, id } })}
                />
                <RecipeSelect
                    label="Recipe"
                    recipes={recipes}
                    value={comment.recipeId}
                    onChange={id => setComment({ ...comment, recipeId: id })}
                />
                <FormField
                    label="Text"
                    type="textarea"
                    value={comment.text}
                    onChange={e => setComment({ ...comment, text: e.target.value })}
                />
                <ActionButtons
                    onSave={handleSave}
                    onBack={() => navigate("/comments")}
                />
            </div>
        </div>
    );
}
