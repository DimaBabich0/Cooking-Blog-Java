import React, { useState, useRef } from "react";
import { uploadFile } from "../api/filesApi.js";

export default function ImageUploader({ label, onImageInsert, folder = "blog-content" }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleFileSelect = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith("image/")) {
                    alert(`Файл ${file.name} не является изображением`);
                    continue;
                }

                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const path = await uploadFile(formData, folder);
                    const url = `http://localhost:8080/api/files/images/${path}`;
                    
                    const newImage = {
                        id: Date.now().toString() + i,
                        path,
                        url,
                        file,
                    };

                    setUploadedImages((prev) => [...prev, newImage]);
                } catch (error) {
                    console.error(`Ошибка загрузки ${file.name}:`, error);
                    const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
                    alert(`Ошибка загрузки ${file.name}:\n${errorMessage}`);
                }
            }
        } finally {
            setUploading(false);
            // Сброс input для возможности повторной загрузки того же файла
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleInsertImage = (image) => {
        // Вставляем HTML тег <img> в текст
        const imgTag = `<img src="${image.url}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 1rem 0;" />`;
        onImageInsert(imgTag, image.path);
    };

    const handleRemoveImage = (id) => {
        setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    };

    return (
        <div style={{ width: "100%", marginTop: "10px" }}>
            <label className="form-label">{label}:</label>
            <div style={{ marginBottom: "15px" }}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-view"
                    disabled={uploading}
                >
                    {uploading ? "Загрузка..." : "📷 Загрузить изображения"}
                </button>
            </div>

            {uploadedImages.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h4 style={{ marginBottom: "10px", fontSize: "16px" }}>Загруженные изображения:</h4>
                    <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
                        gap: "15px",
                        marginTop: "10px"
                    }}>
                        {uploadedImages.map((image) => (
                            <div key={image.id} style={{ 
                                border: "1px solid #ccc", 
                                borderRadius: "8px", 
                                padding: "10px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px"
                            }}>
                                <img 
                                    src={image.url} 
                                    alt="Preview" 
                                    style={{ 
                                        width: "100%", 
                                        height: "auto", 
                                        borderRadius: "4px",
                                        maxHeight: "120px",
                                        objectFit: "cover"
                                    }} 
                                />
                                <div style={{ display: "flex", gap: "5px" }}>
                                    <button
                                        type="button"
                                        onClick={() => handleInsertImage(image)}
                                        className="btn btn-view"
                                        style={{ fontSize: "12px", padding: "5px 10px", flex: 1 }}
                                        title="Вставить в текст"
                                    >
                                        ➕
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(image.id)}
                                        className="btn btn-delete"
                                        style={{ fontSize: "12px", padding: "5px 10px" }}
                                        title="Удалить"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
