const RATING_API = "http://localhost:8080/api/ratings";

export interface RatingDto {
  id: number;
  rating: number;
  userId: number;
  recipeId?: number;
  blogId?: number;
}

export async function getRatings(): Promise<RatingDto[]> {
  const res = await fetch(RATING_API);
  if (!res.ok) throw new Error("Error loading ratings");
  return res.json();
}

export async function getRating(id: number | string): Promise<RatingDto> {
  const res = await fetch(`${RATING_API}/${id}`);
  if (!res.ok) throw new Error("Error loading rating");
  return res.json();
}

export async function getRatingsByRecipe(recipeId: number): Promise<RatingDto[]> {
  const res = await fetch(`${RATING_API}/recipe/${recipeId}`);
  if (!res.ok) throw new Error("Error loading ratings");
  return res.json();
}

export async function getRatingsByBlog(blogId: number): Promise<RatingDto[]> {
  const res = await fetch(`${RATING_API}/blog/${blogId}`);
  if (!res.ok) throw new Error("Error loading ratings");
  return res.json();
}

export async function getAverageRatingByRecipe(recipeId: number): Promise<number> {
  const res = await fetch(`${RATING_API}/recipe/${recipeId}/average`);
  if (!res.ok) throw new Error("Error loading average rating");
  const data = await res.json();
  return data.average || 0;
}

export async function getAverageRatingByBlog(blogId: number): Promise<number> {
  const res = await fetch(`${RATING_API}/blog/${blogId}/average`);
  if (!res.ok) throw new Error("Error loading average rating");
  const data = await res.json();
  return data.average || 0;
}

export async function getUserRatingForRecipe(
  userId: number,
  recipeId: number
): Promise<RatingDto | null> {
  try {
    const res = await fetch(`${RATING_API}/user/${userId}/recipe/${recipeId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error loading user rating");
    return res.json();
  } catch (err) {
    console.error("Error fetching user rating:", err);
    return null;
  }
}

export async function getUserRatingForBlog(
  userId: number,
  blogId: number
): Promise<RatingDto | null> {
  try {
    const res = await fetch(`${RATING_API}/user/${userId}/blog/${blogId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error loading user rating");
    return res.json();
  } catch (err) {
    console.error("Error fetching user rating:", err);
    return null;
  }
}

export async function createRating(rating: Partial<RatingDto>): Promise<RatingDto> {
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

export async function updateRating(
  id: number,
  rating: Partial<RatingDto>
): Promise<RatingDto> {
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

export async function deleteRating(id: number): Promise<void> {
  const res = await fetch(`${RATING_API}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error deleting rating");
  }
}
