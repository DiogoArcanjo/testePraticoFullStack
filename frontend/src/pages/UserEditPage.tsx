import { Link, useNavigate, useParams } from 'react-router'
import UserForm from '../components/UserForm'
import { useUser } from '../hooks/useUser'
import { updateUser } from '../services/userService'
import type { UserInput } from '../services/userService'

function UserEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, status } = useUser(id)

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

  async function handleUpdate(values: UserInput) {
    if (!user) return
    await updateUser(user.id, values)
    navigate(`/users/${user.id}`)
  }

  return (
    <section>
      <h1>Editar usuário</h1>
      <UserForm
        initialValues={{ name: user.name, email: user.email }}
        submitLabel="Salvar alterações"
        onSubmit={handleUpdate}
      />
    </section>
  )
}

export default UserEditPage