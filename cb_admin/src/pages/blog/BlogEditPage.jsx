import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogForm from "./BlogForm.jsx";
import { getBlog, updateBlog } from "../../api/blogApi.js";
import { BlogDto } from "../../models/BlogDto.js";

export default function BlogEditPage() {
    const { id } = useParams();
    const [blogData, setBlogData] = useState({ ...BlogDto });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getBlog(id);
            setBlogData(data);
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!blogData) return <p>Blog not found</p>;

    return <BlogForm blogData={blogData} onSave={data => updateBlog(id, data)} />;
}
