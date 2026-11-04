import type { Weather } from '../types/weather'

export const weatherMock: Record<string, Weather> = {
  'sao paulo': {
    city: 'São Paulo',
    temperature: 24,
    humidity: 68,
    condition: 'Parcialmente nublado',
    hourly: [
      { time: '00h', temperature: 19 },
      { time: '03h', temperature: 18 },
      { time: '06h', temperature: 18 },
      { time: '09h', temperature: 21 },
      { time: '12h', temperature: 25 },
      { time: '15h', temperature: 27 },
      { time: '18h', temperature: 24 },
      { time: '21h', temperature: 21 },
    ],
  },
  'rio de janeiro': {
    city: 'Rio de Janeiro',
    temperature: 31,
    humidity: 72,
    condition: 'Ensolarado',
    hourly: [
      { time: '00h', temperature: 25 },
      { time: '03h', temperature: 24 },
      { time: '06h', temperature: 24 },
      { time: '09h', temperature: 28 },
      { time: '12h', temperature: 31 },
      { time: '15h', temperature: 33 },
      { time: '18h', temperature: 30 },
      { time: '21h', temperature: 27 },
    ],
  },
  curitiba: {
    city: 'Curitiba',
    temperature: 17,
    humidity: 80,
    condition: 'Chuva fraca',
    hourly: [
      { time: '00h', temperature: 13 },
      { time: '03h', temperature: 12 },
      { time: '06h', temperature: 12 },
      { time: '09h', temperature: 14 },
      { time: '12h', temperature: 17 },
      { time: '15h', temperature: 19 },
      { time: '18h', temperature: 16 },
      { time: '21h', temperature: 14 },
    ],
  },
}