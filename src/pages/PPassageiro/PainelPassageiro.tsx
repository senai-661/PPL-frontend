import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Agendamento {
  id: number;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: string;
  status: string;
  service?: string;
  createdAt: string;
}

export function PassengerDashboard() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = () => {
    const saved = localStorage.getItem('openline_agendamentos');
    console.log('Agendamentos:', saved);
    if (saved) {
      setAgendamentos(JSON.parse(saved));
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendado': return '⏳ Aguardando';
      case 'aceito': return '✅ Aceita';
      case 'recusado': return '❌ Recusada';
      case 'concluido': return '✓ Concluída';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return '#ed6c02';
      case 'aceito': return '#2e7d32';
      case 'recusado': return '#d32f2f';
      case 'concluido': return '#1976d2';
      default: return '#666';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>🚗 Painel do Passageiro</h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>Gerencie suas viagens agendadas</p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '30px' }}>
          <Link to="/" style={{ background: '#7c3aed', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none' }}>📍 Nova Viagem</Link>
          <button onClick={carregarAgendamentos} style={{ background: '#e5e7eb', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>🔄 Atualizar</button>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>📋 Minhas Viagens</h2>
          
          {agendamentos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <p>Você ainda não tem viagens agendadas</p>
            </div>
          ) : (
            agendamentos.map((ag) => (
              <div key={ag.id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ background: '#f3f4f6', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: getStatusColor(ag.status) }}>
                    {getStatusText(ag.status)}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>#{ag.id}</span>
                </div>
                <div style={{ marginBottom: '8px' }}><strong>📍 Partida:</strong> {ag.origin}</div>
                <div style={{ marginBottom: '12px' }}><strong>🏁 Destino:</strong> {ag.destination}</div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                  <span>📅 {new Date(ag.date).toLocaleDateString('pt-BR')}</span>
                  <span>⏰ {ag.time}</span>
                  <span style={{ fontWeight: 'bold', color: '#7c3aed' }}>{ag.price}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PassengerDashboard;