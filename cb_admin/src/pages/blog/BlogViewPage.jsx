import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlog, deleteBlog } from "../../api/blogApi.js";

export default function BlogViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getBlog(id);
        setBlog(data);
        setLoading(false);
    }

    async function handleDelete() {
        if (!confirm("Delete this blog?")) return;
        await deleteBlog(id);
        navigate("/blogs");
    }

    if (loading) return <p>Loading...</p>;
    if (!blog) return <p>Blog not found</p>;

    return (
        <div>
            <h2>{blog.name}</h2>
            <p><b>User ID:</b> {blog.userId}</p>
            <p><b>Description:</b> {blog.description}</p>
            <p><b>Cooking Time:</b> {blog.cookingTime}</p>
            <p>{blog.text}</p>
            <p><b>Created at:</b> {blog.createdAt}</p>
            <p><b>Updated at:</b> {blog.updatedAt}</p>

            <button onClick={() => navigate(`/blogs/${id}/edit`)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={() => navigate("/blogs")}>Back</button>
        </div>
    );
}
