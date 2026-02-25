import { Link, useLocation } from 'react-router';
import { Menu, X, Accessibility } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/sobre', label: 'Sobre Nós' },
    { path: '/servicos', label: 'Serviços' },
    { path: '/acessibilidade', label: 'Acessibilidade' },
    { path: '/contato', label: 'Contato' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-[#5a34a1] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Accessibility className="size-8" />
            <span className="text-2xl font-bold">OpenLine</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-all ${
                  isActive(link.path)
                    ? 'text-white border-b-2 border-white pb-1'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            <Link
              to="/contato"
              className="bg-white text-[#5a34a1] px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              Solicitar Viagem
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/20">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 transition-colors ${
                  isActive(link.path)
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contato"
              onClick={() => setIsMenuOpen(false)}
              className="block mt-4 mx-4 bg-white text-[#5a34a1] px-6 py-3 rounded-full text-center hover:bg-gray-100 transition-colors"
            >
              Solicitar Viagem
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
