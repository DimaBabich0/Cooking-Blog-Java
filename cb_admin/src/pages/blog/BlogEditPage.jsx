import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlog, updateBlog } from "../../api/blogApi.js";
import { getUsers } from "../../api/usersApi.js";
import { BlogDto } from "../../models/BlogDto.js";
import "../../css/EditPage.css"
import PhotoUploader from "../../components/PhotoUploader.jsx";

export default function BlogEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const blog = await getBlog(id);
            console.log(blog);
            setBlog({...BlogDto, ...blog});

            const users = await getUsers();
            console.log(users);
            setUsers(users);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        try {
            await updateBlog(id, blog);
            alert("Saved!");
            navigate(`/blogs/${id}`);
        } catch (e) {
            alert("Error while trying update blog: " + e.message);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (!blog) return <p>Blog not found</p>;

    return (
        <div className="edit-container">
            <div className="edit-card">
                <PhotoUploader
                    folder="blog"
                    initialUrl={blog.photoUrl}
                    onUpload={(url) => setBlog({ ...blog, photoUrl: url })}
                />

                <h2>Id: #{id}</h2>

                <label className="edit-label">Title:</label>
                <input
                    className="edit-input"
                    value={blog.title}
                    onChange={e => setBlog({ ...blog, title: e.target.value })}
                />

                <label className="edit-label">User:</label>
                <select
                    className="edit-input"
                    value={blog.userId}
                    onChange={e => setBlog({ ...blog, userId: e.target.value })}
                >
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                </select>

                <label className="edit-label">Description:</label>
                <input
                    className="edit-input"
                    value={blog.description}
                    onChange={e => setBlog({ ...blog, description: e.target.value })}
                />

                <label className="edit-label">Text:</label>
                <textarea
                    className="create-textarea"
                    value={blog.text}
                    onChange={e => setBlog({ ...blog, text: e.target.value })}
                />

                <label className="edit-label">Cooking time (in minutes):</label>
                <input
                    type="number"
                    className="edit-input"
                    value={blog.cookingTime}
                    min="1"
                    max="1440"
                    onChange={e => setBlog({ ...blog, cookingTime: e.target.value })}
                />

                <div className="edit-actions">
                    <button className="btn btn-save" onClick={handleSave}>Save</button>
                    <button className="btn btn-back" onClick={() => navigate("/blogs/")}>Back</button>
                </div>
            </div>
        </div>
    );
}
