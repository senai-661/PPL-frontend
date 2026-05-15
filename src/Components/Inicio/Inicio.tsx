import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, HelpCircle, Briefcase, Map, UtensilsCrossed, Clipboard, Newspaper, Shield, Info, Users, MapPin, Clock3, Circle, Square, ArrowRight } from 'lucide-react';
import heroBannerImage from '../../assets/heroBannerImage.png';
import './Inicio.css';

export default function Inicio() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [travelTime, setTravelTime] = useState('Agora');

  const goToNewTrip = () => {
    navigate('/viagem/nova', { state: { pickup, dropoff, travelTime } });
  };

  const handleUseCurrentLocation = () => {
    setDropoff('Minha localização');
  };

  const handleCityChange = () => {
    navigate('/cidades');
  };

  return (
    <div className="home-container">
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroBannerImage})` }}
      >
        <div className="hero-overlay">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="hero-content">
              <h1 className="hero-title">
                Transporte Urbano <span className="hero-highlight">Acessível</span> para Todos
              </h1>

              <p className="hero-description">
                A OpenLine conecta você ao seu destino com respeito, dignidade e total acessibilidade.
                Porque mobilidade é um direito de todos.
              </p>

              <div className="hero-buttons">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => navigate('/passageiro/cadastro')}
                >
                  Quero ser passageiro
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate('/motorista/cadastro')}
                >
                  Quero ser motorista
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="uber-booking-card">
            <div className="location-row">
              <MapPin className="location-icon" />
              <span className="localizacao">São Carlos, BR</span>
              <a className="change-city" href="#">Alterar cidade</a>
            </div>

            <h3 className="uber-title">
              Vá a qualquer lugar
              <br />
              com o app da OpenLine
            </h3>

            <div className="uber-options">
              <button type="button" className="btn-agora" onClick={goToNewTrip}>
                <Clock3 className="ago-icon" />
                {travelTime}
                <span className="caret">▾</span>
              </button>
            </div>

            <div className="inputs-corrida">
              <label className="input-with-icon">
                <Circle className="left-icon" />
                <input
                  type="text"
                  placeholder="Local de partida"
                  value={pickup}
                  onChange={(event) => setPickup(event.target.value)}
                />
              </label>
              <label className="input-with-icon">
                <Square className="left-icon" />
                <input
                  type="text"
                  placeholder="Local de chegada"
                  value={dropoff}
                  onChange={(event) => setDropoff(event.target.value)}
                />
                <button
                  type="button"
                  className="input-action"
                  aria-label="usar local"
                  onClick={handleUseCurrentLocation}
                >
                  <ArrowRight />
                </button>
              </label>
            </div>

            <div className="acoes-corrida">
              <button type="button" className="btn-ver-precos" onClick={goToNewTrip}>Ver preços</button>
              <button type="button" className="change-city" onClick={handleCityChange}>Alterar cidade</button>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="section-title">Nossos Serviços</h2>
            <p className="section-subtitle">Soluções completas para sua mobilidade e muito mais</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <Plane className="feature-icon" />
              <h3 className="feature-title">Aeroportos</h3>
              <p className="feature-description">Transporte confiável para todos os principais aeroportos.</p>
            </div>

            <div className="feature-card">
              <HelpCircle className="feature-icon" />
              <h3 className="feature-title">Central de Ajuda</h3>
              <p className="feature-description">Tire suas dúvidas e encontre suporte 24/7.</p>
            </div>

            <div className="feature-card">
              <Briefcase className="feature-icon" />
              <h3 className="feature-title">Carreiras</h3>
              <p className="feature-description">Junte-se à nossa equipe e faça a diferença.</p>
            </div>

            <div className="feature-card">
              <Map className="feature-icon" />
              <h3 className="feature-title">Cidades</h3>
              <p className="feature-description">Veja onde a OpenLine está disponível.</p>
            </div>

            <div className="feature-card">
              <UtensilsCrossed className="feature-icon" />
              <h3 className="feature-title">OpenLine Eats</h3>
              <p className="feature-description">Em breve: entrega de comida acessível.</p>
            </div>

            <div className="feature-card">
              <Clipboard className="feature-icon" />
              <h3 className="feature-title">Diretrizes</h3>
              <p className="feature-description">Regras da comunidade para todos.</p>
            </div>

            <div className="feature-card">
              <Newspaper className="feature-icon" />
              <h3 className="feature-title">Imprensa</h3>
              <p className="feature-description">Notícias e recursos para a mídia.</p>
            </div>

            <div className="feature-card">
              <Shield className="feature-icon" />
              <h3 className="feature-title">Segurança</h3>
              <p className="feature-description">Recursos e ferramentas de segurança.</p>
            </div>

            <div className="feature-card">
              <Info className="feature-icon" />
              <h3 className="feature-title">Sobre Nós</h3>
              <p className="feature-description">Conheça nossa história e missão.</p>
            </div>

            <div className="feature-card">
              <Users className="feature-icon" />
              <h3 className="feature-title">Diversidade</h3>
              <p className="feature-description">Nosso compromisso com a inclusão.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="cta-title">Pronto para viajar com conforto e dignidade?</h2>
          <p className="cta-description">Baixe nosso app ou entre em contato para solicitar sua primeira viagem</p>
          <button
            type="button"
            className="cta-button"
            onClick={() => navigate('/viagem/nova')}
          >
            Começar Agora
          </button>
        </div>
      </section>
    </div>
  );
}
