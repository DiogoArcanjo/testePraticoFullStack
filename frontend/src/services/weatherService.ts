import type { Weather } from '../types/weather'
import { ApiError, apiRequest } from './api'

export async function fetchWeather(city: string): Promise<Weather | null> {
  try {
    return await apiRequest<Weather>(`/weather/${encodeURIComponent(city)}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}