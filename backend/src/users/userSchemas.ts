import { z } from 'zod'

const nameSchema = z
  .string({ message: 'O nome é obrigatório.' })
  .trim()
  .min(1, 'O nome é obrigatório.')
  .max(120, 'O nome pode ter no máximo 120 caracteres.')

const emailSchema = z
  .string({ message: 'O email é obrigatório.' })
  .trim()
  .toLowerCase()
  .email('Informe um email válido.')
  .max(254, 'O email pode ter no máximo 254 caracteres.')

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
})

export const updateUserSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: 'Informe ao menos um campo para atualizar.',
  })

export const userIdSchema = z.string().uuid('Identificador inválido.')

export const listUsersQuerySchema = z.object({
  q: z.string().trim().max(100).default(''),
  page: z.coerce.number().int().min(1, 'A página deve ser 1 ou maior.').default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1, 'O tamanho da página deve ser 1 ou maior.')
    .max(100, 'O tamanho máximo da página é 100.')
    .default(10),
  order: z.enum(['asc', 'desc']).default('asc'),
})