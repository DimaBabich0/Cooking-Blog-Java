import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import { getBlog, deleteBlog } from "../../api/blogApi.js";
import { BlogDto } from "../../models/BlogDto.js";
import "../../css/ViewPage.css"

export default function BlogViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();

    }, []);

    async function load() {
        try {
            setLoading(true);
            const blog = await getBlog(id);
            console.log(blog);
            setBlog({...BlogDto, ...blog});
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Delete this blog?")) return;
        await deleteBlog(id);
        navigate("/blogs");
    }

    if (loading) return <p>Loading...</p>;
    if (!blog) return <p>Blog not found</p>;

    return (
        <div className="view-container">
            <div className="view-card">

                <div className="view-photo-wrapper">
                    <img
                        src={"http://localhost:8080/api/files/images/" + blog.photoUrl}
                        alt="blog image"
                        className="view-photo"
                    />
                </div>
                <h2>Id: #{id}</h2>

                <div className="view-info">
                    <div className="view-field"><b>Title:</b> {blog.title}</div>
                    <div className="view-field"><b>Author:</b> {blog.username}</div>
                    <div className="view-field"><b>Description:</b> {blog.description}</div>
                    <div className="view-field"><b>Text:</b> {blog.text}</div>
                    <div className="view-field"><b>Cooking time:</b> {blog.cookingTime} minutes</div>
                    <div className="view-field"><b>Create date:</b> {format(blog.createdAt, "HH:mm:ss, d MMMM yyyy")}</div>
                    <div className="view-field"><b>Update date:</b> {format(blog.updatedAt, "HH:mm:ss, d MMMM yyyy")}</div>
                </div>

                <div className="view-actions">
                    <button className="btn btn-edit" onClick={() => navigate(`/blogs/${id}/edit`)}>
                        Edit
                    </button>

                    <button className="btn btn-delete" onClick={handleDelete}>
                        Delete
                    </button>

                    <button className="btn btn-back" onClick={() => navigate("/blogs/")}>
                        Back
                    </button>
                </div>

            </div>
        </div>
    );
}
