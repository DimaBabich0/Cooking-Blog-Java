import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, deleteUser } from "../api/usersApi";

export default function UserViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            setLoading(true);
            const data = await getUser(id);
            console.log(data);
            setUser(data);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Delete this user?")) return;
        await deleteUser(id);
        navigate("/users");
    }

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="userView-container">
            <div className="userView-card">

                <div className="userView-photo-wrapper">
                    <img
                        src={user.photoUrl}
                        alt="user"
                        className="userView-photo"
                    />
                </div>
                <h2 className="user-edit__title">Id: #{id}</h2>

                <div className="userView-info">
                    <div className="userView-field"><b>Username:</b> {user.username}</div>
                    <div className="userView-field"><b>Email:</b> {user.email}</div>
                    <div className="userView-field"><b>First name:</b> {user.firstName}</div>
                    <div className="userView-field"><b>Last name:</b> {user.lastName}</div>
                    <div className="userView-field"><b>Role:</b> {user.role}</div>
                    <div className="userView-field"><b>Create date:</b> {user.createdAt}</div>
                </div>

                <div className="userView-actions">
                    <button className="btn btn-edit" onClick={() => navigate(`/users/${id}/edit`)}>
                        Edit
                    </button>

                    <button className="btn btn-delete" onClick={handleDelete}>
                        Delete
                    </button>

                    <button className="btn btn-back" onClick={() => navigate("/users")}>
                        Back
                    </button>
                </div>

            </div>
        </div>
    );
}