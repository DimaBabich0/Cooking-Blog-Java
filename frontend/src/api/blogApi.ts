const BLOG_API = "http://localhost:8080/api/blogs";

export interface BlogDto {
  id: number;
  title: string;
  description: string;
  text: string;
  photoUrl: string | null;
  cookingTime: number | null;
  status?: string; // PENDING, PUBLISHED, REJECTED
  createdAt: string;
  updatedAt: string;
  userDto: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
  };
}

export async function getBlogs(): Promise<BlogDto[]> {
  const res = await fetch(BLOG_API);
  if (!res.ok) throw new Error("Error loading blogs");
  return res.json();
}

export async function getBlog(id: number | string): Promise<BlogDto> {
  const res = await fetch(`${BLOG_API}/${id}`);
  if (!res.ok) throw new Error("Error loading blog");
  return res.json();
}

export async function createBlog(blog: Partial<BlogDto>): Promise<BlogDto> {
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

export async function updateBlog(id: number, blog: Partial<BlogDto>): Promise<BlogDto> {
  const res = await fetch(`${BLOG_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(blog),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error updating blog");
  }
  return res.json();
}

export async function deleteBlog(id: number): Promise<void> {
  const res = await fetch(`${BLOG_API}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Error deleting blog");
  }
}
