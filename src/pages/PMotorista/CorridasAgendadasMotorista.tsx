import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, User, Phone } from 'lucide-react';

interface Agendamento {
  id: number;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: string;
  status: 'agendado' | 'aceito' | 'recusado' | 'concluido';
  createdAt: string;
  passengerName?: string;
  passengerPhone?: string;
  passengerId?: string;
}

const CorridasAgendadasMotorista: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filter, setFilter] = useState<'todos' | 'agendado' | 'aceito' | 'recusado' | 'concluido'>('agendado');
  const [loading, setLoading] = useState(true);
  const motoristaNome = 'João Silva';

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = () => {
    setLoading(true);
    const saved = localStorage.getItem('openline_agendamentos');
    if (saved) {
      setAgendamentos(JSON.parse(saved));
    }
    setLoading(false);
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
        status: 'aceito' as const,
        passengerName: 'Passageiro ' + Math.floor(Math.random() * 1000),
        passengerPhone: '(11) 9' + Math.floor(Math.random() * 90000000 + 10000000)
      } : ag
    );
    salvarAgendamentos(novos);
    notificarPassageiro(id, 'aceito', '✅ Sua corrida foi aceita! O motorista está a caminho.');
    alert('✅ Corrida aceita! O passageiro foi notificado.');
  };

  const recusarCorrida = (id: number) => {
    if (window.confirm('Tem certeza que deseja recusar esta corrida?')) {
      const novos = agendamentos.map(ag => 
        ag.id === id ? { ...ag, status: 'recusado' as const } : ag
      );
      salvarAgendamentos(novos);
      notificarPassageiro(id, 'recusado', '❌ Sua corrida foi recusada. Por favor, tente novamente.');
      alert('❌ Corrida recusada. O passageiro será notificado.');
    }
  };

  const concluirCorrida = (id: number) => {
    if (window.confirm('Confirmar que a corrida foi concluída?')) {
      const novos = agendamentos.map(ag => 
        ag.id === id ? { ...ag, status: 'concluido' as const } : ag
      );
      salvarAgendamentos(novos);
      notificarPassageiro(id, 'concluido', '✅ Sua viagem foi concluída! Obrigado por usar OpenLine.');
      alert('✅ Corrida concluída! Pagamento será processado.');
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'agendado': return { bg: '#fff3e0', color: '#ed6c02', text: 'Aguardando' };
      case 'aceito': return { bg: '#e8f5e9', color: '#2e7d32', text: 'Aceita' };
      case 'recusado': return { bg: '#ffebee', color: '#d32f2f', text: 'Recusada' };
      case 'concluido': return { bg: '#e3f2fd', color: '#1976d2', text: 'Concluída' };
      default: return { bg: '#f5f5f5', color: '#666', text: status };
    }
  };

  const filtrados = agendamentos.filter(ag => {
    if (filter === 'todos') return true;
    return ag.status === filter;
  });

  const agendamentosPendentes = agendamentos.filter(ag => ag.status === 'agendado').length;

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/motorista/painel" className="text-purple-600 hover:underline flex items-center gap-2 mb-4">
            <ChevronLeft size={20} /> Voltar para Painel
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">🚗 Corridas Agendadas</h1>
              <p className="text-gray-500">Olá, {motoristaNome} | {agendamentosPendentes} pendente(s)</p>
            </div>
            <button onClick={carregarAgendamentos} className="px-4 py-2 bg-purple-600 text-white rounded-lg">🔄 Atualizar</button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'agendado', label: '📋 Pendentes' },
            { id: 'aceito', label: '✅ Aceitas' },
            { id: 'recusado', label: '❌ Recusadas' },
            { id: 'concluido', label: '🏁 Concluídas' },
            { id: 'todos', label: '📋 Todas' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === f.id ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtrados.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">Nenhuma corrida encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtrados.map((ag) => {
              const status = getStatusInfo(ag.status);
              return (
                <div key={ag.id} className="bg-white rounded-xl p-5 shadow-sm border-l-4" style={{ borderLeftColor: status.color }}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium`} style={{ background: status.bg, color: status.color }}>
                      {status.text}
                    </span>
                    <span className="text-xs text-gray-400">#{ag.id}</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex gap-2">
                      <span className="text-green-500">📍</span>
                      <div><div className="text-xs text-gray-500">Partida</div><div className="text-sm font-medium">{ag.origin}</div></div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-red-500">🏁</span>
                      <div><div className="text-xs text-gray-500">Destino</div><div className="text-sm font-medium">{ag.destination}</div></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 border-t pt-3 mb-4">
                    <div className="flex items-center gap-1">📅 {new Date(ag.date).toLocaleDateString('pt-BR')}</div>
                    <div className="flex items-center gap-1">⏰ {ag.time}</div>
                    <div className="font-bold text-purple-600">{ag.price}</div>
                  </div>

                  {ag.status === 'aceito' && ag.passengerName && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"><User size={20} color="white" /></div>
                      <div><div className="text-xs text-blue-600 font-medium">Passageiro</div><div className="font-medium">{ag.passengerName}</div><div className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12} /> {ag.passengerPhone}</div></div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    {ag.status === 'agendado' && (
                      <>
                        <button onClick={() => aceitarCorrida(ag.id)} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">✅ Aceitar</button>
                        <button onClick={() => recusarCorrida(ag.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">❌ Recusar</button>
                      </>
                    )}
                    {ag.status === 'aceito' && (
                      <button onClick={() => concluirCorrida(ag.id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">✅ Concluir Viagem</button>
                    )}
                    {ag.status === 'recusado' && <span className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm">Recusada</span>}
                    {ag.status === 'concluido' && <span className="px-4 py-2 bg-green-100 text-green-600 rounded-lg text-sm">✓ Concluída</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CorridasAgendadasMotorista;