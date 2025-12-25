import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ViewCard from "../../components/ViewCard.jsx";
import { getComment, deleteComment } from "../../api/commentApi.js";
import { CommentDto } from "../../models/CommentDto.js";

export default function CommentViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [comment, setComment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getComment(id);
            setComment({ ...CommentDto, ...data });
            setLoading(false);
        }
        load();
    }, [id]);

    async function handleDelete() {
        if (!confirm("Delete this comment?")) return;
        await deleteComment(id);
        navigate("/comments");
    }

    if (loading) return <p>Loading...</p>;
    if (!comment) return <p>Comment not found</p>;

    const fields = [
        { label: "User", value: comment.userDto.username },
        { label: "Recipe ID", value: comment.recipeId },
        { label: "Text", value: comment.text },
    ];

    return (
        <ViewCard
            title={`Id: #${id}`}
            fields={fields}
            actions={{
                onEdit: () => navigate(`/comments/${id}/edit`),
                onDelete: handleDelete,
                onBack: () => navigate("/comments")
            }}
        />
    );
}
