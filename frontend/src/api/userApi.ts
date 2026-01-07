const USER_API = "http://localhost:8080/api/users";

export interface UserDto {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  photoUrl?: string;
}

export async function getUsers(): Promise<UserDto[]> {
  const res = await fetch(USER_API);
  if (!res.ok) throw new Error("Error loading users");
  return res.json();
}

export async function getFirstUser(): Promise<UserDto | null> {
  const users = await getUsers();
  return users.length > 0 ? users[0] : null;
}

export async function createUser(user: Partial<UserDto & { password: string }>): Promise<UserDto> {
  const res = await fetch(USER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Ошибка создания пользователя");
  }
  return res.json();
}

export async function updateUser(id: number, user: Partial<UserDto & { password?: string }>): Promise<UserDto> {
  const res = await fetch(`${USER_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error updating user");
  }
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${USER_API}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Error deleting user");
  }
}
