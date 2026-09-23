import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Bell, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Notificacao {
  id: number;
  corridaId: number;
  status: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const NotificacoesPassageiro: React.FC = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const carregarNotificacoes = () => {
    const saved = localStorage.getItem('openline_notificacoes');
    if (saved) setNotificacoes(JSON.parse(saved));
  };

  const marcarComoLida = (id: number) => {
    const novas = notificacoes.map(n => n.id === id ? { ...n, read: true } : n);
    setNotificacoes(novas);
    localStorage.setItem('openline_notificacoes', JSON.stringify(novas));
  };

  const removerNotificacao = (id: number) => {
    const novas = notificacoes.filter(n => n.id !== id);
    setNotificacoes(novas);
    localStorage.setItem('openline_notificacoes', JSON.stringify(novas));
  };

  const marcarTodasComoLidas = () => {
    const novas = notificacoes.map(n => ({ ...n, read: true }));
    setNotificacoes(novas);
    localStorage.setItem('openline_notificacoes', JSON.stringify(novas));
  };

  const notificacoesNaoLidas = notificacoes.filter(n => !n.read).length;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'aceito':
        return { 
          icon: <CheckCircle size={20} />, 
          bg: '#e8f5e9', 
          color: '#2e7d32',
          borderColor: '#4caf50',
          gradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
        };
      case 'recusado':
        return { 
          icon: <XCircle size={20} />, 
          bg: '#ffebee', 
          color: '#d32f2f',
          borderColor: '#f44336',
          gradient: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
        };
      case 'concluido':
        return { 
          icon: <CheckCircle size={20} />, 
          bg: '#e3f2fd', 
          color: '#1976d2',
          borderColor: '#2196f3',
          gradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdef5 100%)'
        };
      default:
        return { 
          icon: <Clock size={20} />, 
          bg: '#fff3e0', 
          color: '#ed6c02',
          borderColor: '#ff9800',
          gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header com voltar */}
        <Link to="/passageiro/painel" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors">
          <ChevronLeft size={20} /> Voltar para Painel
        </Link>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cabeçalho com gradiente */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bell size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Notificações</h1>
                  <p className="text-purple-100 text-sm">Fique por dentro das suas viagens</p>
                </div>
              </div>
              {notificacoesNaoLidas > 0 && (
                <span className="bg-white text-purple-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {notificacoesNaoLidas} novas
                </span>
              )}
            </div>
          </div>

          {/* Botão marcar todas como lidas */}
          {notificacoes.length > 0 && (
            <div className="px-6 py-3 border-b border-gray-100 flex justify-end">
              <button
                onClick={marcarTodasComoLidas}
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
              >
                <CheckCircle size={14} /> Marcar todas como lidas
              </button>
            </div>
          )}

          {/* Lista de notificações */}
          <div className="divide-y divide-gray-100">
            {notificacoes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell size={32} className="text-gray-400" />
                </div>
                <h3 className="text-gray-500 font-medium">Nenhuma notificação</h3>
                <p className="text-gray-400 text-sm mt-1">Você não tem notificações no momento</p>
              </div>
            ) : (
              notificacoes.map((notif) => {
                const config = getStatusConfig(notif.status);
                return (
                  <div
                    key={notif.id}
                    onClick={() => marcarComoLida(notif.id)}
                    className={`px-6 py-4 transition-all duration-300 cursor-pointer hover:bg-gray-50 ${
                      !notif.read ? 'bg-purple-50/30 border-l-4 border-purple-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Ícone animado */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform"
                        style={{ background: config.gradient }}
                      >
                        <div style={{ color: config.color }}>{config.icon}</div>
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notif.status === 'aceito' && '✅ Corrida Aceita!'}
                              {notif.status === 'recusado' && '❌ Corrida Recusada'}
                              {notif.status === 'concluido' && '🏁 Viagem Concluída!'}
                              {!['aceito', 'recusado', 'concluido'].includes(notif.status) && '📢 Atualização'}
                            </p>
                            <p className={`text-sm mt-1 ${!notif.read ? 'text-gray-700' : 'text-gray-500'}`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                              <Clock size={10} />
                              {new Date(notif.createdAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removerNotificacao(notif.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificacoesPassageiro;