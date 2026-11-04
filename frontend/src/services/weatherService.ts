import type { Weather } from '../types/weather'
import { weatherMock } from '../mocks/weather'

const FAKE_DELAY_MS = 600

function normalizeCity(city: string): string {
  return city
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function fetchWeather(city: string): Promise<Weather | null> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const key = normalizeCity(city)

      if (key === 'erro') {
        reject(new Error('Serviço de clima indisponível'))
        return
      }

      resolve(weatherMock[key] ?? null)
    }, FAKE_DELAY_MS)
  })
}