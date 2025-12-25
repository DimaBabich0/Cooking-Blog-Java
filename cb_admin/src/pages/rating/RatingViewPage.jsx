import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ViewCard from "../../components/ViewCard.jsx";
import { getRating, deleteRating } from "../../api/ratingApi.js";
import { RatingDto } from "../../models/RatingDto.js";

export default function RatingViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getRating(id);
            setRating({ ...RatingDto, ...data });
            setLoading(false);
        }
        load();
    }, [id]);

    async function handleDelete() {
        if (!confirm("Delete this rating?")) return;
        await deleteRating(id);
        navigate("/ratings");
    }

    if (loading) return <p>Loading...</p>;
    if (!rating) return <p>Rating not found</p>;

    const fields = [
        { label: "User ID", value: rating.userId },
        { label: "Recipe ID", value: rating.recipeId },
        { label: "Rating", value: rating.rating },
    ];

    return (
        <ViewCard
            title={`Id: #${id}`}
            fields={fields}
            actions={{
                onEdit: () => navigate(`/ratings/${id}/edit`),
                onDelete: handleDelete,
                onBack: () => navigate("/ratings")
            }}
        />
    );
}
