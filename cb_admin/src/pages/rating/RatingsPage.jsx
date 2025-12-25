import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page.jsx";
import Table from "../../components/Table.jsx";
import { getRatings, deleteRating } from "../../api/ratingApi.js";

export default function RatingsPage() {
    const navigate = useNavigate();
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getRatings();
        setRatings(data);
        setLoading(false);
    }

    async function handleDelete(rating) {
        if (!confirm(`Delete rating?`)) return;
        await deleteRating(rating.id);
        setRatings(ratings.filter(r => r.id !== rating.id));
    }

    if (loading) return <p>Loading...</p>;

    return (
        <Page
            title="List of Ratings"
            actions={<button className="btn btn-create" onClick={() => navigate("/ratings/create")}>Create Rating</button>}
        >
            <Table
                columns={[
                    { key: "id", label: "ID" },
                    { key: "userId", label: "User" },
                    { key: "recipeId", label: "Recipe ID" },
                    { key: "rating", label: "Rating" },
                ]}
                data={ratings}
                actions={[
                    { label: "View", type: "view", onClick: r => navigate(`/ratings/${r.id}`) },
                    { label: "Edit", type: "edit", onClick: r => navigate(`/ratings/${r.id}/edit`) },
                    { label: "Delete", type: "delete", onClick: handleDelete },
                ]}
            />
        </Page>
    );
}
