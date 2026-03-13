import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import './Rodape.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Sobre */}
          <div>
            <h3 className="footer-title">OpenLine</h3>
            <p className="footer-text">
              Transporte urbano acessível e inclusivo para todos. Conectando pessoas com mobilidade e respeito.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="footer-title">Links Rápidos</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="footer-link">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="footer-link">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/acessibilidade" className="footer-link">
                  Acessibilidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="footer-title">Contato</h3>
            <ul className="footer-contact">
              <li className="footer-contact-item">
                <Phone className="footer-icon" />
                <span>(11) 0800-123-4567</span>
              </li>
              <li className="footer-contact-item">
                <Mail className="footer-icon" />
                <span>contato@openline.com.br</span>
              </li>
              <li className="footer-contact-item">
                <MapPin className="footer-icon" />
                <span>São Paulo, Brasil</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="footer-title">Siga-nos</h3>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <Facebook className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <Instagram className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter className="social-icon" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 OpenLine. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
