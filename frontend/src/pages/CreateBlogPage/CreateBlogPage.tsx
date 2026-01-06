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

  // Загружаем первого пользователя при загрузке страницы
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
            "Не найден ни один пользователь в базе данных. Создайте пользователя через админку или выполните SQL скрипт insert_sample_user.sql"
          );
        }
      } catch (err) {
        console.error("Ошибка загрузки пользователя:", err);
        setError(
          "Не удалось загрузить пользователя. Убедитесь, что backend запущен."
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

    // Вставляем изображение в позицию курсора
    const newText =
      currentText.substring(0, start) +
      "\n" +
      imgTag +
      "\n" +
      currentText.substring(end);

    handleTextChange(newText);

    // Устанавливаем курсор после вставленного изображения
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
        throw new Error("Заголовок обязателен");
      }
      if (!formData.text || !formData.text.trim()) {
        throw new Error("Текст поста обязателен");
      }
      if (!formData.description || !formData.description.trim()) {
        throw new Error("Описание обязательно");
      }
      if (
        !formData.userDto ||
        !formData.userDto.id ||
        formData.userDto.id === 0
      ) {
        throw new Error(
          "Пользователь не выбран. Убедитесь, что в базе есть хотя бы один пользователь."
        );
      }

      const blog = await createBlog(formData);
      navigate(`/blog/${blog.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка при создании поста"
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
          <p>Загрузка...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.createBlog}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>Создать новый пост</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>
              Заголовок *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className={styles.input}
              placeholder="Введите заголовок поста"
              maxLength={100}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Описание *
            </label>
            <textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className={styles.textarea}
              placeholder="Краткое описание поста (до 100 символов)"
              maxLength={100}
              rows={3}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Главное изображение поста (обложка)
            </label>
            <PhotoUploader
              onUpload={handleMainImageUpload}
              folder="blog"
              initialUrl={formData.photoUrl || undefined}
            />
            <small className={styles.hint} style={{ marginTop: "0.5rem" }}>
              Или введите URL вручную:
            </small>
            <input
              id="photoUrl"
              type="text"
              value={formData.photoUrl || ""}
              onChange={(e) => handleChange("photoUrl", e.target.value)}
              className={styles.input}
              style={{ marginTop: "0.5rem" }}
              placeholder="http://example.com/image.jpg (опционально)"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="cookingTime" className={styles.label}>
              Время приготовления (минуты)
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
            <label className={styles.label}>Текст поста *</label>
            <small
              className={styles.hint}
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Загрузи изображения ниже и нажми "Вставить" чтобы добавить их в
              текст в позиции курсора
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
              placeholder="Начните писать ваш пост здесь... (HTML поддерживается)"
              rows={15}
              required
            />
            <small className={styles.hint}>
              Можно использовать HTML-теги для форматирования (например:
              &lt;strong&gt;жирный&lt;/strong&gt;,
              &lt;h2&gt;заголовок&lt;/h2&gt;)
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
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Создание..." : "Создать пост"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
