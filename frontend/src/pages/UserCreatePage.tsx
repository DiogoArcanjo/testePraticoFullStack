import { useNavigate } from 'react-router'
import UserForm from '../components/UserForm'
import { createUser } from '../services/userService'
import type { UserInput } from '../services/userService'

function UserCreatePage() {
  const navigate = useNavigate()

  function handleCreate(values: UserInput) {
    const user = createUser(values)
    navigate(`/users/${user.id}`)
  }

  return (
    <section>
      <h1>Novo usuário</h1>
      <UserForm submitLabel="Cadastrar" onSubmit={handleCreate} />
    </section>
  )
}

export default UserCreatePage