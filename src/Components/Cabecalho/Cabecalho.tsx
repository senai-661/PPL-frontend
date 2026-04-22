import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Accessibility as AccessibilityIcon, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggleButton } from '../../app/components/ThemeToggleButton';
import './Cabecalho.css';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  const publicLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/sobre', label: 'Sobre Nos' },
    { path: '/servicos', label: 'Servicos' },
    { path: '/acessibilidade', label: 'Acessibilidade' },
    { path: '/contato', label: 'Contato' },
  ];

  const navLinks = isAuthenticated ? [] : publicLinks;
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            <AccessibilityIcon className="logo-icon" />
            <span className="logo-text">OpenLine</span>
          </Link>

          <nav className="nav-desktop" aria-label="Navegacao principal">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <ThemeToggleButton className="header-theme-toggle" />

            <div className="cta-desktop">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cta-button flex items-center gap-1 bg-red-600 px-3 py-1.5 text-sm hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  <LogOut className="size-3" />
                  Sair
                </button>
              ) : (
                <Link to="/login" className="cta-button">
                  Entrar
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="menu-button"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="nav-mobile" aria-label="Navegacao mobile">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`nav-mobile-link ${isActive(link.path) ? 'nav-mobile-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="cta-mobile flex items-center justify-center gap-2 bg-red-600 px-3 py-1.5 text-sm hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                <LogOut className="size-3" />
                Sair
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="cta-mobile">
                Entrar
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
