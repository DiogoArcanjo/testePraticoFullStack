import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../services/api'
import UserForm from './UserForm'

describe('UserForm', () => {
  it('mostra os erros e não envia quando os campos estão vazios', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<UserForm submitLabel="Cadastrar" onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(screen.getByText('Informe o nome.')).toBeInTheDocument()
    expect(screen.getByText('Informe o email.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('envia os dados quando o formulário é válido', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<UserForm submitLabel="Cadastrar" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Ana Souza')
    await user.type(screen.getByLabelText('Email'), 'ana@example.com')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ana Souza', email: 'ana@example.com' })
  })

  it('mostra a mensagem de email duplicado quando a API responde 409', async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(
        new ApiError(409, 'EMAIL_ALREADY_EXISTS', 'Este email já está cadastrado.'),
      )
    const user = userEvent.setup()
    render(<UserForm submitLabel="Cadastrar" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Ana Souza')
    await user.type(screen.getByLabelText('Email'), 'ana@example.com')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('Este email já está cadastrado.')).toBeInTheDocument()
  })
})