import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentForm from "./CommentForm.jsx";
import { getComment, updateComment } from "../../api/commentApi.js";
import { CommentDto } from "../../models/CommentDto.js";

export default function CommentEditPage() {
    const { id } = useParams();
    const [commentData, setCommentData] = useState({ ...CommentDto });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getComment(id);
            setCommentData(data);
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!commentData) return <p>Comment not found</p>;

    return <CommentForm commentData={commentData} onSave={data => updateComment(id, data)} />;
}
