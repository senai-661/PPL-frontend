import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Accessibility as AccessibilityIcon, LogOut, Menu, UserCircle2, X } from 'lucide-react';
import { ThemeToggleButton } from '../../app/components/ThemeToggleButton';
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
          <Link to={logoPath} className="logo" onClick={() => setIsMenuOpen(false)}>
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

            {isAuthenticated && profilePath && (
              <div className="profile-menu">
                <Link
                  to={profilePath}
                  className="profile-button"
                  aria-label="Abrir perfil da conta"
                >
                  <UserCircle2 className="size-6" />
                </Link>

                <Link to={profilePath} className="profile-card">
                  <span className="profile-card-label">CONTA OPENLINE</span>
                  <strong className="profile-card-name">{displayName}</strong>
                  <span className="profile-card-email">{displayEmail}</span>
                </Link>
              </div>
            )}

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
              <>
                {profilePath && (
                  <Link
                    to={profilePath}
                    onClick={() => setIsMenuOpen(false)}
                    className="nav-mobile-link nav-mobile-button"
                  >
                    Minha conta
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cta-mobile flex items-center justify-center gap-2 bg-red-600 px-3 py-1.5 text-sm hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  <LogOut className="size-3" />
                  Sair
                </button>
              </>
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
