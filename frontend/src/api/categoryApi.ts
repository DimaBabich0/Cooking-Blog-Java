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
