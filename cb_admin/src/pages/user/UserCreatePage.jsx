import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getRoles } from "../../api/usersApi.js";
import { UserDto } from "../../models/UserDto.js";
import "../../css/CreatePage.css"
import PhotoUploader from "../../components/PhotoUploader.jsx";

export default function UserCreatePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ ...UserDto });
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRoles()
            .then((roles) => setRoles(roles));
    }, []);

    async function loadRoles() {
        try {
            const roles = await getRoles();
            console.log(roles);
            return roles;
        } catch (e) {
            alert("Error while trying update user: " + e.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        console.log(user);
        try {
            await createUser(user);
            alert("User created successfully!");
            navigate("/users");
        } catch (e) {
            alert("Error while trying create user: " + e.message);
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="create-container">
            <div className="create-card">
                <h2 className="create-title">Create new user</h2>

                <PhotoUploader
                    folder="avatars"
                    initialUrl={user.photoUrl}
                    onUpload={(url) => setUser({ ...user, photoUrl: url })}
                />

                <label className="create-label">Username:</label>
                <input
                    className="create-input"
                    value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })}
                />

                <label className="create-label">Email:</label>
                <input
                    className="create-input"
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                />

                <label className="create-label">First name:</label>
                <input
                    className="create-input"
                    value={user.firstName}
                    onChange={e => setUser({ ...user, firstName: e.target.value })}
                />

                <label className="create-label">Last name:</label>
                <input
                    className="create-input"
                    value={user.lastName}
                    onChange={e => setUser({ ...user, lastName: e.target.value })}
                />

                <label className="create-label">Password:</label>
                <input
                    className="create-input"
                    type="password"
                    value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                />

                <label className="create-label">Role:</label>
                <select
                    className="create-input"
                    value={user.role}
                    onChange={e => setUser({ ...user, role: e.target.value })}
                >
                    <option value="" disabled selected>Select role</option>
                    {roles.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                <div className="create-actions">
                    <button className="btn btn-create" onClick={handleSave}>Create</button>
                    <button className="btn btn-back" onClick={() => navigate("/users")}>Back</button>
                </div>
            </div>
        </div>
    );
}