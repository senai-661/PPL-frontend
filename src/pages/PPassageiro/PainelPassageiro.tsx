import { useState } from 'react';

export function PassengerDashboard() {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [tipoCorrida, setTipoCorrida] = useState('convencional');
  const [numPassageiros, setNumPassageiros] = useState(1);
  const [observacoes, setObservacoes] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const solicitarViagem = () => {
    if (!origem.trim()) {
      alert('⚠️ Digite o local de partida');
      return;
    }
    if (!destino.trim()) {
      alert('⚠️ Digite o local de destino');
      return;
    }
    setShowScheduleModal(true);
  };

  const confirmarAgendamento = () => {
    if (!scheduleDate) {
      alert('⚠️ Selecione uma data');
      return;
    }
    if (!scheduleTime) {
      alert('⚠️ Selecione um horário');
      return;
    }

    const novoAgendamento = {
      id: Date.now(),
      origin: origem,
      destination: destino,
      date: scheduleDate,
      time: scheduleTime,
      price: 'R$ 15,00',
      status: 'agendado',
      createdAt: new Date().toISOString(),
    };

    const saved = localStorage.getItem('openline_agendamentos');
    const agendamentosSalvos = saved ? JSON.parse(saved) : [];
    agendamentosSalvos.push(novoAgendamento);
    localStorage.setItem('openline_agendamentos', JSON.stringify(agendamentosSalvos));
    
    setShowScheduleModal(false);
    setOrigem('');
    setDestino('');
    setObservacoes('');
    setNumPassageiros(1);
    setScheduleDate('');
    setScheduleTime('');
    
    alert('✅ Viagem agendada com sucesso!');
  };

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>OpenLine</h1>
        
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Solicitar Viagem</h2>
        <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>Para onde você quer ir?</p>

        {/* Origem */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>📍 Origem</div>
          <input
            type="text"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            placeholder="Digite sua rua, avenida ou bairro"
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
          />
        </div>

        {/* Destino */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>🏁 Destino</div>
          <input
            type="text"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Para onde você quer ir?"
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
          />
        </div>

        {/* Tipo de Corrida */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>🚗 Tipo de Corrida</div>
          <select
            value={tipoCorrida}
            onChange={(e) => setTipoCorrida(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white' }}
          >
            <option value="convencional">Convencional</option>
            <option value="comfort">Comfort</option>
            <option value="black">Black</option>
            <option value="moto">Moto</option>
          </select>
        </div>

        {/* Número de Passageiros */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>👥 Número de Passageiros</div>
          <select
            value={numPassageiros}
            onChange={(e) => setNumPassageiros(Number(e.target.value))}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white' }}
          >
            <option value="1">1 Passageiro</option>
            <option value="2">2 Passageiros</option>
            <option value="3">3 Passageiros</option>
            <option value="4">4 Passageiros</option>
          </select>
        </div>

        {/* Observações */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>💬 Observações (opcional)</div>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex: Tenho muitas malas, precisamos de carro grande..."
            rows={3}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
          />
        </div>

        {/* Botão Solicitar Viagem */}
        <button
          onClick={solicitarViagem}
          style={{ width: '100%', padding: '14px', backgroundColor: '#6b3cc9', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '24px' }}
        >
          Solicitar Viagem
        </button>

        {/* Mapa - EXATAMENTE COMO NA IMAGEM */}
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          borderRadius: '16px', 
          height: '180px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexDirection: 'column',
          marginBottom: '24px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🗺️</div>
          <p style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Mapa da viagem</p>
          <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>Digite origem e destino para visualizar o trajeto no mapa.</p>
        </div>

        {/* ATALHOS */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>📍 ATALHOS</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setDestino('Av. Paulista, 1000')} style={{ background: 'none', border: 'none', color: '#666', fontSize: '13px', cursor: 'pointer' }}>Av. Paulista</button>
            <button onClick={() => setDestino('Shopping Ibirapuera')} style={{ background: 'none', border: 'none', color: '#666', fontSize: '13px', cursor: 'pointer' }}>Shopping Ibirapuera</button>
            <button onClick={() => setDestino('Aeroporto')} style={{ background: 'none', border: 'none', color: '#666', fontSize: '13px', cursor: 'pointer' }}>Aeroporto</button>
          </div>
        </div>

      </div>

      {/* Modal de Agendamento */}
      {showScheduleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', maxWidth: '400px', width: '90%', padding: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>📅 Agendar Viagem</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Data</label>
              <select
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '12px' }}
              >
                <option value="">Selecione uma data</option>
                {getAvailableDates().map(date => (
                  <option key={date.value} value={date.value}>{date.label}</option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Horário</label>
              <select
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '12px' }}
              >
                <option value="">Selecione um horário</option>
                {getAvailableTimes().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{ flex: 1, padding: '12px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAgendamento}
                style={{ flex: 1, padding: '12px', backgroundColor: '#6b3cc9', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PassengerDashboard;