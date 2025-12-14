const RECIPE_API = "http://localhost:8080/api/recipes";

export async function getRecipes() {
    const res = await fetch(RECIPE_API);
    if (!res.ok) {
        throw new Error("Error loading recipes");
    }
    return res.json();
}

export async function getCategory(id) {
    const res = await fetch(`${RECIPE_API}/${id}`);
    if (!res.ok) {
        throw new Error("Error loading recipe");
    }
    return res.json();
}

export async function createCategory(recipe) {
    const res = await fetch(RECIPE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error creating recipe");
    }
    return res.json();
}

export async function updateCategory(id, recipe) {
    const res = await fetch(`${RECIPE_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error updating recipe");
    }
    return res.json();
}

export async function deleteCategory(id) {
    await fetch(`${RECIPE_API}/${id}`, {method: "DELETE"});
}
