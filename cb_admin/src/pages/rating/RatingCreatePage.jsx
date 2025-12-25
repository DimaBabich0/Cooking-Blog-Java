import React from "react";
import RatingForm from "./RatingForm.jsx";
import { createRating } from "../../api/ratingApi.js";
import { RatingDto } from "../../models/RatingDto.js";

export default function RatingCreatePage() {
    return <RatingForm onSave={createRating} ratingData={{ ...RatingDto }} />;
}
