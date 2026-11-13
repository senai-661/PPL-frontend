import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Accessibility as AccessibilityIcon, Menu } from 'lucide-react';
import { ThemeToggleButton } from '../Elementos/ThemeToggleButton';
import { HeaderAccountMenu } from './HeaderAccountMenu';
import { SERVER_CFG } from '../../appConfig';
import './Cabecalho.css';

type AuthenticatedUserType = 'passenger' | 'driver' | 'admin';

type StoredUser = {
  nome?: string;
  sobrenome?: string;
  email?: string;
  usuario?: {
    email?: string;
  };
};

const profilePathByUserType: Record<AuthenticatedUserType, string> = {
  passenger: '/passageiro/perfil',
  driver: '/motorista/perfil',
  admin: '/administrador/painel',
};

const dashboardPathByUserType: Record<AuthenticatedUserType, string> = {
  passenger: '/passageiro/painel',
  driver: '/motorista/painel',
  admin: '/administrador/painel',
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<AuthenticatedUserType | null>(null);
  const [userData, setUserData] = useState<StoredUser | null>(null);
  const [storedEmail, setStoredEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType') as AuthenticatedUserType | null;
    const storedUser = localStorage.getItem('user');
    const userEmail = localStorage.getItem('userEmail') ?? '';

    setIsAuthenticated(!!token);
    setUserType(storedUserType);
    setStoredEmail(userEmail);

    if (!storedUser) {
      setUserData(null);
      return;
    }

    try {
      setUserData(JSON.parse(storedUser) as StoredUser);
    } catch {
      setUserData(null);
    }
  }, [location]);

  useEffect(() => {
    async function hydrateUserProfile() {
      const token = localStorage.getItem('token');

      if (!token || !userType || userData?.email?.trim() || storedEmail.trim()) {
        return;
      }

      if (userType !== 'passenger' && userType !== 'driver') {
        return;
      }

      const endpoint =
        userType === 'passenger'
          ? `${SERVER_CFG.SERVER_URL}/api/passageiro/perfil`
          : `${SERVER_CFG.SERVER_URL}/api/motorista/perfil`;

      try {
        const response = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const profile = await response.json();
        const normalizedProfile = {
          ...userData,
          ...profile,
        };

        setUserData(normalizedProfile);

        if (profile?.email) {
          setStoredEmail(profile.email);
          localStorage.setItem('userEmail', profile.email);
        }

        localStorage.setItem('user', JSON.stringify(normalizedProfile));
      } catch {
        // Silently ignore header hydration failures.
      }
    }

    hydrateUserProfile();
  }, [storedEmail, userData, userType]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserType(null);
    setUserData(null);
    setStoredEmail('');
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
  const profilePath = userType ? profilePathByUserType[userType] : null;
  const logoPath = userType ? dashboardPathByUserType[userType] : '/';
  const displayName =
    [userData?.nome, userData?.sobrenome].filter(Boolean).join(' ').trim() || 'Usuario OpenLine';
  const displayEmail =
    userData?.email?.trim() ||
    userData?.usuario?.email?.trim() ||
    storedEmail.trim() ||
    'Email nao informado';
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-leading">
            <Link to={logoPath} className="logo" onClick={() => setIsMenuOpen(false)}>
              <AccessibilityIcon className="logo-icon" />
              <span className="logo-text">OpenLine</span>
            </Link>
          </div>

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

            {!isAuthenticated && (
              <div className="cta-desktop">
                <Link to="/login" className="cta-button">
                  Entrar
                </Link>
              </div>
            )}

            {isAuthenticated && userType && (
              <HeaderAccountMenu
                displayName={displayName}
                displayEmail={displayEmail}
                homePath={logoPath}
                profilePath={profilePath}
                userType={userType}
                onLogout={handleLogout}
              />
            )}

            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="menu-button"
                aria-label={isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                aria-expanded={isMenuOpen}
              >
                <Menu className="menu-button-icon" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {isMenuOpen && !isAuthenticated && (
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

            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="cta-mobile">
              Entrar
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
