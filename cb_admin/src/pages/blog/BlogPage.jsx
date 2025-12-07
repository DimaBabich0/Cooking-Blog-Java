import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogsList from "../../components/BlogsList.jsx";
import { getBlogs } from "../../api/blogApi.js";

export default function BlogsPage() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getBlogs();
        setBlogs(data);
        setLoading(false);
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Blogs</h1>
            <button onClick={() => navigate("/blogs/create")}>Create blog</button>
            <BlogsList blogs={blogs} />
        </div>
    );
}
