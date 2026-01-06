import React, { useState, useRef } from "react";
import { uploadFile, getImageUrl } from "../../api/filesApi";
import styles from "./ImageUploader.module.scss";

interface UploadedImage {
  id: string;
  path: string;
  url: string;
  file: File;
}

interface ImageUploaderProps {
  onImageInsert: (imageUrl: string, imagePath: string) => void;
  folder?: string;
}

export default function ImageUploader({ onImageInsert, folder = "blog" }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          const path = await uploadFile(file, folder);
          const url = getImageUrl(path);
          
          const newImage: UploadedImage = {
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

  const handleInsertImage = (image: UploadedImage) => {
    // Вставляем HTML тег <img> в текст
    const imgTag = `<img src="${image.url}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 1rem 0;" />`;
    onImageInsert(imgTag, image.path);
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className={styles.imageUploader}>
      <div className={styles.uploadSection}>
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
          className={styles.uploadBtn}
          disabled={uploading}
        >
          {uploading ? "Загрузка..." : "📷 Загрузить изображения"}
        </button>
        {uploading && <span className={styles.uploadingText}>Загрузка...</span>}
      </div>

      {uploadedImages.length > 0 && (
        <div className={styles.gallery}>
          <h3 className={styles.galleryTitle}>Загруженные изображения:</h3>
          <div className={styles.imagesGrid}>
            {uploadedImages.map((image) => (
              <div key={image.id} className={styles.imageItem}>
                <img src={image.url} alt="Preview" className={styles.preview} />
                <div className={styles.imageActions}>
                  <button
                    type="button"
                    onClick={() => handleInsertImage(image)}
                    className={styles.insertBtn}
                    title="Вставить в текст"
                  >
                    ➕ Вставить
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image.id)}
                    className={styles.removeBtn}
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
