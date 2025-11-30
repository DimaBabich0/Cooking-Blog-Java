import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../api/usersApi";

export default function UserEditPage() {
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

    async function save() {
        try {
            await updateUser(id, user);
            alert("Saved!");
            navigate(`/users/${id}`);
        } catch (e) {
            alert("Error while trying update user: " + e.message);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="userEdit-container">
            <div className="userEdit-card">
                <div className="userEdit-photo-wrapper">
                    <img
                        src={user.photoUrl || "https://via.placeholder.com/150"}
                        alt="user"
                        className="userEdit-photo"
                    />
                </div>

                <h2 className="userEdit-title">Id: #{id}</h2>

                <label className="userEdit-label">Username:</label>
                <input
                    className="userEdit-input"
                    value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })}
                />

                <label className="userEdit-label">Email:</label>
                <input
                    className="userEdit-input"
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                />

                <label className="userEdit-label">First name:</label>
                <input
                    className="userEdit-input"
                    value={user.firstName}
                    onChange={e => setUser({ ...user, firstName: e.target.value })}
                />

                <label className="userEdit-label">Last name:</label>
                <input
                    className="userEdit-input"
                    value={user.lastName}
                    onChange={e => setUser({ ...user, lastName: e.target.value })}
                />

                <label className="userEdit-label">Role:</label>
                <input
                    className="userEdit-input"
                    value={user.role}
                    onChange={e => setUser({ ...user, role: e.target.value })}
                />

                <div className="userEdit-actions">
                    <button className="btn btn-save" onClick={save}>Save</button>
                    <button className="btn btn-back" onClick={() => navigate(`/users/`)}>Back</button>
                </div>
            </div>
        </div>
    );
}