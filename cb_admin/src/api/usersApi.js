const API_URL = "http://localhost:8080/api/users";
const UPLOAD_URL = "http://localhost:8080/api/files/upload";

export async function getUsers() {
    const res = await fetch(API_URL);
    if (!res.ok) {
        throw new Error("Error loading users");
    }
    return res.json();
}

export async function getUser(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
        throw new Error("Error loading user");
    }
    return res.json();
}

export async function createUser(user) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!res.ok) {
        throw new Error("Error creating user");
    }
    return res.json();
}

export async function updateUser(id, user) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!res.ok) {
        throw new Error("Error update user");
    }
    return res.json();
}

export async function deleteUser(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

export async function uploadFile(formData) {
    const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("Error uploading file");
    const data = await res.json();
    return data.path;
}