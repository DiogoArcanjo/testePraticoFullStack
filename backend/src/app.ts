import express from 'express'
import { pool } from './db'
import { errorHandler, notFoundHandler } from './errors'
import { userRoutes } from './users/userRoutes'

export const app = express()

app.use(express.json())

app.get('/health', async (_req, res) => {
  await pool.query('SELECT 1')
  res.json({ status: 'ok' })
})

app.use('/users', userRoutes)

app.use(notFoundHandler)
app.use(errorHandler)