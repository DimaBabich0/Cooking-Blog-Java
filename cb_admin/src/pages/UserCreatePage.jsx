import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, uploadFile } from "../api/usersApi";

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

    async function handlePhotoUpload(file) {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadedFileName = await uploadFile(formData);
            setUser(prev => ({
                ...prev,
                photoUrl: `http://localhost:8080/api/files/images/${uploadedFileName}`
            }));
        } catch (e) {
            alert("Ошибка загрузки фото: " + e.message);
        } finally {
            setUploading(false);
        }
    }

    async function handleSave() {
        try {
            await createUser(user);
            alert("User created successfully!");
            navigate("/users");
        } catch (e) {
            alert("Error while trying create user: " + e.message);
        }
    }

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

                <label className="userCreate-PhotoLabel">Photo Upload</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                        const file = e.target.files[0];
                        setPhotoFile(file);
                        if (file) handlePhotoUpload(file); // вызываем после выбора
                    }}
                />

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
                <input
                    className="userCreate-input"
                    type="text"
                    value={user.role}
                    onChange={e => setUser({ ...user, role: e.target.value })}
                />

                <div className="userCreate-actions">
                    <button className="btn btn-create" onClick={handleSave}>Create</button>
                    <button className="btn btn-back" onClick={() => navigate("/users")}>Back</button>
                </div>
            </div>
        </div>
    );
}