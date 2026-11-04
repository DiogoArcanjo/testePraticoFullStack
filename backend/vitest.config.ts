import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: 'postgres://app:app@localhost:5432/usuarios_test',
      WEATHER_API_KEY: 'chave-de-teste',
    },
    fileParallelism: false,
  },
})