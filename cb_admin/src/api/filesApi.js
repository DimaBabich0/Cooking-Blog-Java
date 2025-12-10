const UPLOAD_URL = "http://localhost:8080/api/files/upload";

export async function uploadFile(formData, folder) {
    formData.append("folder", folder);
    const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("Error uploading file");
    const data = await res.json();
    return data.path;
}