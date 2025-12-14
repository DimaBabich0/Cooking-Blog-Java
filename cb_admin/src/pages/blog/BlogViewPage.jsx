import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ViewCard from "../../components/ViewCard.jsx";
import { getBlog, deleteBlog } from "../../api/blogApi.js";
import { format } from "date-fns";
import { BlogDto } from "../../models/BlogDto.js";

export default function BlogViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const blog = await getBlog(id);
        setBlog({...BlogDto, ...blog});
        console.log(blog);
        setLoading(false);
    }

    async function handleDelete() {
        if (!confirm("Delete this blog?")) return;
        await deleteBlog(id);
        navigate("/blogs");
    }

    if (loading) return <p>Loading...</p>;
    if (!blog) return <p>Blog not found</p>;

    const fields = [
        { label: "Title", value: blog.title },
        { label: "Author", value: blog.userDto.username },
        { label: "Description", value: blog.description },
        { label: "Text", value: blog.text },
        { label: "Cooking time", value: `${blog.cookingTime} minutes` },
        { label: "Create date", value: format(new Date(blog.createdAt), "HH:mm:ss, d MMMM yyyy") },
        { label: "Update date", value: format(new Date(blog.updatedAt), "HH:mm:ss, d MMMM yyyy") },
    ];

    return (
        <ViewCard
            photoUrl={blog.photoUrl && `http://localhost:8080/api/files/images/${blog.photoUrl}`}
            title={`Id: #${id}`}
            fields={fields}
            actions={{
                onEdit: () => navigate(`/blogs/${id}/edit`),
                onDelete: handleDelete,
                onBack: () => navigate("/blogs")
            }}
        />
    );
}
