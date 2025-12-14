import React from "react";
import BlogForm from "./BlogForm.jsx";
import { createBlog } from "../../api/blogApi.js";
import { BlogDto } from "../../models/BlogDto.js";

export default function BlogCreatePage() {
    return <BlogForm onSave={createBlog} blogData={{ ...BlogDto }} />;
}
