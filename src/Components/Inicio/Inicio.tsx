import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, HelpCircle, Briefcase, Map, UtensilsCrossed, Clipboard, Newspaper, Shield, Info, Users, MapPin, Clock3, Calendar, Circle, Square, ArrowRight } from 'lucide-react';
import heroBannerImage from '../../assets/heroBannerImage.png';
import './Inicio.css';
import { SERVER_CFG } from '../../appConfig';
import { useToast } from '../../hooks/useToast';
import MapRequests from '../../fetch/MapRequest';

export default function Inicio() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [travelTime, setTravelTime] = useState('Agora');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimatedDuration, setEstimatedDuration] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleToggleSchedule = () => {
    const nextScheduling = !isScheduling;
    setIsScheduling(nextScheduling);
    setTravelTime(nextScheduling ? 'Agendar' : 'Agora');
  };

  const normalizeAddressForCity = (address: string) => {
    const normalized = address.trim();
    if (!normalized) {
      return normalized;
    }

    const lower = normalized.toLowerCase();
    if (lower.includes('minha localização') || lower.includes('minha localização')) {
      return normalized;
    }

    const cityLabel = city.replace(/,\s*br$/i, '').trim();
    if (normalized.toLowerCase().includes(cityLabel.toLowerCase())) {
      return normalized;
    }

    return `${normalized}, ${city}`;
  };

  const getCurrentLocationCoordinates = async (): Promise<{ lat: number; lng: number } | null> => {
    if (!navigator.geolocation) {
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    });
  };

  const resolveAddressToCoords = async (address: string) => {
    const normalized = normalizeAddressForCity(address);
    const lower = normalized.toLowerCase();

    if (lower.includes('minha localização')) {
      return await getCurrentLocationCoordinates();
    }

    const primaryResult = await MapRequests.geocodeAddress(normalized);
    if (primaryResult) {
      return primaryResult;
    }

    // Fallback sem filtrar por cidade para endereços mais vagos
    return await MapRequests.geocodeAddress(address);
  };

  const handleEstimatePrice = async () => {
    if (!pickup || !dropoff) {
      error('Preencha origem e destino antes de ver os preços.');
      return;
    }

    setSubmitting(true);
    try {
      const [originCoord, destinationCoord] = await Promise.all([
        resolveAddressToCoords(pickup),
        resolveAddressToCoords(dropoff),
      ]);

      if (!originCoord || !destinationCoord) {
        throw new Error('Não foi possível localizar os endereços para calcular o preço. Verifique se digitou um endereço válido ou, ao usar "Minha localização", permita o acesso à sua localização.');
      }

      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/preco-estimado`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latOrigem: originCoord.lat,
          lngOrigem: originCoord.lng,
          latDestino: destinationCoord.lat,
          lngDestino: destinationCoord.lng,
          tipoCorrida: 'NORMAL',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.mensagem || 'Erro ao calcular o preço.');
      }

      setEstimatedPrice(data.preco ?? null);
      setEstimatedDuration(data.duracaoEstimadaMin ? `${data.duracaoEstimadaMin} min` : null);
      success('Preço estimado carregado.');
    } catch (err: any) {
      console.error(err);
      error(err?.message || 'Não foi possível calcular o preço.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRide = async () => {
    if (!pickup || !dropoff) {
      error('Preencha origem e destino antes de enviar.');
      return;
    }

    if (isScheduling && (!scheduleDate || !scheduleTime)) {
      error('Escolha data e horário para agendar sua viagem.');
      return;
    }

    setSubmitting(true);
    const isScheduled = isScheduling && scheduleDate && scheduleTime;
    const payload = {
      idPassageiro: 1,
      origemCorrida: pickup,
      destinoCorrida: dropoff,
      tipoCorrida: isScheduled ? 'AGENDADA' : 'NORMAL',
      dataAgendada: isScheduled ? `${scheduleDate}T${scheduleTime}:00` : null,
      statusAgendamento: isScheduled ? 'PENDENTE' : null,
      preco: 28,
    };
    try {
      const endpoint = isScheduled
        ? `${SERVER_CFG.SERVER_URL}/api/corridas-agendadas`
        : `${SERVER_CFG.SERVER_URL}/api/corridas`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error('Resposta do servidor não é JSON: ' + (text.slice(0, 200) || ''));
      }

      if (!response.ok) {
        throw new Error(data?.mensagem || 'Erro ao enviar a viagem.');
      }

      success(isScheduled ? 'Viagem agendada com sucesso!' : 'Viagem solicitada com sucesso!');
      setPickup('');
      setDropoff('');
      setScheduleDate('');
      setScheduleTime('');
      setIsScheduling(false);
      setTravelTime('Agora');
      setEstimatedPrice(null);
      setEstimatedDuration(null);
    } catch (err: any) {
      console.error(err);
      error(err?.message || 'Erro ao enviar a viagem');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setDropoff('Minha localização');
  };

  const handleCityChange = () => {
    // navigate('/cidades');
    setEditingCity(true);
  };

  const [city, setCity] = useState('São Carlos, BR');
  const [editingCity, setEditingCity] = useState(false);

  const availableCities = ['São Carlos, BR', 'Campinas, BR', 'Ribeirão Preto, BR', 'Araraquara, BR'];

  const handleSaveCity = (newCity?: string) => {
    if (newCity) setCity(newCity);
    setEditingCity(false);
  };

  const handleCancelCity = () => {
    setEditingCity(false);
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
              {!editingCity ? (
                <>
                  <span className="localizacao">{city}</span>
                  <button type="button" className="change-city" onClick={handleCityChange}>Alterar cidade</button>
                </>
              ) : (
                <div className="city-edit">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="city-select"
                  >
                    {availableCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button type="button" className="btn-save" onClick={() => handleSaveCity(city)}>Salvar</button>
                  <button type="button" className="btn-cancel" onClick={handleCancelCity}>Cancelar</button>
                </div>
              )}
            </div>

            <h3 className="uber-title">
              Vá a qualquer lugar
              <br />
              com o app da OpenLine
            </h3>

            <div className="uber-options">
              <button type="button" className="btn-agora" onClick={handleToggleSchedule}>
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
            {isScheduling && (
              <div className="schedule-row">
                <label className="input-with-icon">
                  <Calendar className="left-icon" />
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(event) => setScheduleDate(event.target.value)}
                  />
                </label>
                <label className="input-with-icon">
                  <Clock3 className="left-icon" />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(event) => setScheduleTime(event.target.value)}
                  />
                </label>
              </div>
            )}

            {estimatedPrice !== null && (
              <div className="price-summary">
                <span className="price-label">Preço estimado:</span>
                <span className="price-value">R$ {estimatedPrice.toFixed(2)}</span>
                {estimatedDuration && <span className="price-duration">• {estimatedDuration}</span>}
              </div>
            )}

            <div className="acoes-corrida">
              <button
                type="button"
                className="btn-ver-precos"
                onClick={handleEstimatePrice}
                disabled={submitting}
              >
                {submitting ? 'Calculando...' : 'Ver preços'}
              </button>

              <button
                type="button"
                className="btn-submit-ride"
                onClick={handleSubmitRide}
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : isScheduling ? 'Agendar corrida' : 'Solicitar agora'}
              </button>

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
