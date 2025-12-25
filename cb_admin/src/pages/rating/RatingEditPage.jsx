import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RatingForm from "./RatingForm.jsx";
import { getRating, updateRating } from "../../api/ratingApi.js";
import { RatingDto } from "../../models/RatingDto.js";

export default function RatingEditPage() {
    const { id } = useParams();
    const [ratingData, setRatingData] = useState({ ...RatingDto });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getRating(id);
            setRatingData(data);
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!ratingData) return <p>Rating not found</p>;

    return <RatingForm ratingData={ratingData} onSave={data => updateRating(id, data)} />;
}
