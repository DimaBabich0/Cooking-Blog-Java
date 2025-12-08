import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../api/usersApi.js";
import "../../css/Table.css"

export default function UsersTable({ users }) {
    const navigate = useNavigate();
    async function handleDelete(id) {
        try {
            if (!confirm("Delete this user?")) return;
            await deleteUser(id);
            alert("Deleted user: " + id);
            location.reload();
        } catch (e) {
            alert("Error while deleting user: " + e);
        }
    }

    return (
        <table className="table">
            <thead className="table-head">
            <tr>
                <th className="table-cell">ID</th>
                <th className="table-cell">Username</th>
                <th className="table-cell">Email</th>
                <th className="table-cell">Role</th>
                <th className="table-cell">Actions</th>
            </tr>
            </thead>

            <tbody className="table-body">
            {users.map(u => (
                <tr className="table-row" key={u.id}>
                    <td className="table-cell">{u.id}</td>
                    <td className="table-cell">{u.username}</td>
                    <td className="table-cell">{u.email}</td>
                    <td className="table-cell">{u.role}</td>

                    <td className="table-actions">
                        <button className="btn btn-view" onClick={() => navigate(`/users/${u.id}`)}>
                            View
                        </button>

                        <button className="btn btn-edit" onClick={() => navigate(`/users/${u.id}/edit`)}>
                            Edit
                        </button>

                        <button className="btn btn-delete" onClick={() => handleDelete(u.id)}>
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}