import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getRoles } from "../../api/usersApi.js";
import { uploadFile } from "../../api/filesApi.js";

export default function UserCreatePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        photoUrl: "",
    });
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            setLoading(true);
            const roles = await getRoles();
            console.log(roles);
            setRoles(roles);
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
            alert("Ошибка загрузки фото: " + e.message);
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
        <div className="userCreate-container">
            <div className="userCreate-card">
                <h2 className="userCreate-title">Create new user</h2>

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
                    {uploading ? "Загрузка..." : "Загрузить фото"}
                </button>

                <label className="userCreate-label">Username:</label>
                <input
                    className="userCreate-input"
                    value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })}
                />

                <label className="userCreate-label">Email:</label>
                <input
                    className="userCreate-input"
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                />

                <label className="userCreate-label">First name:</label>
                <input
                    className="userCreate-input"
                    value={user.firstName}
                    onChange={e => setUser({ ...user, firstName: e.target.value })}
                />

                <label className="userCreate-label">Last name:</label>
                <input
                    className="userCreate-input"
                    value={user.lastName}
                    onChange={e => setUser({ ...user, lastName: e.target.value })}
                />

                <label className="userCreate-label">Password:</label>
                <input
                    className="userCreate-input"
                    type="password"
                    value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                />

                <label className="userCreate-label">Role:</label>
                <select
                    className="userCreate-input"
                    value={user.role}
                    onChange={e => setUser({ ...user, role: e.target.value })}
                >
                    <option value="" disabled selected>Select role</option>
                    {roles.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                <div className="userCreate-actions">
                    <button className="btn btn-create" onClick={handleSave}>Create</button>
                    <button className="btn btn-back" onClick={() => navigate("/users")}>Back</button>
                </div>
            </div>
        </div>
    );
}