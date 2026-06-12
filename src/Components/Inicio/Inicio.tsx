import { Link } from 'react-router-dom';
import {
  Shield,
  Plane,
  HelpCircle,
  Briefcase,
  Map,
  UtensilsCrossed,
  FileText,
  Newspaper,
  Users2,
  Info,
} from 'lucide-react';

import heroBannerImage from '../../assets/heroBannerImage.png';
import './Inicio.css';

export function Home() {
  return (
    <div className="home-container">

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${heroBannerImage})`,
        }}
      >
        <div className="hero-overlay">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="hero-content">
              <h1 className="hero-title">
                Transporte Urbano{' '}
                <span className="hero-highlight">Acessível</span>{' '}
                para Todos
              </h1>
              <p className="hero-description">
                A OpenLine conecta você ao seu destino com respeito,
                dignidade e total acessibilidade.
                Porque mobilidade é um direito de todos.
              </p>
              <div className="hero-buttons">
                <Link to="/passageiro/cadastro" className="btn-primary">
                  Quero ser passageiro
                </Link>
                <Link to="/motorista/cadastro" className="btn-secondary">
                  Quero ser motorista
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Nossos Serviços</h2>
            <p className="section-subtitle">Soluções completas para sua mobilidade e muito mais</p>
          </div>

          <div className="services-grid">
            <Link to="/aeroportos" className="service-card">
              <Plane className="service-icon"/>
              <h3 className="service-title">Aeroportos</h3>
              <p className="service-description">Transporte confiável para todos os principais aeroportos</p>
            </Link>

            <Link to="/ajuda" className="service-card">
              <HelpCircle className="service-icon"/>
              <h3 className="service-title">Central de Ajuda</h3>
              <p className="service-description">Tire suas dúvidas e encontre suporte 24/7</p>
            </Link>

            <Link to="/carreiras" className="service-card">
              <Briefcase className="service-icon"/>
              <h3 className="service-title">Carreiras</h3>
              <p className="service-description">Junte-se à nossa equipe e faça a diferença</p>
            </Link>

            <Link to="/cidades" className="service-card">
              <Map className="service-icon"/>
              <h3 className="service-title">Cidades</h3>
              <p className="service-description">Veja onde a OpenLine está disponível</p>
            </Link>

            <Link to="/comida" className="service-card">
              <UtensilsCrossed className="service-icon"/>
              <h3 className="service-title">OpenLine Eats</h3>
              <p className="service-description">Em breve - entrega de comida acessível</p>
            </Link>

            <Link to="/diretrizes" className="service-card">
              <FileText className="service-icon"/>
              <h3 className="service-title">Diretrizes</h3>
              <p className="service-description">Regras da comunidade para todos</p>
            </Link>

            <Link to="/imprensa" className="service-card">
              <Newspaper className="service-icon"/>
              <h3 className="service-title">Imprensa</h3>
              <p className="service-description">Notícias e recursos para a mídia</p>
            </Link>

            <Link to="/recursos-seguranca" className="service-card">
              <Shield className="service-icon"/>
              <h3 className="service-title">Segurança</h3>
              <p className="service-description">Recursos e ferramentas de segurança</p>
            </Link>

            <Link to="/sobre" className="service-card">
              <Info className="service-icon"/>
              <h3 className="service-title">Sobre Nós</h3>
              <p className="service-description">Conheça nossa história e missão</p>
            </Link>

            <Link to="/diversidade" className="service-card">
              <Users2 className="service-icon"/>
              <h3 className="service-title">Diversidade</h3>
              <p className="service-description">Nosso compromisso com a inclusão</p>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}