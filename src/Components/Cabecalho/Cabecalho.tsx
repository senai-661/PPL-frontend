import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Accessibility as AccessibilityIcon, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggleButton } from '../../app/components/ThemeToggleButton';
import './Cabecalho.css'; // Importa o CSS específico para o cabeçalho

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está autenticado ao carregar e quando a rota muda
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const handleLogout = () => {
    // Remove dados de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    
    // Atualiza estado e redireciona
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/sobre', label: 'Sobre Nós' },
    { path: '/servicos', label: 'Serviços' },
    { path: '/acessibilidade', label: 'Acessibilidade' },
    { path: '/contato', label: 'Contato' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <AccessibilityIcon className="logo-icon" />
            <span className="logo-text">OpenLine</span>
          </Link>

          {/* Desktop Navigation - Oculto quando autenticado */}
          {!isAuthenticated && (
            <nav className="nav-desktop">
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
          )}

          <div className="header-actions">
            <ThemeToggleButton className="header-theme-toggle" />

            {/* CTA Button Desktop */}
            <div className="cta-desktop">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="cta-button flex items-center gap-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 px-3 py-1.5 text-sm"
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-button"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Oculto quando autenticado */}
        {isMenuOpen && !isAuthenticated && (
          <nav className="nav-mobile">
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
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="cta-mobile"
            >
              Entrar
            </Link>
          </nav>
        )}

        {/* Mobile Logout - Mostrado apenas quando autenticado */}
        {isMenuOpen && isAuthenticated && (
          <nav className="nav-mobile">
            <button
              onClick={handleLogout}
              className="cta-mobile flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 px-3 py-1.5 text-sm"
            >
              <LogOut className="size-3" />
              Sair
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
