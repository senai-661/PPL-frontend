import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Agendamento {
  id: number;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: string;
  status: 'agendado' | 'aceito' | 'recusado' | 'concluido';
  createdAt: string;
}

export function PassengerDashboard() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);

  useEffect(() => {
    carregarAgendamentos();
    carregarNotificacoesNaoLidas();
  }, []);

  const carregarAgendamentos = () => {
    const saved = localStorage.getItem('openline_agendamentos');
    if (saved) {
      setAgendamentos(JSON.parse(saved));
    }
  };

  const carregarNotificacoesNaoLidas = () => {
    const saved = localStorage.getItem('openline_notificacoes');
    if (saved) {
      const notifs = JSON.parse(saved);
      setNotificacoesNaoLidas(notifs.filter((n: any) => !n.read).length);
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

  const agendamentosPendentes = agendamentos.filter(ag => ag.status === 'agendado').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🚗 Painel do Passageiro</h1>
          <p className="text-gray-500 mt-1">Bem-vindo! Gerencie suas viagens</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-600">
            <div className="text-2xl mb-1">📋</div>
            <div className="text-2xl font-bold text-gray-800">{agendamentos.length}</div>
            <div className="text-gray-500 text-sm">Total de viagens</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-500">
            <div className="text-2xl mb-1">⏳</div>
            <div className="text-2xl font-bold text-gray-800">{agendamentosPendentes}</div>
            <div className="text-gray-500 text-sm">Viagens pendentes</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
            <div className="text-2xl mb-1">🔔</div>
            <div className="text-2xl font-bold text-gray-800">{notificacoesNaoLidas}</div>
            <div className="text-gray-500 text-sm">Notificações novas</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <Link to="/" className="bg-purple-600 text-white text-center py-3 rounded-xl font-medium hover:bg-purple-700 transition">
            📍 Solicitar Nova Viagem
          </Link>
          <Link to="/passageiro/historico" className="bg-gray-200 text-gray-700 text-center py-3 rounded-xl font-medium hover:bg-gray-300 transition">
            📋 Ver Histórico Completo
          </Link>
          <Link to="/passageiro/notificacoes" className="bg-gray-200 text-gray-700 text-center py-3 rounded-xl font-medium hover:bg-gray-300 transition">
            🔔 Notificações {notificacoesNaoLidas > 0 && `(${notificacoesNaoLidas})`}
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">📋 Últimas Viagens</h2>
            <Link to="/passageiro/historico" className="text-purple-600 text-sm hover:underline">Ver todas →</Link>
          </div>

          {agendamentos.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-500">Você ainda não tem viagens</p>
              <Link to="/" className="inline-block mt-3 text-purple-600 hover:underline">Solicitar primeira viagem</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {agendamentos.slice(0, 5).map((ag) => {
                const status = getStatusInfo(ag.status);
                return (
                  <div key={ag.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium`} style={{ background: status.bg, color: status.color }}>
                        {status.text}
                      </span>
                      <span className="text-xs text-gray-400">#{ag.id}</span>
                    </div>
                    <div className="flex items-start gap-2 mb-1">
                      <MapPin size={14} className="text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">Partida</div>
                        <div className="text-sm font-medium truncate">{ag.origin}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin size={14} className="text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">Destino</div>
                        <div className="text-sm font-medium truncate">{ag.destination}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-1"><Calendar size={12} /> {new Date(ag.date).toLocaleDateString('pt-BR')}</div>
                      <div className="flex items-center gap-1"><Clock size={12} /> {ag.time}</div>
                      <div className="font-bold text-purple-600">{ag.price}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PassengerDashboard;