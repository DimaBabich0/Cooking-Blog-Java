import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PhotoUploader from "../../components/PhotoUploader.jsx";
import ImageUploader from "../../components/ImageUploader.jsx";
import FormField from "../../components/FormField.jsx";
import ActionButtons from "../../components/ActionButtons.jsx";
import { getUsers } from "../../api/userApi.js";
import { BlogDto } from "../../models/BlogDto.js";
import "../../css/Form.css";
import UserSelect from "../../components/UserSelect.jsx";

export default function BlogForm({ blogData = {}, onSave }) {
    const navigate = useNavigate();
    const textareaRef = useRef(null);
    const [blog, setBlog] = useState({ ...BlogDto, ...blogData });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    }

    function handleTextChange(e) {
        setBlog({ ...blog, text: e.target.value });
    }

    function handleImageInsert(imgTag) {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = blog.text || "";

        const newText =
            currentText.substring(0, start) +
            "\n" +
            imgTag +
            "\n" +
            currentText.substring(end);

        setBlog({ ...blog, text: newText });

        // Set cursor in teaxarea after inserted image
        setTimeout(() => {
            const newCursorPos = start + imgTag.length + 2;
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }

    async function handleSave() {
        // Validation tests
        if (!blog.title || blog.title.trim() === "") {
            alert("Title is required");
            return;
        }
        if (!blog.text || blog.text.trim() === "") {
            alert("Text is required");
            return;
        }
        if (!blog.userDto || !blog.userDto.id) {
            alert("Author is required");
            return;
        }

        // Saving blog
        await onSave(blog);
        navigate("/blogs");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="form-container">
            <div className="form-card">
                <PhotoUploader
                    label="Main photo (cover image)"
                    folder="blog"
                    initialUrl={blog.photoUrl}
                    onUpload={(url) => setBlog({ ...blog, photoUrl: url })}
                />

                <FormField
                    label="Title"
                    value={blog.title}
                    onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                />
                <UserSelect
                    label="Author"
                    value={users.find(u => u.id === blog.userDto.id)}
                    onChange={id => setBlog({ ...blog, userDto: {...blog.userDto, id: id}})}
                />
                <FormField
                    label="Description"
                    value={blog.description}
                    onChange={(e) => setBlog({ ...blog, description: e.target.value })}
                />

                <ImageUploader
                    label="Images for text"
                    onImageInsert={handleImageInsert}
                    folder="blog-content"
                />

                <div className="form-field" style={{ width: "100%" }}>
                    <label className="form-label">Text:</label>
                    <textarea
                        ref={textareaRef}
                        className="form-input"
                        value={blog.text}
                        onChange={handleTextChange}
                        placeholder="Начните писать ваш пост здесь... (HTML поддерживается)"
                        rows={15}
                        style={{ minHeight: "300px", resize: "vertical" }}
                    />
                    <small
                        style={{
                            fontSize: "12px",
                            color: "#666",
                            marginTop: "5px",
                            display: "block",
                        }}
                    >
                        Можно использовать HTML-теги для форматирования (например:
                        &lt;strong&gt;жирный&lt;/strong&gt;, &lt;h2&gt;заголовок&lt;/h2&gt;)
                    </small>
                </div>

                <FormField
                    label="Cooking time (minutes)"
                    type="number"
                    value={blog.cookingTime}
                    onChange={(e) => setBlog({ ...blog, cookingTime: e.target.value })}
                    min="1"
                    max="1440"
                />

                <ActionButtons onSave={handleSave} onBack={() => navigate("/blogs")} />
            </div>
        </div>
    );
}
