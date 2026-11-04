import express from 'express'
import { pool } from './db'

export const app = express()

app.use(express.json())

app.get('/health', async (_req, res) => {
  await pool.query('SELECT 1')
  res.json({ status: 'ok' })
})