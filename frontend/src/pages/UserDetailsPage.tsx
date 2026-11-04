import { Link, useNavigate, useParams } from 'react-router'
import { deleteUser, getUser } from '../services/userService'

function UserDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = id ? getUser(id) : undefined

  if (!user) {
    return (
      <section>
        <h1>Usuário não encontrado</h1>
        <Link to="/users">Voltar para a lista</Link>
      </section>
    )
  }

  function handleDelete() {
    if (!user) return

    const confirmed = window.confirm(
      `Excluir ${user.name}? Essa ação não pode ser desfeita.`,
    )
    if (!confirmed) return

    deleteUser(user.id)
    navigate('/users')
  }

  return (
    <section>
      <h1>{user.name}</h1>

      <dl>
        <dt>Email</dt>
        <dd>{user.email}</dd>

        <dt>Cadastrado em</dt>
        <dd>{new Date(user.createdAt).toLocaleString('pt-BR')}</dd>
      </dl>

      <div>
        <Link to={`/users/${user.id}/edit`}>Editar</Link>
        <button type="button" onClick={handleDelete}>
          Excluir
        </button>
      </div>

      <Link to="/users">Voltar para a lista</Link>
    </section>
  )
}

export default UserDetailsPage