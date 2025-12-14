const CATEGORY_API = "http://localhost:8080/api/categories";

export async function getCategories() {
    const res = await fetch(CATEGORY_API);
    if (!res.ok) {
        throw new Error("Error loading categories");
    }
    return res.json();
}

export async function getCategory(id) {
    const res = await fetch(`${CATEGORY_API}/${id}`);
    if (!res.ok) {
        throw new Error("Error loading category");
    }
    return res.json();
}

export async function createCategory(category) {
    const res = await fetch(CATEGORY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error creating category");
    }
    return res.json();
}

export async function updateCategory(id, category) {
    const res = await fetch(`${CATEGORY_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error updating category");
    }
    return res.json();
}

export async function deleteCategory(id) {
    await fetch(`${CATEGORY_API}/${id}`, {method: "DELETE"});
}
