import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteBlog } from "../api/blogApi.js";

export default function BlogsList({ blogs }) {
    const navigate = useNavigate();

    async function handleDelete(id) {
        if (!confirm("Delete this blog?")) return;
        await deleteBlog(id);
        alert("Deleted blog: " + id);
        location.reload();
    }

    return (
        <table className="blogsTable">
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>User ID</th>
                <th>Cooking Time</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {blogs.map(b => (
                <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.name}</td>
                    <td>{b.userId}</td>
                    <td>{b.cookingTime}</td>
                    <td>
                        <button onClick={() => navigate(`/blogs/${b.id}`)}>View</button>
                        <button onClick={() => navigate(`/blogs/${b.id}/edit`)}>Edit</button>
                        <button onClick={() => handleDelete(b.id)}>Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
