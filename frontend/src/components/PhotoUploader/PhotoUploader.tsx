import React, { useState, useRef } from "react";
import { uploadFile, getImageUrl } from "../../api/filesApi";
import styles from "./PhotoUploader.module.scss";

interface PhotoUploaderProps {
  onUpload: (imagePath: string) => void;
  folder?: string;
  initialUrl?: string;
}

export default function PhotoUploader({ 
  onUpload, 
  folder = "blog", 
  initialUrl 
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    initialUrl ? getImageUrl(initialUrl) : undefined
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(`Файл ${file.name} не является изображением`);
      return;
    }

    setUploading(true);
    try {
      const path = await uploadFile(file, folder);
      const url = getImageUrl(path);
      
      setPreviewUrl(url);
      onUpload(path); // Передаем путь, а не URL
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
      alert(`Ошибка загрузки: ${errorMessage}`);
    } finally {
      setUploading(false);
      // Сброс input для возможности повторной загрузки того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={styles.photoUploader}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      
      {previewUrl && (
        <div className={styles.preview}>
          <img src={previewUrl} alt="Preview" className={styles.previewImage} />
        </div>
      )}
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={styles.uploadBtn}
        disabled={uploading}
      >
        {uploading ? "Загрузка..." : "📷 Загрузить главное изображение"}
      </button>
      
      <small className={styles.hint}>
        Это изображение будет использоваться как обложка поста (показывается в списке постов и вверху страницы)
      </small>
    </div>
  );
}
