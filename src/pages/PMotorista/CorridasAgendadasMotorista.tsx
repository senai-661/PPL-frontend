import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Agendamento {
  id: number;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: string;
  status: string;
  createdAt: string;
  passengerName?: string;
  passengerPhone?: string;
}

const CorridasAgendadasMotorista: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filter, setFilter] = useState<string>('agendado');

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = () => {
    const saved = localStorage.getItem('openline_agendamentos');
    if (saved) {
      setAgendamentos(JSON.parse(saved));
    }
  };

  const salvarAgendamentos = (novos: Agendamento[]) => {
    setAgendamentos(novos);
    localStorage.setItem('openline_agendamentos', JSON.stringify(novos));
  };

  const notificarPassageiro = (corridaId: number, status: string, message: string) => {
    const notificacao = {
      id: Date.now(),
      corridaId: corridaId,
      status: status,
      message: message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const saved = localStorage.getItem('openline_notificacoes');
    const notificacoes = saved ? JSON.parse(saved) : [];
    notificacoes.push(notificacao);
    localStorage.setItem('openline_notificacoes', JSON.stringify(notificacoes));
  };

  const aceitarCorrida = (id: number) => {
    const novos = agendamentos.map(ag => 
      ag.id === id ? { 
        ...ag, 
        status: 'aceito',
        passengerName: 'Passageiro ' + Math.floor(Math.random() * 1000),
        passengerPhone: '(11) 9' + Math.floor(Math.random() * 90000000 + 10000000)
      } : ag
    );
    salvarAgendamentos(novos);
    notificarPassageiro(id, 'aceito', '✅ Sua corrida foi aceita! O motorista está a caminho.');
    alert('✅ Corrida aceita!');
  };

  const recusarCorrida = (id: number) => {
    if (window.confirm('Recusar esta corrida?')) {
      const novos = agendamentos.map(ag => 
        ag.id === id ? { ...ag, status: 'recusado' } : ag
      );
      salvarAgendamentos(novos);
      notificarPassageiro(id, 'recusado', '❌ Sua corrida foi recusada.');
      alert('❌ Corrida recusada!');
    }
  };

  const concluirCorrida = (id: number) => {
    if (window.confirm('Concluir esta corrida?')) {
      const novos = agendamentos.map(ag => 
        ag.id === id ? { ...ag, status: 'concluido' } : ag
      );
      salvarAgendamentos(novos);
      notificarPassageiro(id, 'concluido', '✅ Sua viagem foi concluída!');
      alert('✅ Corrida concluída!');
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

  const filtrados = agendamentos.filter(ag => {
    if (filter === 'todos') return true;
    return ag.status === filter;
  });

  const stats = {
    total: agendamentos.length,
    agendado: agendamentos.filter(ag => ag.status === 'agendado').length,
    aceito: agendamentos.filter(ag => ag.status === 'aceito').length,
    concluido: agendamentos.filter(ag => ag.status === 'concluido').length,
    recusado: agendamentos.filter(ag => ag.status === 'recusado').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/motorista/painel" style={{ color: '#7c3aed', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>← Voltar</Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>🚗 Corridas Agendadas</h1>
          <button onClick={carregarAgendamentos} style={{ background: '#7c3aed', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>🔄 Atualizar</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
          <div style={{ background: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center' }}><strong>{stats.total}</strong><br/><small>Total</small></div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center' }}><strong style={{ color: '#ed6c02' }}>{stats.agendado}</strong><br/><small>Pendentes</small></div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center' }}><strong style={{ color: '#2e7d32' }}>{stats.aceito}</strong><br/><small>Aceitas</small></div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center' }}><strong style={{ color: '#1976d2' }}>{stats.concluido}</strong><br/><small>Concluídas</small></div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center' }}><strong style={{ color: '#d32f2f' }}>{stats.recusado}</strong><br/><small>Recusadas</small></div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['agendado', 'aceito', 'concluido', 'recusado', 'todos'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: filter === f ? '#7c3aed' : '#e5e7eb', color: filter === f ? 'white' : '#333' }}>
              {f === 'agendado' ? '📋 Pendentes' : f === 'aceito' ? '✅ Aceitas' : f === 'concluido' ? '🏁 Concluídas' : f === 'recusado' ? '❌ Recusadas' : '📋 Todas'}
            </button>
          ))}
        </div>

        {filtrados.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px' }}>📭</div>
            <p>Nenhuma corrida encontrada</p>
          </div>
        ) : (
          filtrados.map(ag => (
            <div key={ag.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', borderLeft: `4px solid ${getStatusColor(ag.status)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: getStatusColor(ag.status), fontWeight: 'bold' }}>{getStatusText(ag.status)}</span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>#{ag.id}</span>
              </div>
              <div style={{ marginBottom: '8px' }}><strong>📍 Partida:</strong> {ag.origin}</div>
              <div style={{ marginBottom: '12px' }}><strong>🏁 Destino:</strong> {ag.destination}</div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginBottom: '16px' }}>
                <span>📅 {new Date(ag.date).toLocaleDateString('pt-BR')}</span>
                <span>⏰ {ag.time}</span>
                <span style={{ fontWeight: 'bold', color: '#7c3aed' }}>{ag.price}</span>
              </div>
              {ag.status === 'aceito' && ag.passengerName && (
                <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                  <div><strong>👤 Passageiro:</strong> {ag.passengerName}</div>
                  <div><strong>📞 Telefone:</strong> {ag.passengerPhone}</div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                {ag.status === 'agendado' && (
                  <>
                    <button onClick={() => aceitarCorrida(ag.id)} style={{ background: '#22c55e', color: 'white', padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Aceitar</button>
                    <button onClick={() => recusarCorrida(ag.id)} style={{ background: '#ef4444', color: 'white', padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Recusar</button>
                  </>
                )}
                {ag.status === 'aceito' && <button onClick={() => concluirCorrida(ag.id)} style={{ background: '#3b82f6', color: 'white', padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Concluir</button>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CorridasAgendadasMotorista;