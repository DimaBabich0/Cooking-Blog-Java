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
    console.log(blog);
  }, []);

  async function loadUsers() {
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  }

  function handleTextChange(e) {
    setBlog({ ...blog, text: e.target.value });
  }

  function handleImageInsert(imgTag, imagePath) {
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

    // Устанавливаем курсор после вставленного изображения
    setTimeout(() => {
      const newCursorPos = start + imgTag.length + 2;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  async function handleSave() {
    // Валидация обязательных полей
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

    // Подготавливаем данные для отправки
    // Убеждаемся, что userDto.id - это число, а не объект
    const userId = blog.userDto.id;
    if (userId && typeof userId === "object") {
      alert("Invalid user ID format. Please select a user again.");
      return;
    }

    const blogToSave = {
      ...blog,
      userDto: { id: userId }, // Отправляем только ID пользователя (число)
    };

    console.log("Saving blog:", JSON.stringify(blogToSave, null, 2));
    try {
      await onSave(blogToSave);
      navigate("/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      alert(error.message || "Error saving blog");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-field" style={{ width: "100%" }}>
          <label className="form-label">Main photo (cover image):</label>
          <PhotoUploader
            folder="blog"
            initialUrl={blog.photoUrl}
            onUpload={(url) => setBlog({ ...blog, photoUrl: url })}
          />
        </div>

        <FormField
          label="Title"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
        />
        <UserSelect
          label="Author"
          value={
            blog.userDto && blog.userDto.id
              ? users.find((u) => u.id === blog.userDto.id)
              : null
          }
          onChange={(user) => {
            // UserSelect передает объект пользователя, нужно извлечь id
            const userId =
              user && typeof user === "object" && user.id ? user.id : null;
            setBlog({ ...blog, userDto: { id: userId } });
          }}
        />
        <FormField
          label="Description"
          value={blog.description}
          onChange={(e) => setBlog({ ...blog, description: e.target.value })}
        />

        <div className="form-field" style={{ width: "100%" }}>
          <label className="form-label">Images for text:</label>
          <ImageUploader
            onImageInsert={handleImageInsert}
            folder="blog-content"
          />
        </div>

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
