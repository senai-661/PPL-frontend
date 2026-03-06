import { Car, ShieldCheck, User, Users } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';

const footerLinks = [
  { to: '/administrador/tabela-motoristas', label: 'Motoristas', icon: User },
  { to: '/administrador/tabela-passageiros', label: 'Passageiros', icon: Users },
  { to: '/administrador/tabela-carros', label: 'Carros', icon: Car },
];

const sectionTitles: Record<string, string> = {
  '/administrador': 'Painel Administrativo',
  '/administrador/painel': 'Painel Administrativo',
  '/administrador/tabela-motoristas': 'Tabela de Motoristas',
  '/administrador/tabela-passageiros': 'Tabela de Passageiros',
  '/administrador/tabela-carros': 'Tabela de Carros',
};

export function AdminLayout() {
  const location = useLocation();
  const currentSection = sectionTitles[location.pathname] ?? 'Administracao';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-8" />
            <div>
              <p className="text-white/80 text-sm">Area Administrativa OpenLine</p>
              <h1 className="text-2xl sm:text-3xl">{currentSection}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      <footer className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-gray-200">
        <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8" aria-label="Navegacao das tabelas do administrador">
          <ul className="grid grid-cols-3">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      'w-full py-3 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-colors',
                      isActive ? 'text-[#5a34a1] font-semibold' : 'text-gray-600 hover:text-[#5a34a1]',
                    ].join(' ')
                  }
                >
                  <link.icon className="size-4" />
                  <span>{link.label}</span>
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
