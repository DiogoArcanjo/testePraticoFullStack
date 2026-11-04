import { env } from "../env";
import { AppError } from "../errors";

export type Weather = {
  city: string;
  region: string;
  country: string;
  temperature: number;
  humidity: number;
  condition: string;
  hourly: { time: string; temperature: number }[];
};

type WeatherApiResponse = {
  location: { name: string; region: string; country: string };
  current: { temp_c: number; humidity: number; condition: { text: string } };
  forecast: { forecastday: { hour: { time: string; temp_c: number }[] }[] };
};

const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";
const TIMEOUT_MS = 5000;
const CACHE_TTL_MS = 10 * 60 * 1000;

const cache = new Map<string, { data: Weather; expiresAt: number }>();

export function clearWeatherCache() {
  cache.clear();
}

function normalizeCity(city: string): string {
  return city.trim().toLowerCase();
}

function toWeather(body: WeatherApiResponse): Weather {
  return {
    city: body.location.name,
    region: body.location.region,
    country: body.location.country,
    temperature: Math.round(body.current.temp_c),
    humidity: body.current.humidity,
    condition: body.current.condition.text,
    hourly: body.forecast.forecastday[0].hour.map((hour) => ({
      time: `${hour.time.slice(11, 13)}h`,
      temperature: Math.round(hour.temp_c),
    })),
  };
}

const unavailable = () =>
  new AppError(
    503,
    "WEATHER_UNAVAILABLE",
    "Serviço de clima indisponível no momento.",
  );

export async function getWeather(city: string): Promise<Weather> {
  const cacheKey = normalizeCity(city);
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  if (!env.WEATHER_API_KEY) {
    console.error("WEATHER_API_KEY não configurada");
    throw unavailable();
  }

  const url = new URL(BASE_URL);
  url.searchParams.set("key", env.WEATHER_API_KEY);
  url.searchParams.set("q", city);
  url.searchParams.set("days", "1");
  url.searchParams.set("lang", "pt");

  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new AppError(
        504,
        "WEATHER_TIMEOUT",
        "O serviço de clima demorou demais para responder.",
      );
    }
    throw unavailable();
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const providerCode = body?.error?.code;

    if (response.status === 400 && providerCode === 1006) {
      throw new AppError(404, "CITY_NOT_FOUND", "Cidade não encontrada.");
    }
    if (response.status === 429 || providerCode === 2007) {
      throw new AppError(
        429,
        "WEATHER_RATE_LIMITED",
        "Limite de consultas de clima atingido. Tente novamente mais tarde.",
      );
    }

    console.error("Falha na API de clima:", response.status, providerCode);
    throw unavailable();
  }

  const data = toWeather((await response.json()) as WeatherApiResponse);
  cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
}
