import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getRoles } from "../../api/usersApi.js";
import { uploadFile } from "../../api/filesApi.js";
import { UserDto } from "../../models/UserDto.js";
import "../../css/CreatePage.css"

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

    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    async function handlePhotoUpload(file) {
        if (!file) return;
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadedPath = await uploadFile(formData);
            setUser({ ...user, photoUrl: "http://localhost:8080/api/files/images/" + uploadedPath });
        } catch (e) {
            alert("Error while trying upload photo: " + e.message);
        } finally {
            setUploading(false);
        }
    }

    function handleChooseFile() {
        fileInputRef.current.click();
    }

    function onFileSelected(e) {
        const file = e.target.files[0];
        if (file) handlePhotoUpload(file);
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

                {user.photoUrl && (
                    <img
                        src={user.photoUrl}
                        alt="preview"
                        style={{ width: "120px", marginTop: "10px", borderRadius: "8px" }}
                    />
                )}

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={onFileSelected}
                />
                <button
                    className="btn btn-view"
                    onClick={handleChooseFile}
                    disabled={uploading}
                >
                    {uploading ? "Loading..." : "Load photo"}
                </button>

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