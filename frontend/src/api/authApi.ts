const AUTH_API = "http://localhost:8080/api/auth";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: UserDto | null;
}

export interface UserDto {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  photoUrl?: string;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${AUTH_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Важно для сессий
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Ошибка входа");
  }
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch(`${AUTH_API}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getCurrentUser(): Promise<UserDto | null> {
  const res = await fetch(`${AUTH_API}/me`, {
    credentials: "include",
  });
  if (!res.ok || res.status === 204) {
    return null;
  }
  const text = await res.text();
  if (!text || text.trim() === '') {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Error parsing user response:", e);
    return null;
  }
}

export async function checkAuth(): Promise<boolean> {
  const res = await fetch(`${AUTH_API}/check`, {
    credentials: "include",
  });
  if (!res.ok) return false;
  return res.json();
}
