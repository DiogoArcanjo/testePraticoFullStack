import { Routes, Route, NavLink, Navigate } from "react-router";
import UserListPage from "./pages/UserListPage";
import UserCreatePage from "./pages/UserCreatePage";
import UserDetailsPage from "./pages/UserDetailsPage";
import UserEditPage from "./pages/UserEditPage";
import WeatherPage from "./pages/WeatherPage";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <>
      <nav aria-label="Principal">
        <NavLink to="/users" end>
          Usuários
        </NavLink>
        <NavLink to="/users/new">Novo usuário</NavLink>
        <NavLink to="/weather">Clima</NavLink>
        <ThemeToggle />
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
  );
}

export default App;
