const UPLOAD_URL = "http://localhost:8080/api/files/upload";

export async function uploadFile(file: File, folder: string): Promise<string> {
  // Проверка размера файла (максимум 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error(`Файл слишком большой. Максимальный размер: 5MB. Текущий размер: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  
  try {
    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = "Ошибка загрузки файла";
      
      if (res.status === 413) {
        errorMessage = "Файл слишком большой (максимум 5MB)";
      } else if (res.status === 404) {
        errorMessage = "Сервер не найден. Убедитесь, что backend запущен на http://localhost:8080";
      } else if (res.status === 500) {
        errorMessage = "Ошибка сервера при загрузке файла";
      } else {
        errorMessage = `Ошибка ${res.status}: ${errorText || "Неизвестная ошибка"}`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    return data.path; // Возвращает "folder/filename"
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error("Не удалось подключиться к серверу. Убедитесь, что backend запущен на http://localhost:8080");
    }
    throw error;
  }
}

export function getImageUrl(path: string): string {
  // path имеет формат "folder/filename"
  return `http://localhost:8080/api/files/images/${path}`;
}
