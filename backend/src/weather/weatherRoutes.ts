import { Router } from 'express'
import { z } from 'zod'
import { getWeather } from './weatherService'

export const weatherRoutes = Router()

const citySchema = z
  .string()
  .trim()
  .min(1, 'Informe a cidade.')
  .max(100, 'O nome da cidade pode ter no máximo 100 caracteres.')

weatherRoutes.get('/:city', async (req, res) => {
  const city = citySchema.parse(req.params.city)
  const weather = await getWeather(city)
  res.json(weather)
})