import React, { useState, useEffect } from 'react';
import ToastNotification from '../../Components/Elementos/ToastNotification';

interface Trip {
  id: number;
  origin: string;
  destination: string;
  price: string;
  date: string;
  type: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const cidadesDisponiveis = [
  'São Paulo, BR', 'Rio de Janeiro, BR', 'Belo Horizonte, BR', 'Brasília, BR',
  'Curitiba, BR', 'Porto Alegre, BR', 'Salvador, BR', 'Recife, BR',
  'Fortaleza, BR', 'São Carlos, BR', 'Campinas, BR', 'Santos, BR',
];

const SecaoCorrida: React.FC = () => {
  const [currentCity, setCurrentCity] = useState('São Carlos, BR');
  const [showCityModal, setShowCityModal] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showPrice, setShowPrice] = useState(false);
  const [price, setPrice] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [loginError, setLoginError] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`openline_trips_${currentUser}`);
      if (saved) setRecentTrips(JSON.parse(saved));
    }
  }, [currentUser]);

  const saveTrip = (originTrip: string, destinationTrip: string, priceTrip: string) => {
    if (!isLoggedIn || !currentUser) return;
    const newTrip: Trip = {
      id: Date.now(), origin: originTrip, destination: destinationTrip,
      price: priceTrip, date: new Date().toLocaleString('pt-BR'), type: 'now',
    };
    const updatedTrips = [newTrip, ...recentTrips].slice(0, 10);
    setRecentTrips(updatedTrips);
    localStorage.setItem(`openline_trips_${currentUser}`, JSON.stringify(updatedTrips));
  };

  const calculatePrice = () => {
    const basePrice = 4.5;
    const distance = (Math.abs(origin.length - destination.length) + Math.random() * 8);
    return `R$ ${(basePrice + distance * 1.2).toFixed(2).replace('.', ',')}`;
  };

  const checkPrice = () => {
    if (!origin.trim()) return showToast('Informe o local de partida', 'warning');
    if (!destination.trim()) return showToast('Informe o local de chegada', 'warning');
    if (origin.toLowerCase() === destination.toLowerCase()) return showToast('Origem e destino não podem ser iguais', 'warning');
    const calculatedPrice = calculatePrice();
    setPrice(calculatedPrice);
    setShowPrice(true);
    if (isLoggedIn) saveTrip(origin, destination, calculatedPrice);
    showToast('Preço calculado com sucesso!', 'success');
  };

  const handleSchedule = () => {
    if (!origin.trim()) return showToast('Informe o local de partida', 'warning');
    if (!destination.trim()) return showToast('Informe o local de chegada', 'warning');
    if (origin.toLowerCase() === destination.toLowerCase()) return showToast('Origem e destino não podem ser iguais', 'warning');
    if (!showPrice) { setPrice(calculatePrice()); setShowPrice(true); }
    setShowScheduleModal(true);
  };

  const confirmSchedule = () => {
    if (!scheduleDate) return showToast('Selecione uma data', 'warning');
    if (!scheduleTime) return showToast('Selecione um horário', 'warning');
    
    const novoAgendamento = {
      id: Date.now(),
      origin: origin,
      destination: destination,
      date: scheduleDate,
      time: scheduleTime,
      price: price,
      status: 'agendado',
      createdAt: new Date().toISOString(),
    };

    const saved = localStorage.getItem('openline_agendamentos');
    const agendamentos = saved ? JSON.parse(saved) : [];
    agendamentos.push(novoAgendamento);
    localStorage.setItem('openline_agendamentos', JSON.stringify(agendamentos));
    
    setShowScheduleModal(false);
    setScheduleDate('');
    setScheduleTime('');
    showToast('🎉 Viagem agendada com sucesso! Você receberá uma notificação em breve.', 'success');
  };

  const handleLogin = () => {
    setLoginError('');
    if (!loginUsername.trim()) return setLoginError('Digite seu usuário');
    if (!loginPassword.trim()) return setLoginError('Digite sua senha');
    setIsLoggedIn(true);
    setCurrentUser(loginUsername);
    setShowLoginModal(false);
    setLoginUsername('');
    setLoginPassword('');
    showToast(`Bem-vindo, ${loginUsername}!`, 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setRecentTrips([]);
    setShowRecent(false);
    showToast('Você saiu da sua conta', 'info');
  };

  const selectCity = (city: string) => {
    setCurrentCity(city);
    setShowCityModal(false);
    setSearchCity('');
    showToast(`Cidade alterada para ${city}`, 'info');
  };

  const filteredCities = cidadesDisponiveis.filter(city =>
    city.toLowerCase().includes(searchCity.toLowerCase())
  );

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      dates.push({ value: date.toISOString().split('T')[0], label: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${date.getDate()}/${date.getMonth() + 1}` });
    }
    return dates;
  };

  const getAvailableTimes = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      times.push(`${i.toString().padStart(2, '0')}:00`);
      times.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  return (
    <div className="ride-box">
      {/* Toasts */}
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        />
      ))}

      <div className="ride-location">
        <span className="ride-location-icon">📍</span>
        <span>{currentCity}</span>
        <button className="ride-change-city" onClick={() => setShowCityModal(true)}>Alterar cidade</button>
      </div>

      <h2 className="ride-title">Vá a qualquer lugar com o app da OpenLine</h2>

      <div className="ride-time">
        <span>⚡ Agora</span>
      </div>

      <div className="ride-inputs">
        <div className="ride-input">
          <div className="ride-dot"></div>
          <input type="text" placeholder="Local de partida" value={origin} onChange={(e) => setOrigin(e.target.value)} />
        </div>
        <div className="ride-line"></div>
        <div className="ride-input">
          <div className="ride-square"></div>
          <input type="text" placeholder="Local de chegada" value={destination} onChange={(e) => setDestination(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && checkPrice()} />
        </div>
      </div>

      <div className="ride-actions">
        <button className="ride-button" onClick={checkPrice}>Ver preços</button>
        <button className="ride-button schedule-btn" onClick={handleSchedule}>📅 Agendar</button>
      </div>

      {showPrice && (
        <div className="price-result">
          <div className="price-value">{price}</div>
        </div>
      )}

      <div className="login-link">
        {!isLoggedIn ? (
          <a onClick={() => setShowLoginModal(true)}>Faça login para ver sua atividade recente</a>
        ) : (
          <div>
            <a onClick={() => setShowRecent(!showRecent)}>👤 {currentUser} | Ver minhas corridas</a>
            {' | '}
            <a onClick={handleLogout} style={{ color: '#ef4444' }}>Sair</a>
          </div>
        )}
      </div>

      {showRecent && isLoggedIn && (
        <div className="recent-activity">
          <h4>📋 Atividade recente</h4>
          {recentTrips.length === 0 ? <p>Nenhuma corrida solicitada ainda</p> :
            recentTrips.map((trip) => (
              <div key={trip.id} className="recent-item">
                <div>{trip.origin} → {trip.destination}</div>
                <div className="recent-price">{trip.price}</div>
                <div className="recent-date">{trip.date}</div>
              </div>
            ))
          }
        </div>
      )}

      {/* Modal de Cidades */}
      {showCityModal && (
        <div className="modal-overlay" onClick={() => setShowCityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Selecionar cidade</h3>
            <input type="text" placeholder="Buscar cidade..." value={searchCity} onChange={(e) => setSearchCity(e.target.value)} autoFocus />
            <div className="city-list">
              {filteredCities.map((city) => (
                <button key={city} onClick={() => selectCity(city)}>{city}</button>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowCityModal(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🔐 Entrar</h3>
            <input type="text" placeholder="Usuário" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
            <input type="password" placeholder="Senha" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
            {loginError && <div className="error-msg">{loginError}</div>}
            <button onClick={handleLogin}>Entrar</button>
            <button className="close-btn" onClick={() => setShowLoginModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal de Agendamento */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content schedule-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📅 Agendar Viagem</h3>
            <p className="modal-subtitle">Escolha quando você quiser viajar</p>

            <div className="trip-card">
              <div className="trip-route">
                <span className="trip-icon">🚗</span>
                <div className="trip-info">
                  <div className="trip-label">Sua viagem</div>
                  <div className="trip-path">{origin || '📍 Origem'} → {destination || '🏁 Destino'}</div>
                </div>
              </div>
              <div className="trip-price">{price || 'R$ 0,00'}</div>
            </div>

            <div className="schedule-field">
              <label>📅 Data da viagem</label>
              <select value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}>
                <option value="">Selecione uma data</option>
                {getAvailableDates().map((date) => (
                  <option key={date.value} value={date.value}>{date.label}</option>
                ))}
              </select>
            </div>

            <div className="schedule-field">
              <label>⏰ Horário da viagem</label>
              <select value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}>
                <option value="">Selecione um horário</option>
                {getAvailableTimes().map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className="schedule-info">
              <div className="info-title">ℹ️ Sobre o agendamento</div>
              <ul className="info-list">
                <li>✓ Agende com até 30 dias de antecedência</li>
                <li>✓ Tempo de espera extra incluído</li>
                <li>✓ Cancele sem custo com até 60 minutos de antecedência</li>
              </ul>
            </div>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowScheduleModal(false)}>Cancelar</button>
              <button className="confirm-btn" onClick={confirmSchedule}>Continuar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecaoCorrida;