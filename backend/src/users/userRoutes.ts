import { Router } from 'express'
import { AppError } from '../errors'
import { createUserSchema, updateUserSchema, userIdSchema } from './userSchemas'
import {
  deleteUserById,
  findUserById,
  insertUser,
  updateUserById,
} from './userRepository'

export const userRoutes = Router()

userRoutes.post('/', async (req, res) => {
  const data = createUserSchema.parse(req.body)
  const user = await insertUser(data.name, data.email)
  res.status(201).json(user)
})

userRoutes.get('/:id', async (req, res) => {
  const id = userIdSchema.parse(req.params.id)
  const user = await findUserById(id)
  if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'Usuário não encontrado.')
  res.json(user)
})

userRoutes.patch('/:id', async (req, res) => {
  const id = userIdSchema.parse(req.params.id)
  const data = updateUserSchema.parse(req.body)
  const user = await updateUserById(id, data)
  if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'Usuário não encontrado.')
  res.json(user)
})

userRoutes.delete('/:id', async (req, res) => {
  const id = userIdSchema.parse(req.params.id)
  const deleted = await deleteUserById(id)
  if (!deleted) throw new AppError(404, 'USER_NOT_FOUND', 'Usuário não encontrado.')
  res.status(204).end()
})