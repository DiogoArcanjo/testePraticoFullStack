import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { listUsers } from "../services/userService";

const DEBOUNCE_MS = 400;
const PAGE_SIZE = 5;

function UserListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") === "desc" ? "desc" : "asc";

  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = inputValue.trim();
      if (value === search) return;

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) {
            next.set("q", value);
          } else {
            next.delete("q");
          }
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [inputValue, search, setSearchParams]);

  const term = search.toLowerCase();
  const filteredUsers = listUsers().filter(
    (user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term),
  );

  const sortedUsers = [...filteredUsers].sort((a, b) =>
    sort === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name),
  );

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));
  const requestedPage = Math.floor(Number(searchParams.get("page"))) || 1;
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedUsers = sortedUsers.slice(start, start + PAGE_SIZE);

  function toggleSort() {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("sort", sort === "asc" ? "desc" : "asc");
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  }

  function goToPage(page: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (page === 1) {
        next.delete("page");
      } else {
        next.set("page", String(page));
      }
      return next;
    });
  }

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

      {sortedUsers.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th aria-sort={sort === "asc" ? "ascending" : "descending"}>
                  <button type="button" onClick={toggleSort}>
                    Nome {sort === "asc" ? "▲" : "▼"}
                  </button>
                </th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
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
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
            </button>
          </nav>
        </>
      )}
    </section>
  );
}

export default UserListPage;
