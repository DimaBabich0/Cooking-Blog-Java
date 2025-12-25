import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoUploader from "../../components/PhotoUploader.jsx";
import FormField from "../../components/FormField.jsx";
import ActionButtons from "../../components/ActionButtons.jsx";
import { getUsers } from "../../api/userApi.js";
import { BlogDto } from "../../models/BlogDto.js";
import "../../css/Form.css"
import UserSelect from "../../components/UserSelect.jsx";

export default function BlogForm({ blogData = {}, onSave }) {
    const navigate = useNavigate();
    const [blog, setBlog] = useState({ ...BlogDto, ...blogData });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
        console.log(blog);
    }, []);

    async function loadUsers() {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    }

    async function handleSave() {
        console.log(blog);
        console.log("-------------------");
        await onSave(blog);
        navigate("/blogs");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="form-container">
            <div className="form-card">
                <PhotoUploader
                    folder="blog"
                    initialUrl={blog.photoUrl}
                    onUpload={url => setBlog({ ...blog, photoUrl: url })}
                />

                <FormField
                    label="Title"
                    value={blog.title}
                    onChange={e => setBlog({ ...blog, title: e.target.value })}
                />
                <UserSelect
                    label="Author"
                    value={users.find(u => u.id === blog.userDto.id)}
                    onChange={id => setBlog({ ...blog, userDto: {...blog.userDto, id: id}})}
                />
                <FormField
                    label="Description"
                    value={blog.description}
                    onChange={e => setBlog({ ...blog, description: e.target.value })}
                />
                <FormField
                    label="Text"
                    type="textarea"
                    value={blog.text}
                    onChange={e => setBlog({ ...blog, text: e.target.value })}
                />
                <FormField
                    label="Cooking time (minutes)"
                    type="number"
                    value={blog.cookingTime}
                    onChange={e => setBlog({ ...blog, cookingTime: e.target.value })}
                    min="1" max="1440"
                />

                <ActionButtons
                    onSave={handleSave}
                    onBack={() => navigate("/blogs")}
                />
            </div>
        </div>
    );
}
