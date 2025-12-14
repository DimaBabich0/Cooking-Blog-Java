const RATING_API = "http://localhost:8080/api/ratings";

export async function getRatings() {
    const res = await fetch(RATING_API);
    if (!res.ok) {
        throw new Error("Error loading ratings");
    }
    return res.json();
}

export async function getRating(id) {
    const res = await fetch(`${RATING_API}/${id}`);
    if (!res.ok) {
        throw new Error("Error loading rating");
    }
    return res.json();
}

export async function createRating(rating) {
    const res = await fetch(RATING_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rating),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error creating rating");
    }
    return res.json();
}

export async function updateRating(id, rating) {
    const res = await fetch(`${RATING_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rating),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error updating rating");
    }
    return res.json();
}

export async function deleteRating(id) {
    await fetch(`${RATING_API}/${id}`, {method: "DELETE"});
}
