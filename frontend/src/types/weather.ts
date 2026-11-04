export type HourlyTemperature = {
  time: string
  temperature: number
}

export type Weather = {
  city: string
  temperature: number
  humidity: number
  condition: string
  hourly: HourlyTemperature[]
}