import type { ChangeEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { usersMock } from '../mocks/users'

function UserListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''

  const term = search.toLowerCase()
  const filteredUsers = usersMock.filter(
    (user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term),
  )

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    if (value) {
      setSearchParams({ q: value }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  return (
    <section>
      <h1>Usuários</h1>

      <label htmlFor="search">Buscar por nome ou email</label>
      <input
        id="search"
        type="search"
        value={search}
        onChange={handleSearchChange}
      />

      {filteredUsers.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default UserListPage