import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app";
import { clearWeatherCache } from "../src/weather/weatherService";

const providerResponse = {
  location: { name: "Curitiba", region: "Parana", country: "Brazil" },
  current: { temp_c: 17.4, humidity: 80, condition: { text: "Chuva fraca" } },
  forecast: {
    forecastday: [
      {
        hour: [
          { time: "2026-11-04 00:00", temp_c: 13.2 },
          { time: "2026-11-04 01:00", temp_c: 12.8 },
        ],
      },
    ],
  },
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

let fetchMock: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  clearWeatherCache();
  fetchMock = vi.spyOn(globalThis, "fetch");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /weather/:city", () => {
  it("converte a resposta do provedor para o contrato próprio", async () => {
    fetchMock.mockResolvedValue(jsonResponse(providerResponse));

    const response = await request(app).get("/weather/Curitiba");

    expect(response.status).toBe(200);
        expect(response.body).toEqual({
      city: 'Curitiba',
      region: 'Parana',
      country: 'Brazil',
      temperature: 17,
      humidity: 80,
      condition: 'Chuva fraca',
      hourly: [
        { time: '00h', temperature: 13 },
        { time: '01h', temperature: 13 },
      ],
    });
  });

  it("usa o cache na segunda consulta da mesma cidade", async () => {
    fetchMock.mockImplementation(async () => jsonResponse(providerResponse));

    await request(app).get("/weather/Curitiba");
    await request(app).get("/weather/curitiba");

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retorna 404 quando a cidade não existe", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { error: { code: 1006, message: "No matching location found." } },
        400,
      ),
    );

    const response = await request(app).get("/weather/CidadeQueNaoExiste");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("CITY_NOT_FOUND");
  });

  it("retorna 429 quando o limite de consultas é atingido", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: 2007,
            message: "API key has exceeded calls per month quota.",
          },
        },
        403,
      ),
    );

    const response = await request(app).get("/weather/Curitiba");

    expect(response.status).toBe(429);
    expect(response.body.error.code).toBe("WEATHER_RATE_LIMITED");
  });

  it("retorna 503 quando o provedor está indisponível", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 500));

    const response = await request(app).get("/weather/Curitiba");

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("WEATHER_UNAVAILABLE");
  });

  it("retorna 503 quando não há conexão com o provedor", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const response = await request(app).get("/weather/Curitiba");

    expect(response.status).toBe(503);
  });

  it("retorna 504 quando o provedor demora demais", async () => {
    fetchMock.mockRejectedValue(
      Object.assign(new Error("timeout"), { name: "TimeoutError" }),
    );

    const response = await request(app).get("/weather/Curitiba");

    expect(response.status).toBe(504);
    expect(response.body.error.code).toBe("WEATHER_TIMEOUT");
  });

  it("não expõe a chave da API nas respostas de erro", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 500));

    const response = await request(app).get("/weather/Curitiba");

    expect(JSON.stringify(response.body)).not.toContain("chave-de-teste");
  });
});
