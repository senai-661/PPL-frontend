import {
  Bell,
  Accessibility,
  CalendarDays,
  Database,
  History,
  House,
  LogOut,
  MapPinned,
  Menu,
  SlidersHorizontal,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type AccountUserType = 'passenger' | 'driver' | 'admin';

type HeaderAccountMenuProps = {
  displayName: string;
  displayEmail?: string;
  homePath: string;
  profilePath?: string | null;
  userType: AccountUserType;
  onLogout: () => void;
};

export function HeaderAccountMenu({
  displayName,
  displayEmail,
  homePath,
  profilePath,
  userType,
  onLogout,
}: HeaderAccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const accountLinks = [
    { label: 'Acessibilidade', to: '/configuracoes-acessibilidade', icon: Accessibility },
    ...(profilePath ? [{ label: 'Dados pessoais', to: profilePath, icon: UserRound }] : []),
    ...(userType !== 'admin'
      ? [{ label: 'Configurações do painel', to: `/${userType === 'driver' ? 'motorista' : 'passageiro'}/configuracoes-painel`, icon: SlidersHorizontal }]
      : []),
    ...(userType === 'passenger'
      ? [
          { label: 'Escolher atalhos', to: '/passageiro/atalhos', icon: MapPinned },
          { label: 'Histórico de viagens', to: '/passageiro/historico', icon: History },
          { label: 'Notificações', to: '/passageiro/notificacoes', icon: Bell },
        ]
      : userType === 'driver'
        ? [{ label: 'Corridas agendadas', to: '/motorista/corridas-agendadas', icon: CalendarDays }]
        : []),
    { label: 'Segurança', to: '/recursos-seguranca', icon: ShieldCheck },
    { label: 'Privacidade e dados', to: '/privacidade-dados', icon: Database },
  ];

  return (
    <div className="account-menu" ref={menuRef}>
      <button
        type="button"
        className="account-menu-trigger"
        aria-label="Abrir menu da conta"
        aria-controls="header-account-menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Menu className="account-menu-trigger-icon" aria-hidden="true" />
      </button>

      {isOpen && (
        <nav className="account-menu-panel" id="header-account-menu" aria-label="Opções da conta">
          <div className="account-menu-identity">
            <span className="account-menu-avatar" aria-hidden="true">
              <UserRound className="size-5" />
            </span>
            <span className="account-menu-user">
              <strong>{displayName}</strong>
              {displayEmail && <span>{displayEmail}</span>}
            </span>
          </div>

          <Link
            to={homePath}
            className="account-menu-item"
            onClick={() => setIsOpen(false)}
          >
            <House className="size-[18px]" aria-hidden="true" />
            <span>Página inicial</span>
          </Link>

          <div className="account-menu-divider" />

          {accountLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="account-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}

          <div className="account-menu-divider" />

          <button
            type="button"
            className="account-menu-logout"
            onClick={onLogout}
          >
            <LogOut className="size-[18px]" aria-hidden="true" />
            <span>Sair da conta</span>
          </button>
        </nav>
      )}
    </div>
  );
}
