import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchWeather } from '../services/weatherService'
import type { Weather } from '../types/weather'

type Status = 'idle' | 'loading' | 'success' | 'not-found' | 'error'

function WeatherPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const city = searchParams.get('city') ?? ''

  const [inputValue, setInputValue] = useState(city)
  const [status, setStatus] = useState<Status>('idle')
  const [weather, setWeather] = useState<Weather | null>(null)

  useEffect(() => {
    if (!city) {
      setStatus('idle')
      return
    }

    let ignore = false
    setStatus('loading')

    fetchWeather(city)
      .then((result) => {
        if (ignore) return
        if (result) {
          setWeather(result)
          setStatus('success')
        } else {
          setStatus('not-found')
        }
      })
      .catch(() => {
        if (!ignore) setStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [city])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = inputValue.trim()
    if (value) {
      setSearchParams({ city: value })
    }
  }

  const temperatures = weather?.hourly.map((hour) => hour.temperature) ?? []
  const minTemperature = Math.min(...temperatures)
  const maxTemperature = Math.max(...temperatures)

  return (
    <section>
      <h1>Clima</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="city">Cidade</label>
        <input
          id="city"
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {status === 'idle' && <p>Digite uma cidade para ver o clima.</p>}

      {status === 'loading' && <p role="status">Carregando...</p>}

      {status === 'not-found' && (
        <p role="alert">
          Cidade não encontrada. Tente São Paulo, Rio de Janeiro ou Curitiba.
        </p>
      )}

      {status === 'error' && (
        <p role="alert">
          Não foi possível consultar o clima agora. Tente novamente em instantes.
        </p>
      )}

      {status === 'success' && weather && (
        <div>
          <h2>{weather.city}</h2>

          <dl>
            <dt>Temperatura</dt>
            <dd>{weather.temperature} °C</dd>

            <dt>Umidade</dt>
            <dd>{weather.humidity}%</dd>

            <dt>Condição</dt>
            <dd>{weather.condition}</dd>
          </dl>

          <h3>Variação ao longo do dia</h3>
          <p>
            Mínima de {minTemperature} °C e máxima de {maxTemperature} °C.
          </p>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={weather.hourly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis unit="°C" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Temperatura"
                  stroke="#8884d8"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  )
}

export default WeatherPage