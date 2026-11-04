import type { User } from '../types/user'
import { ApiError, apiRequest } from './api'

export type UserInput = {
  name: string
  email: string
}

export type ListUsersParams = {
  q: string
  page: number
  pageSize: number
  order: 'asc' | 'desc'
}

export type UserList = {
  data: User[]
  meta: { page: number; pageSize: number; total: number; totalPages: number }
}

export function listUsers(params: ListUsersParams): Promise<UserList> {
  const query = new URLSearchParams({
    q: params.q,
    page: String(params.page),
    pageSize: String(params.pageSize),
    order: params.order,
  })
  return apiRequest<UserList>(`/users?${query}`)
}

export async function getUser(id: string): Promise<User | null> {
  try {
    return await apiRequest<User>(`/users/${id}`)
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      return null
    }
    throw error
  }
}

export function createUser(input: UserInput): Promise<User> {
  return apiRequest<User>('/users', { method: 'POST', body: JSON.stringify(input) })
}

export function updateUser(id: string, input: UserInput): Promise<User> {
  return apiRequest<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(input) })
}

export function deleteUser(id: string): Promise<void> {
  return apiRequest<void>(`/users/${id}`, { method: 'DELETE' })
}