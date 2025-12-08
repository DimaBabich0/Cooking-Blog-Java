import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../../api/blogApi.js";
import { getUsers } from "../../api/usersApi.js";
import { uploadFile } from "../../api/filesApi.js";
import { BlogDto } from "../../models/BlogDto.js";
import "../../css/CreatePage.css"

export default function BlogCreatePage() {
    const navigate = useNavigate();
    const [blog, setBlog] = useState({ ...BlogDto });
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers()
            .then((users) => setUsers(users));
    }, []);

    async function loadUsers() {
        try {
            const users = await getUsers();
            console.log(users);
            return users;
        } catch (e) {
            alert("Error while trying get users: " + e.message);
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
            setBlog({ ...blog, photoUrl: "http://localhost:8080/api/files/images/" + uploadedPath });
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
        console.log(blog);
        try {
            await createBlog(blog);
            alert("Blog created successfully!");
            navigate("/blogs");
        } catch (e) {
            alert("Error while trying create blog: " + e.message);
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="create-container">
            <div className="create-card">
                <h2 className="create-title">Create new blog</h2>

                {blog.photoUrl && (
                    <img
                        src={blog.photoUrl}
                        alt="preview"
                        style={{ width: "120px", marginTop: "10px"}}
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

                <label className="create-label">Title:</label>
                <input
                    className="create-input"
                    value={blog.title}
                    onChange={e => setBlog({ ...blog, title: e.target.value })}
                />

                <label className="create-label">User:</label>
                <select
                    className="create-input"
                    value={blog.userId}
                    onChange={e => setBlog({ ...blog, userId: e.target.value })}
                >
                    <option value="" disabled selected>Select user</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                </select>

                <label className="create-label">Description:</label>
                <input
                    className="create-input"
                    value={blog.description}
                    onChange={e => setBlog({ ...blog, description: e.target.value })}
                />

                <label className="create-label">Text:</label>
                <textarea
                    className="create-textarea"
                    value={blog.text}
                    onChange={e => setBlog({ ...blog, text: e.target.value })}
                />

                <label className="create-label">Cooking time (in minutes):</label>
                <input
                    type="number"
                    className="create-input"
                    value={blog.cookingTime}
                    min="1"
                    max="1440"
                    onChange={e => setBlog({ ...blog, cookingTime: e.target.value })}
                />

                <div className="create-actions">
                    <button className="btn btn-create" onClick={handleSave}>Create</button>
                    <button className="btn btn-back" onClick={() => navigate("/blogs")}>Back</button>
                </div>
            </div>
        </div>
    );
}
