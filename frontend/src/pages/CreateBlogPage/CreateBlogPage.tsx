import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import ReactQuill from "react-quill"; // Временно отключен из-за несовместимости с React 19
// import "react-quill/dist/quill.snow.css";
import { createBlog, BlogDto } from "../../api/blogApi";
import { getUsers, UserDto } from "../../api/userApi";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import PhotoUploader from "../../components/PhotoUploader/PhotoUploader";
import Button from "../../components/Button/Button";
import styles from "./CreateBlogPage.module.scss";

export default function CreateBlogPage() {
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  const [formData, setFormData] = useState<Partial<BlogDto>>({
    title: "",
    description: "",
    text: "",
    photoUrl: "",
    cookingTime: 0,
    userDto: {
      id: 0,
      username: "",
    },
  });

  // Load first user on page load
  useEffect(() => {
    async function loadUser() {
      try {
        const users = await getUsers();
        if (users && users.length > 0) {
          const user = users[0];
          setFormData((prev) => ({
            ...prev,
            userDto: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              photoUrl: user.photoUrl,
            },
          }));
        } else {
          setError(
            "No users found in database. Create a user via admin panel or run SQL script insert_sample_user.sql"
          );
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setError(
          "Failed to load user. Make sure the backend is running."
        );
      } finally {
        setInitializing(false);
      }
    }
    loadUser();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      text: value,
    }));
  };

  const handleMainImageUpload = (imagePath: string) => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: imagePath,
    }));
  };

  const handleImageInsert = (imgTag: string, imagePath: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = formData.text || "";

    // Insert image at cursor position
    const newText =
      currentText.substring(0, start) +
      "\n" +
      imgTag +
      "\n" +
      currentText.substring(end);

    handleTextChange(newText);

    // Set cursor after inserted image
    setTimeout(() => {
      const newCursorPos = start + imgTag.length + 2;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.title || !formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.text || !formData.text.trim()) {
        throw new Error("Post text is required");
      }
      if (!formData.description || !formData.description.trim()) {
        throw new Error("Description is required");
      }
      if (
        !formData.userDto ||
        !formData.userDto.id ||
        formData.userDto.id === 0
      ) {
        throw new Error(
          "User not selected. Make sure there is at least one user in the database."
        );
      }

      const blog = await createBlog(formData);
      navigate(`/blog/${blog.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error creating post"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Временно отключено из-за несовместимости react-quill с React 19
  // const quillModules = {
  //   toolbar: [
  //     [{ header: [1, 2, 3, false] }],
  //     ["bold", "italic", "underline", "strike"],
  //     [{ list: "ordered" }, { list: "bullet" }],
  //     [{ color: [] }, { background: [] }],
  //     ["link", "image"],
  //     ["blockquote", "code-block"],
  //     ["clean"],
  //   ],
  // };

  // const quillFormats = [
  //   "header",
  //   "bold",
  //   "italic",
  //   "underline",
  //   "strike",
  //   "list",
  //   "bullet",
  //   "color",
  //   "background",
  //   "link",
  //   "image",
  //   "blockquote",
  //   "code-block",
  // ];

  if (initializing) {
    return (
      <section className={styles.createBlog}>
        <div className={`container ${styles.container}`}>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.createBlog}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>Create New Post</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className={styles.input}
              placeholder="Enter post title"
              maxLength={100}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className={styles.textarea}
              placeholder="Short post description (up to 100 characters)"
              maxLength={100}
              rows={3}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Main Post Image (Cover)
            </label>
            <PhotoUploader
              onUpload={handleMainImageUpload}
              folder="blog"
              initialUrl={formData.photoUrl || undefined}
            />
            <small className={styles.hint} style={{ marginTop: "0.5rem" }}>
              Or enter URL manually:
            </small>
            <input
              id="photoUrl"
              type="text"
              value={formData.photoUrl || ""}
              onChange={(e) => handleChange("photoUrl", e.target.value)}
              className={styles.input}
              style={{ marginTop: "0.5rem" }}
              placeholder="http://example.com/image.jpg (optional)"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="cookingTime" className={styles.label}>
              Cooking Time (minutes)
            </label>
            <input
              id="cookingTime"
              type="number"
              value={formData.cookingTime || 0}
              onChange={(e) =>
                handleChange("cookingTime", parseInt(e.target.value) || 0)
              }
              className={styles.input}
              min="0"
              placeholder="0"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Post Text *</label>
            <small
              className={styles.hint}
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Upload images below and click "Insert" to add them to the text at cursor position
            </small>
            <ImageUploader
              onImageInsert={handleImageInsert}
              folder="blog-content"
            />
            <textarea
              ref={textareaRef}
              value={formData.text || ""}
              onChange={(e) => handleTextChange(e.target.value)}
              className={styles.textarea}
              placeholder="Start writing your post here... (HTML supported)"
              rows={15}
              required
            />
            <small className={styles.hint}>
              You can use HTML tags for formatting (e.g.:
              &lt;strong&gt;bold&lt;/strong&gt;,
              &lt;h2&gt;heading&lt;/h2&gt;)
            </small>
            {/* Временно отключен WYSIWYG-редактор из-за несовместимости react-quill с React 19
            <div className={styles.editor}>
              <ReactQuill
                theme="snow"
                value={formData.text || ""}
                onChange={handleTextChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Начните писать ваш пост здесь..."
              />
            </div>
            */}
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              onClick={() => navigate("/blog")}
              variant="secondary"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
