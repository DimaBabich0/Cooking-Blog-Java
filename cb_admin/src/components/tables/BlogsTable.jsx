import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteBlog } from "../../api/blogApi.js";
import "../../css/Table.css"

export default function BlogsTable({ blogs }) {
    const navigate = useNavigate();
    async function handleDelete(id) {
        try {
            if (!confirm("Delete this blog?")) return;
            await deleteBlog(id);
            alert("Deleted blog: " + id);
            location.reload();
        } catch (e) {
            alert("Error while deleting blog: " + e);
        }
    }

    return (
        <table className="table">
            <thead className="table-head">
            <tr>
                <th className="table-cell">ID</th>
                <th className="table-cell">Username</th>
                <th className="table-cell">Title</th>
                <th className="table-cell">Description</th>
                <th className="table-cell">Actions</th>
            </tr>
            </thead>

            <tbody className="table-body">
            {blogs.map(b => (
                <tr className="table-row" key={b.id}>
                    <td className="table-cell">{b.id}</td>
                    <td className="table-cell">{b.username}</td>
                    <td className="table-cell">{b.title}</td>
                    <td className="table-cell">{b.description}</td>

                    <td className="table-actions">
                        <button className="btn btn-view" onClick={() => navigate(`/blogs/${b.id}`)}>View</button>
                        <button className="btn btn-edit" onClick={() => navigate(`/blogs/${b.id}/edit`)}>Edit</button>
                        <button className="btn btn-delete" onClick={() => handleDelete(b.id)}>Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
