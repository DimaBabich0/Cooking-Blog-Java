import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page.jsx";
import Table from "../../components/Table.jsx";
import { getComments, deleteComment } from "../../api/commentApi.js";

export default function CommentsPage() {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getComments();
        setComments(data);
        setLoading(false);
    }

    async function handleDelete(comment) {
        if (!confirm(`Delete comment?`)) return;
        await deleteComment(comment.id);
        setComments(comments.filter(c => c.id !== comment.id));
    }

    if (loading) return <p>Loading...</p>;

    return (
        <Page
            title="List of Comments"
            actions={<button className="btn btn-create" onClick={() => navigate("/comments/create")}>Create Comment</button>}
        >
            <Table
                columns={[
                    { key: "id", label: "ID" },
                    { key: "username", label: "User" },
                    { key: "recipeId", label: "Recipe ID" },
                    { key: "text", label: "Text" },
                ]}
                data={comments}
                actions={[
                    { label: "View", type: "view", onClick: c => navigate(`/comments/${c.id}`) },
                    { label: "Edit", type: "edit", onClick: c => navigate(`/comments/${c.id}/edit`) },
                    { label: "Delete", type: "delete", onClick: handleDelete },
                ]}
            />
        </Page>
    );
}
