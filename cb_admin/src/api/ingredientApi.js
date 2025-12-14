const INGREDIENT_API = "http://localhost:8080/api/ingredients";

export async function getIngredients() {
    const res = await fetch(INGREDIENT_API);
    if (!res.ok) {
        throw new Error("Error loading categories");
    }
    return res.json();
}

export async function getIngredient(id) {
    const res = await fetch(`${INGREDIENT_API}/${id}`);
    if (!res.ok) {
        throw new Error("Error loading ingredient");
    }
    return res.json();
}

export async function createIngredient(ingredient) {
    const res = await fetch(INGREDIENT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ingredient),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error creating ingredient");
    }
    return res.json();
}

export async function updateIngredient(id, ingredient) {
    const res = await fetch(`${INGREDIENT_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ingredient),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error updating ingredient");
    }
    return res.json();
}

export async function deleteIngredient(id) {
    await fetch(`${INGREDIENT_API}/${id}`, {method: "DELETE"});
}
