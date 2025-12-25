import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page.jsx";
import Table from "../../components/Table.jsx";
import { getBlogs, deleteBlog } from "../../api/blogApi.js";

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

    async function handleDelete(blog) {
        if (!confirm(`Delete blog "${blog.title}"?`)) return;
        await deleteBlog(blog.id);
        setBlogs(blogs.filter(b => b.id !== blog.id));
    }

    if (loading) return <p>Loading...</p>;

    return (
        <Page
            title="List of Blogs"
            actions={<button className="btn btn-create" onClick={() => navigate("/blogs/create")}>Create Blog</button>}
        >
            <Table
                columns={[
                    { label: "ID", key: "id" },
                    { label: "Author", render: recipe => recipe.userDto?.username ?? "—"},
                    { label: "Title", key: "title" },
                    { label: "Description", key: "description" },
                ]}
                data={blogs}
                actions={[
                    { label: "View", type: "view", onClick: b => navigate(`/blogs/${b.id}`) },
                    { label: "Edit", type: "edit", onClick: b => navigate(`/blogs/${b.id}/edit`) },
                    { label: "Delete", type: "delete", onClick: handleDelete },
                ]}
            />
        </Page>
    );
}
