import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="main-header">
      <div className="container flex justify-between items-center py-4">
        <div className="logo-area">
          <img
            src="/assets/logo.png"
            alt="Company Logo"
            className="h-12 mr-3"
          />
          <span className="tagline text-xl font-bold">
            Inovação em cada Byte
          </span>
        </div>
        <nav className="main-nav">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/cart" className="nav-link">
                    Solicitações
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="nav-link">
                    Sair ({user})
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="nav-link">
                    Registrar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="main-footer">
      <div className="container text-center py-4">
        &copy; 2025 IT Services Ltda. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
