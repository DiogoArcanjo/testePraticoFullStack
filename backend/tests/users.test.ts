import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { pool } from '../src/db'

function createUser(name: string, email: string) {
  return request(app).post('/users').send({ name, email })
}

beforeEach(async () => {
  await pool.query('TRUNCATE users')
})

afterAll(async () => {
  await pool.end()
})

describe('POST /users', () => {
  it('cria um usuário e salva o email em minúsculas', async () => {
    const response = await createUser('Ana Souza', 'Ana@Example.com')

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({ name: 'Ana Souza', email: 'ana@example.com' })
    expect(response.body.id).toEqual(expect.any(String))
  })

  it('rejeita email duplicado, mesmo com maiúsculas diferentes', async () => {
    await createUser('Ana Souza', 'ana@example.com')
    const response = await createUser('Outra Ana', 'ANA@example.com')

    expect(response.status).toBe(409)
    expect(response.body.error.code).toBe('EMAIL_ALREADY_EXISTS')
  })

  it('rejeita dados inválidos informando cada campo', async () => {
    const response = await createUser('', 'nao-e-um-email')

    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('VALIDATION_ERROR')
    const fields = response.body.error.details.map((detail: { field: string }) => detail.field)
    expect(fields).toEqual(expect.arrayContaining(['name', 'email']))
  })
})

describe('GET /users', () => {
  beforeEach(async () => {
    for (const name of ['Ana', 'Bruno', 'Carla', 'Daniel', 'Eduarda']) {
      await createUser(`${name} Teste`, `${name.toLowerCase()}@example.com`)
    }
  })

  it('filtra parcialmente por nome ou email, sem diferenciar maiúsculas', async () => {
    const response = await request(app).get('/users').query({ q: 'ANA' })

    expect(response.status).toBe(200)
    expect(response.body.meta.total).toBe(1)
    expect(response.body.data[0].name).toBe('Ana Teste')
  })

  it('pagina os resultados e retorna os metadados', async () => {
    const response = await request(app).get('/users').query({ page: 3, pageSize: 2 })

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveLength(1)
    expect(response.body.data[0].name).toBe('Eduarda Teste')
    expect(response.body.meta).toEqual({ page: 3, pageSize: 2, total: 5, totalPages: 3 })
  })

  it('ordena por nome em ordem decrescente', async () => {
    const response = await request(app).get('/users').query({ order: 'desc' })

    expect(response.body.data[0].name).toBe('Eduarda Teste')
  })

  it('trata o % da busca como texto, e não como curinga', async () => {
    const response = await request(app).get('/users').query({ q: '%' })

    expect(response.body.meta.total).toBe(0)
  })

  it('rejeita página inválida', async () => {
    const response = await request(app).get('/users').query({ page: 0 })

    expect(response.status).toBe(400)
  })
})

describe('GET /users/:id', () => {
  it('rejeita identificador inválido', async () => {
    const response = await request(app).get('/users/abc')

    expect(response.status).toBe(400)
  })

  it('retorna 404 para usuário inexistente', async () => {
    const response = await request(app).get('/users/00000000-0000-4000-8000-000000000000')

    expect(response.status).toBe(404)
    expect(response.body.error.code).toBe('USER_NOT_FOUND')
  })
})
