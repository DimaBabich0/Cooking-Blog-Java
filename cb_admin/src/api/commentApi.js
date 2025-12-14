const COMMENT_API = "http://localhost:8080/api/comments";

export async function getComments() {
    const res = await fetch(COMMENT_API);
    if (!res.ok) {
        throw new Error("Error loading comments");
    }
    return res.json();
}

export async function getComment(id) {
    const res = await fetch(`${COMMENT_API}/${id}`);
    if (!res.ok) {
        throw new Error("Error loading comment");
    }
    return res.json();
}

export async function createComment(comment) {
    const res = await fetch(COMMENT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error creating comment");
    }
    return res.json();
}

export async function updateComment(id, comment) {
    const res = await fetch(`${COMMENT_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error updating comment");
    }
    return res.json();
}

export async function deleteComment(id) {
    await fetch(`${COMMENT_API}/${id}`, {method: "DELETE"});
}
