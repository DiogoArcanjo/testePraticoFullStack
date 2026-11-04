import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Documentação da API', () => {
  it('descreve todas as rotas implementadas', async () => {
    const response = await request(app).get('/openapi.json')

    expect(response.status).toBe(200)
    expect(Object.keys(response.body.paths)).toEqual(
      expect.arrayContaining(['/health', '/users', '/users/{id}', '/weather/{city}']),
    )
  })
})