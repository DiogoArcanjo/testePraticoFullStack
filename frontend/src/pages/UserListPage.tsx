import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { listUsers } from '../services/userService'
import type { UserList } from '../services/userService'

const DEBOUNCE_MS = 400
const PAGE_SIZE = 5

type Status = 'loading' | 'success' | 'error'

function UserListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const sort = searchParams.get('sort') === 'desc' ? 'desc' : 'asc'
  const page = Math.max(1, Math.floor(Number(searchParams.get('page'))) || 1)

  const [inputValue, setInputValue] = useState(search)
  const [status, setStatus] = useState<Status>('loading')
  const [result, setResult] = useState<UserList | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

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
          next.delete('page')
          return next
        },
        { replace: true },
      )
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [inputValue, search, setSearchParams])

  useEffect(() => {
    let ignore = false
    setStatus('loading')

    listUsers({ q: search, page, pageSize: PAGE_SIZE, order: sort })
      .then((data) => {
        if (ignore) return
        setResult(data)
        setStatus('success')
      })
      .catch(() => {
        if (!ignore) setStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [search, sort, page, reloadKey])

  function toggleSort() {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('sort', sort === 'asc' ? 'desc' : 'asc')
        next.delete('page')
        return next
      },
      { replace: true },
    )
  }

  function goToPage(newPage: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (newPage === 1) {
        next.delete('page')
      } else {
        next.set('page', String(newPage))
      }
      return next
    })
  }

  const users = result?.data ?? []
  const totalPages = result?.meta.totalPages ?? 1

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

      {status === 'loading' && <p role="status">Carregando usuários...</p>}

      {status === 'error' && (
        <>
          <p role="alert">Não foi possível carregar os usuários.</p>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
            Tentar novamente
          </button>
        </>
      )}

      {status === 'success' && users.length === 0 && (
        <p>Nenhum usuário encontrado.</p>
      )}

      {status === 'success' && users.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th aria-sort={sort === 'asc' ? 'ascending' : 'descending'}>
                  <button type="button" onClick={toggleSort}>
                    Nome {sort === 'asc' ? '▲' : '▼'}
                  </button>
                </th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <nav aria-label="Paginação">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
            >
              Próxima
            </button>
          </nav>
        </>
      )}
    </section>
  )
}

export default UserListPage