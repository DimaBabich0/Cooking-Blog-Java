const BLOG_API = "http://localhost:8080/api/blogs";

export async function getBlogs() {
    const res = await fetch(BLOG_API);
    if (!res.ok) throw new Error("Error loading blogs");
    return res.json();
}

export async function getBlog(id) {
    const res = await fetch(`${BLOG_API}/${id}`);
    if (!res.ok) throw new Error("Error loading blog");
    return res.json();
}

export async function createBlog(blog) {
    const res = await fetch(BLOG_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error creating blog");
    }
    return res.json();
}

export async function updateBlog(id, blog) {
    const res = await fetch(`${BLOG_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error updating blog");
    }
    return res.json();
}

export async function deleteBlog(id) {
    await fetch(`${BLOG_API}/${id}`, { method: "DELETE" });
}
