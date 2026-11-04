import { pool } from '../db'

export type User = {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

type UserRow = {
  id: string
  name: string
  email: string
  created_at: Date
  updated_at: Date
}

const COLUMNS = 'id, name, email, created_at, updated_at'

function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

export async function insertUser(name: string, email: string): Promise<User> {
  const { rows } = await pool.query<UserRow>(
    `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING ${COLUMNS}`,
    [name, email],
  )
  return toUser(rows[0])
}

export async function findUserById(id: string): Promise<User | null> {
  const { rows } = await pool.query<UserRow>(
    `SELECT ${COLUMNS} FROM users WHERE id = $1`,
    [id],
  )
  return rows[0] ? toUser(rows[0]) : null
}

export async function updateUserById(
  id: string,
  data: { name?: string; email?: string },
): Promise<User | null> {
  const { rows } = await pool.query<UserRow>(
    `UPDATE users
       SET name = COALESCE($2, name),
           email = COALESCE($3, email),
           updated_at = now()
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [id, data.name ?? null, data.email ?? null],
  )
  return rows[0] ? toUser(rows[0]) : null
}

export async function deleteUserById(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM users WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}