const CATEGORY_API = "http://localhost:8080/api/categories";

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  photoUrl?: string;
}

export async function getCategories(): Promise<CategoryDto[]> {
  const res = await fetch(CATEGORY_API);
  if (!res.ok) throw new Error("Error loading categories");
  return res.json();
}

export async function getCategory(id: number | string): Promise<CategoryDto> {
  const res = await fetch(`${CATEGORY_API}/${id}`);
  if (!res.ok) throw new Error("Error loading category");
  return res.json();
}

export async function createCategory(category: Partial<CategoryDto>): Promise<CategoryDto> {
  const res = await fetch(CATEGORY_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(category),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error creating category");
  }
  return res.json();
}

export async function updateCategory(id: number, category: Partial<CategoryDto>): Promise<CategoryDto> {
  const res = await fetch(`${CATEGORY_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(category),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error updating category");
  }
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${CATEGORY_API}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Error deleting category");
  }
}
