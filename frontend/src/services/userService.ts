import type { User } from "../types/user";
import { usersMock } from "../mocks/users";

export type UserInput = {
  name: string;
  email: string;
};

let users: User[] = [...usersMock];

export function listUsers(): User[] {
  return users;
}

export function getUser(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

export function emailExists(email: string, ignoreId?: string): boolean {
  const normalized = email.trim().toLowerCase();
  return users.some(
    (user) => user.email.toLowerCase() === normalized && user.id !== ignoreId,
  );
}

export function createUser(input: UserInput): User {
  const user: User = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  };
  users = [...users, user];
  return user;
}

export function updateUser(id: string, input: UserInput): User | undefined {
  const existing = getUser(id);
  if (!existing) return undefined;

  const updated: User = {
    ...existing,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
  };
  users = users.map((user) => (user.id === id ? updated : user));
  return updated;
}

export function deleteUser(id: string): void {
  users = users.filter((user) => user.id !== id)
}
