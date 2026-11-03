import { useParams } from 'react-router'

function UserDetailsPage() {
  const { id } = useParams()
  return <h1>Detalhes do usuário {id}</h1>
}

export default UserDetailsPage