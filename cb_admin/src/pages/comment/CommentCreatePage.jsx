import React from "react";
import CommentForm from "./CommentForm.jsx";
import { createComment } from "../../api/commentApi.js";
import { CommentDto } from "../../models/CommentDto.js";

export default function CommentCreatePage() {
    return <CommentForm onSave={createComment} commentData={{ ...CommentDto }} />;
}
