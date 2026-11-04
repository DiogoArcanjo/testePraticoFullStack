import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useUser } from '../hooks/useUser'
import { deleteUser } from '../services/userService'

function UserDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, status } = useUser(id)
  const [deleteError, setDeleteError] = useState('')

  if (status === 'loading') {
    return (
      <section>
        <p role="status">Carregando usuário...</p>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section>
        <h1>Erro ao carregar</h1>
        <p role="alert">Não foi possível carregar o usuário. Tente novamente.</p>
        <Link to="/users">Voltar para a lista</Link>
      </section>
    )
  }

  if (!user) {
    return (
      <section>
        <h1>Usuário não encontrado</h1>
        <Link to="/users">Voltar para a lista</Link>
      </section>
    )
  }

  async function handleDelete() {
    if (!user) return

    const confirmed = window.confirm(
      `Excluir ${user.name}? Essa ação não pode ser desfeita.`,
    )
    if (!confirmed) return

    try {
      await deleteUser(user.id)
      navigate('/users')
    } catch {
      setDeleteError('Não foi possível excluir o usuário. Tente novamente.')
    }
  }

  return (
    <section>
      <h1>{user.name}</h1>

      <dl>
        <dt>Email</dt>
        <dd>{user.email}</dd>

        <dt>Cadastrado em</dt>
        <dd>{new Date(user.createdAt).toLocaleString('pt-BR')}</dd>

        <dt>Atualizado em</dt>
        <dd>{new Date(user.updatedAt).toLocaleString('pt-BR')}</dd>
      </dl>

      <div>
        <Link to={`/users/${user.id}/edit`}>Editar</Link>
        <button type="button" onClick={handleDelete}>
          Excluir
        </button>
      </div>

      {deleteError && <p role="alert">{deleteError}</p>}

      <Link to="/users">Voltar para a lista</Link>
    </section>
  )
}

export default UserDetailsPage