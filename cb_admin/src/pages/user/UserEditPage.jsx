import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoles, getUser, updateUser } from "../../api/usersApi.js";
import { UserDto } from "../../models/UserDto.js";
import "../../css/EditPage.css"
import PhotoUploader from "../../components/PhotoUploader.jsx";

export default function UserEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            setLoading(true);
            const user = await getUser(id);
            console.log(user);
            setUser({...UserDto, ...user});

            const roles = await getRoles();
            console.log(roles);
            setRoles(roles);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
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
        <div className="edit-container">
            <div className="edit-card">
                <PhotoUploader
                    folder="avatars"
                    initialUrl={user.photoUrl}
                    onUpload={(url) => setUser({ ...user, photoUrl: url })}
                />

                <h2>Id: #{id}</h2>

                <label className="edit-label">Username:</label>
                <input
                    className="edit-input"
                    value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })}
                />

                <label className="edit-label">Email:</label>
                <input
                    className="edit-input"
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                />

                <label className="edit-label">First name:</label>
                <input
                    className="edit-input"
                    value={user.firstName}
                    onChange={e => setUser({ ...user, firstName: e.target.value })}
                />

                <label className="edit-label">Last name:</label>
                <input
                    className="edit-input"
                    value={user.lastName}
                    onChange={e => setUser({ ...user, lastName: e.target.value })}
                />

                <label className="edit-label">Role:</label>
                <select
                    className="edit-input"
                    value={user.role}
                    onChange={e => setUser({ ...user, role: e.target.value })}
                >
                    {roles.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                <div className="edit-actions">
                    <button className="btn btn-save" onClick={handleSave}>Save</button>
                    <button className="btn btn-back" onClick={() => navigate(`/users/`)}>Back</button>
                </div>
            </div>
        </div>
    );
}