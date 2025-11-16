import React from "react";
import { useNavigate } from "react-router-dom";
import {deleteUser} from "../api/usersApi.js";

export default function UsersList({ users }) {
    const navigate = useNavigate();
    async function handleDelete(id) {
        if (!confirm("Delete this user?")) return;
        await deleteUser(id);
        navigate("/users");
    }

    return (
        <table className="usersTable">
            <thead className="usersTable-head">
            <tr>
                <th className="usersTable-cell">ID</th>
                <th className="usersTable-cell">Username</th>
                <th className="usersTable-cell">Email</th>
                <th className="usersTable-cell">Role</th>
                <th className="usersTable-cell">Actions</th>
            </tr>
            </thead>

            <tbody className="usersTable-body">
            {users.map(u => (
                <tr key={u.id} className="usersTable-row">
                    <td className="usersTable-cell">{u.id}</td>
                    <td className="usersTable-cell">{u.username}</td>
                    <td className="usersTable-cell">{u.email}</td>
                    <td className="usersTable-cell">{u.role}</td>

                    <td className="usersTable-actions">
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