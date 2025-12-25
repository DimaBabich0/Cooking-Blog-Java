const RECIPE_API = "http://localhost:8080/api/recipes";

export async function getRecipes() {
    const res = await fetch(RECIPE_API);
    if (!res.ok) {
        throw new Error("Error loading recipes");
    }
    return res.json();
}

export async function getRecipe(id) {
    const res = await fetch(`${RECIPE_API}/${id}`);
    if (!res.ok) {
        throw new Error("Error loading recipe");
    }
    return res.json();
}

export async function createRecipe(recipe) {
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

export async function updateRecipe(id, recipe) {
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

export async function deleteRecipe(id) {
    await fetch(`${RECIPE_API}/${id}`, {method: "DELETE"});
}

export async function searchRecipes(query) {
    const res = await fetch(`${RECIPE_API}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error searching specific recipe");
    }
    return res.json();
}
