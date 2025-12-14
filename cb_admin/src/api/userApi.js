const USER_API = "http://localhost:8080/api/users";

export async function getUsers() {
    const res = await fetch(USER_API);
    if (!res.ok) {
        throw new Error("Error loading users");
    }
    return res.json();
}

export async function getUser(id) {
    const res = await fetch(`${USER_API}/${id}`);
    if (!res.ok) {
        throw new Error("Error loading user");
    }
    return res.json();
}

export async function createUser(user) {
    const res = await fetch(USER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error creating user");
    }
    return res.json();
}

export async function updateUser(id, user) {
    const res = await fetch(`${USER_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error updating user");
    }
    return res.json();
}

export async function deleteUser(id) {
    await fetch(`${USER_API}/${id}`, {method: "DELETE"});
}

export async function searchUsers(query) {
    const res = await fetch(`${USER_API}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error searching specific users");
    }
    return res.json();
}

export async function getRoles() {
    const res = await fetch("http://localhost:8080/api/roles");
    if (!res.ok) {
        throw new Error("Error loading users");
    }
    return res.json();
}
