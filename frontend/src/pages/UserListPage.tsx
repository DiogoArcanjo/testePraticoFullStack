import { Link } from 'react-router'
import { usersMock } from '../mocks/users'

function UserListPage() {
  return (
    <section>
      <h1>Usuários</h1>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {usersMock.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default UserListPage