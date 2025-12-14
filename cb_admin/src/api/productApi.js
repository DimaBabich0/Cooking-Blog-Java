const PRODUCT_API = "http://localhost:8080/api/products";

export async function getProducts() {
    const res = await fetch(PRODUCT_API);
    if (!res.ok) {
        throw new Error("Error loading products");
    }
    return res.json();
}

export async function getProduct(id) {
    const res = await fetch(`${PRODUCT_API}/${id}`);
    if (!res.ok) {
        throw new Error("Error loading product");
    }
    return res.json();
}

export async function createProduct(product) {
    const res = await fetch(PRODUCT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error creating product");
    }
    return res.json();
}

export async function updateProduct(id, product) {
    const res = await fetch(`${PRODUCT_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error updating product");
    }
    return res.json();
}

export async function deleteProduct(id) {
    await fetch(`${PRODUCT_API}/${id}`, {method: "DELETE"});
}
