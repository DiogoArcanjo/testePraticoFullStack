import { Routes, Route, Link, Navigate } from 'react-router'
import UserListPage from './pages/UserListPage'
import UserCreatePage from './pages/UserCreatePage'
import UserDetailsPage from './pages/UserDetailsPage'
import UserEditPage from './pages/UserEditPage'
import WeatherPage from './pages/WeatherPage'

function App() {
  return (
    <>
      <nav>
        <Link to="/users">Usuários</Link> |{' '}
        <Link to="/users/new">Novo usuário</Link> |{' '}
        <Link to="/weather">Clima</Link>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/new" element={<UserCreatePage />} />
          <Route path="/users/:id" element={<UserDetailsPage />} />
          <Route path="/users/:id/edit" element={<UserEditPage />} />
          <Route path="/weather" element={<WeatherPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App