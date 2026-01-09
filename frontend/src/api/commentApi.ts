const COMMENT_API = "http://localhost:8080/api/comments";

export interface CommentDto {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  recipeId?: number;
  blogId?: number;
  userDto: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
  };
}

export async function getComments(): Promise<CommentDto[]> {
  const res = await fetch(COMMENT_API);
  if (!res.ok) throw new Error("Error loading comments");
  return res.json();
}

export async function getComment(id: number | string): Promise<CommentDto> {
  const res = await fetch(`${COMMENT_API}/${id}`);
  if (!res.ok) throw new Error("Error loading comment");
  return res.json();
}

export async function getCommentsByRecipe(recipeId: number): Promise<CommentDto[]> {
  const res = await fetch(`${COMMENT_API}/recipe/${recipeId}`);
  if (!res.ok) throw new Error("Error loading comments");
  return res.json();
}

export async function getCommentsByBlog(blogId: number): Promise<CommentDto[]> {
  const res = await fetch(`${COMMENT_API}/blog/${blogId}`);
  if (!res.ok) throw new Error("Error loading comments");
  return res.json();
}

export async function createComment(comment: Partial<CommentDto>): Promise<CommentDto> {
  const res = await fetch(COMMENT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error creating comment");
  }
  return res.json();
}

export async function updateComment(
  id: number,
  comment: Partial<CommentDto>
): Promise<CommentDto> {
  const res = await fetch(`${COMMENT_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error updating comment");
  }
  return res.json();
}

export async function deleteComment(id: number): Promise<void> {
  const res = await fetch(`${COMMENT_API}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error deleting comment");
  }
}
