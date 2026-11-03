import { useParams } from 'react-router'

function UserEditPage() {
  const { id } = useParams()
  return <h1>Editar usuário {id}</h1>
}

export default UserEditPage