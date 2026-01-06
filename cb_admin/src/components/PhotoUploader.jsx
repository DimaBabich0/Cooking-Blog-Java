import React, { useRef, useState } from "react";
import { uploadFile } from "../api/filesApi.js";

export default function PhotoUploader({ label, onUpload, initialUrl, folder }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(initialUrl || null);

    function handleChooseFile() {
        fileInputRef.current.click();
    }

    async function handleFileUpload(file) {
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const uploadedPath = await uploadFile(formData, folder);
            setPreviewUrl(uploadedPath);
            if (onUpload) onUpload(uploadedPath);
        } catch (e) {
            alert("Error while trying to upload file: " + e.message);
        } finally {
            setUploading(false);
        }
    }

    function onFileSelected(e) {
        const file = e.target.files[0];
        if (file) handleFileUpload(file);
    }

    return (
        <div>
            <label className="form-label">{label}:</label>
            {previewUrl && (
                <img
                    src={`http://localhost:8080/api/files/images/${previewUrl}`}
                    alt="preview"
                    style={{ width: "120px", marginTop: "10px", borderRadius: "8px" }}
                />
            )}
            <br></br>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onFileSelected}
                style={{ display: "none" }}
            />
            <button className="btn btn-view" onClick={handleChooseFile} disabled={uploading}>
                {uploading ? "Loading..." : "Load photo"}
            </button>
        </div>
    );
}