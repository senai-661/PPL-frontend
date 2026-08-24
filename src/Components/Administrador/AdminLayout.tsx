import { useCallback, useMemo } from 'react';
import { Car, Home, LogOut, ShieldCheck, User, Users } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggleButton } from '../../Components/Elementos/ThemeToggleButton';

type FooterLink = {
  to: string;
  label: string;
  icon: React.ElementType;
};

const FOOTER_LINKS: FooterLink[] = [
  { to: '/administrador/tabela-motoristas', label: 'Motoristas', icon: User },
  { to: '/administrador/tabela-passageiros', label: 'Passageiros', icon: Users },
  { to: '/administrador/tabela-carros', label: 'Carros', icon: Car },
];

const SECTION_TITLES = new Map<string, string>([
  ['/administrador', 'Painel Administrativo'],
  ['/administrador/painel', 'Painel Administrativo'],
  ['/administrador/tabela-motoristas', 'Tabela de Motoristas'],
  ['/administrador/tabela-passageiros', 'Tabela de Passageiros'],
  ['/administrador/tabela-carros', 'Tabela de Carros'],
]);

function getSectionTitle(pathname: string): string {
  if (SECTION_TITLES.has(pathname)) return SECTION_TITLES.get(pathname)!;
  if (pathname.startsWith('/administrador/tabela-carros/')) return 'Detalhes do Carro';
  if (pathname.startsWith('/administrador/tabela-motoristas/')) return 'Detalhes do Motorista';
  if (pathname.startsWith('/administrador/tabela-passageiros/')) return 'Detalhes do Passageiro';
  return 'Administração';
}

export function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const currentSection = useMemo(() => getSectionTitle(pathname), [pathname]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors">
      <header
        role="banner"
        className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white shadow dark:from-slate-900 dark:to-indigo-950/95"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-8" aria-hidden="true" />
              <div>
                <p className="text-white/80 text-sm">Área Administrativa OpenLine</p>
                <h1 className="text-2xl sm:text-3xl">{currentSection}</h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <NavLink
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              >
                <Home className="size-4" aria-hidden="true" />
                Página inicial
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sair
              </button>

              <ThemeToggleButton className="shrink-0" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      <footer
        role="navigation"
        aria-label="Navegação das tabelas do administrador"
        className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-gray-200 dark:border-slate-700"
      >
        <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-3">
            {FOOTER_LINKS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    [
                      'w-full py-3 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-colors',
                      isActive
                        ? 'text-[#5a34a1] dark:text-indigo-300 font-semibold'
                        : 'text-gray-600 dark:text-slate-300',
                    ].join(' ')
                  }
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </footer>
    </div>
  );
}

export default AdminLayout;