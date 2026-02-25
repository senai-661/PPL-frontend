import { Link } from 'react-router';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg mb-4">OpenLine</h3>
            <p className="text-gray-400 text-sm">
              Transporte urbano acessível e inclusivo para todos. Conectando pessoas com mobilidade e respeito.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/acessibilidade" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Acessibilidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="size-4" />
                <span>(11) 0800-123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="size-4" />
                <span>contato@openline.com.br</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="size-4" />
                <span>São Paulo, Brasil</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-lg mb-4">Siga-nos</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-[#5a34a1] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-[#5a34a1] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-[#5a34a1] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 OpenLine. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
