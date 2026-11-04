import { Link, useNavigate, useParams } from 'react-router'
import UserForm from '../components/UserForm'
import { getUser, updateUser } from '../services/userService'
import type { UserInput } from '../services/userService'

function UserEditPage() {
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

  function handleUpdate(values: UserInput) {
    if (!user) return
    updateUser(user.id, values)
    navigate(`/users/${user.id}`)
  }

  return (
    <section>
      <h1>Editar usuário</h1>
      <UserForm
        initialValues={{ name: user.name, email: user.email }}
        ignoreId={user.id}
        submitLabel="Salvar alterações"
        onSubmit={handleUpdate}
      />
    </section>
  )
}

export default UserEditPage