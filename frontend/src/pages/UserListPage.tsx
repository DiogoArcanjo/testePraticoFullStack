import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { usersMock } from '../mocks/users'

const DEBOUNCE_MS = 400

function UserListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = inputValue.trim()
      if (value === search) return

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (value) {
            next.set('q', value)
          } else {
            next.delete('q')
          }
          return next
        },
        { replace: true },
      )
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [inputValue, search, setSearchParams])

  const term = search.toLowerCase()
  const filteredUsers = usersMock.filter(
    (user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term),
  )

  return (
    <section>
      <h1>Usuários</h1>

      <label htmlFor="search">Buscar por nome ou email</label>
      <input
        id="search"
        type="search"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
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