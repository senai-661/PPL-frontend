import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Car, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import ToastNotification from '../../Components/Elementos/ToastNotification';

interface Agendamento {
  id: number;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: string;
  status: string;
  service?: string;
  passengerName?: string;
  passengerPhone?: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const CorridasAgendadasMotorista: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filter, setFilter] = useState<string>('agendado');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = () => {
    setLoading(true);
    const saved = localStorage.getItem('openline_agendamentos');
    if (saved && JSON.parse(saved).length > 0) {
      setAgendamentos(JSON.parse(saved));
    } else {
      const exemplos = [
        {
          id: 1,
          origin: "Avenida Coronel Fernando Ferreira Leite, 1540, Jardim California, Ribeirão Preto (SP), CEP 14026-900",
          destination: "Rua Aprígio de Araújo, 837 - Centro",
          date: "2026-06-21",
          time: "08:30",
          price: "R$ 8,00",
          status: "agendado",
          service: "OpenLine Go"
        },
        {
          id: 2,
          origin: "R. Aprígio de Araújo, 2058 - Centro",
          destination: "Novo Shopping, Av. Presidente Kennedy, 1500",
          date: "2026-06-22",
          time: "14:00",
          price: "R$ 12,50",
          status: "agendado",
          service: "OpenLine Comfort"
        }
      ];
      localStorage.setItem('openline_agendamentos', JSON.stringify(exemplos));
      setAgendamentos(exemplos);
    }
    setLoading(false);
  };

  const salvarAgendamentos = (novos: Agendamento[]) => {
    setAgendamentos(novos);
    localStorage.setItem('openline_agendamentos', JSON.stringify(novos));
  };

  const notificarPassageiro = (corridaId: number, message: string) => {
    const notificacao = {
      id: Date.now(),
      corridaId: corridaId,
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
        passengerName: 'Carlos Silva',
        passengerPhone: '(11) 98765-4321'
      } : ag
    );
    salvarAgendamentos(novos);
    notificarPassageiro(id, '✅ Sua corrida foi aceita! O motorista está a caminho.');
    showToast('✨ Corrida aceita com sucesso! O passageiro foi notificado e aguarda você.', 'success');
  };

  const recusarCorrida = (id: number) => {
    const novos = agendamentos.map(ag => 
      ag.id === id ? { ...ag, status: 'recusado' } : ag
    );
    salvarAgendamentos(novos);
    notificarPassageiro(id, '❌ Sua corrida foi recusada. Por favor, tente novamente.');
    showToast('⚠️ Corrida recusada. O passageiro será notificado e poderá buscar outro motorista.', 'warning');
  };

  const concluirCorrida = (id: number) => {
    const novos = agendamentos.map(ag => 
      ag.id === id ? { ...ag, status: 'concluido' } : ag
    );
    salvarAgendamentos(novos);
    notificarPassageiro(id, '✅ Sua viagem foi concluída! Obrigado por usar OpenLine.');
    showToast('🏁 Viagem concluída! Pagamento será processado em até 24h. Ótimo trabalho!', 'success');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'agendado':
        return { 
          label: 'Aguardando', 
          color: '#f59e0b', 
          bg: '#fef3c7', 
          icon: <Clock size={14} />,
          border: '#fbbf24'
        };
      case 'aceito':
        return { 
          label: 'Aceita', 
          color: '#10b981', 
          bg: '#d1fae5', 
          icon: <CheckCircle size={14} />,
          border: '#34d399'
        };
      case 'recusado':
        return { 
          label: 'Recusada', 
          color: '#ef4444', 
          bg: '#fee2e2', 
          icon: <XCircle size={14} />,
          border: '#fca5a5'
        };
      case 'concluido':
        return { 
          label: 'Concluída', 
          color: '#3b82f6', 
          bg: '#dbeafe', 
          icon: <CheckCircle size={14} />,
          border: '#93c5fd'
        };
      default:
        return { 
          label: status, 
          color: '#6b7280', 
          bg: '#f3f4f6', 
          icon: null,
          border: '#d1d5db'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const stats = {
    total: agendamentos.length,
    agendado: agendamentos.filter(ag => ag.status === 'agendado').length,
    aceito: agendamentos.filter(ag => ag.status === 'aceito').length,
    concluido: agendamentos.filter(ag => ag.status === 'concluido').length,
    recusado: agendamentos.filter(ag => ag.status === 'recusado').length,
  };

  const filtrados = agendamentos.filter(ag => {
    if (filter === 'todos') return true;
    return ag.status === filter;
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid #e5e7eb', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#6b7280' }}>Carregando corridas...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        />
      ))}

      <div style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
        color: 'white', 
        padding: '48px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: '300px', height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>🚗 Corridas Agendadas</h1>
          <p style={{ opacity: 0.8, fontSize: '16px' }}>Gerencie as corridas solicitadas pelos passageiros</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <button 
            onClick={carregarAgendamentos} 
            style={{ 
              background: 'white', 
              color: '#4b5563', 
              padding: '10px 20px', 
              borderRadius: '10px', 
              border: '1px solid #e5e7eb',
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            <RefreshCw size={16} /> Atualizar
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937' }}>{stats.total}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Total</div>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.agendado}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Pendentes</div>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>{stats.aceito}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Aceitas</div>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.concluido}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Concluídas</div>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ef4444' }}>{stats.recusado}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Recusadas</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
          {[
            { id: 'agendado', label: '📋 Pendentes', count: stats.agendado },
            { id: 'aceito', label: '✅ Aceitas', count: stats.aceito },
            { id: 'concluido', label: '🏁 Concluídas', count: stats.concluido },
            { id: 'recusado', label: '❌ Recusadas', count: stats.recusado },
            { id: 'todos', label: '📋 Todas', count: stats.total }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '8px 20px',
                borderRadius: '30px',
                border: 'none',
                cursor: 'pointer',
                background: filter === f.id ? '#7c3aed' : '#f3f4f6',
                color: filter === f.id ? 'white' : '#4b5563',
                fontWeight: filter === f.id ? '600' : '500',
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              {f.label}
              {f.count > 0 && (
                <span style={{
                  background: filter === f.id ? 'rgba(255,255,255,0.2)' : '#d1d5db',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '11px'
                }}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚗</span> Corridas Disponíveis
            </h2>
          </div>

          {filtrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
              <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '600', color: '#374151' }}>Nenhuma corrida encontrada</h3>
              <p style={{ color: '#6b7280' }}>Não há corridas no momento</p>
              <button onClick={carregarAgendamentos} style={{ marginTop: '20px', background: '#7c3aed', color: 'white', padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                🔄 Atualizar
              </button>
            </div>
          ) : (
            <div>
              {filtrados.map((ag, index) => {
                const status = getStatusConfig(ag.status);
                return (
                  <div 
                    key={ag.id} 
                    style={{ 
                      padding: '24px 28px', 
                      borderBottom: index !== filtrados.length - 1 ? '1px solid #f3f4f6' : 'none',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: status.bg, color: status.color, padding: '4px 12px', borderRadius: '30px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>ID: #{ag.id}</span>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '32px', height: '32px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <MapPin size={16} style={{ color: '#10b981' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Partida</div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', lineHeight: '1.4' }}>{ag.origin}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <div style={{ width: '32px', height: '32px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <MapPin size={16} style={{ color: '#ef4444' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Destino</div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', lineHeight: '1.4' }}>{ag.destination}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '12px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', marginBottom: '16px', fontSize: '13px', color: '#6b7280' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} /> {formatDate(ag.date)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} /> {ag.time}</div>
                      {ag.service && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Car size={14} /> {ag.service}</div>}
                      <div style={{ marginLeft: 'auto', fontWeight: 'bold', fontSize: '18px', color: '#7c3aed' }}>{ag.price}</div>
                    </div>

                    {ag.status === 'aceito' && ag.passengerName && (
                      <div style={{ background: '#e0f2fe', padding: '14px 16px', borderRadius: '16px', marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px', color: '#0369a1' }}>👤 Informações do Passageiro</div>
                        <div style={{ fontSize: '14px', marginBottom: '4px' }}><strong>Nome:</strong> {ag.passengerName}</div>
                        <div style={{ fontSize: '14px' }}><strong>Telefone:</strong> {ag.passengerPhone}</div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      {ag.status === 'agendado' && (
                        <>
                          <button onClick={() => aceitarCorrida(ag.id)} style={{ background: '#10b981', color: 'white', padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle size={16} /> Aceitar
                          </button>
                          <button onClick={() => recusarCorrida(ag.id)} style={{ background: '#ef4444', color: 'white', padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <XCircle size={16} /> Recusar
                          </button>
                        </>
                      )}
                      {ag.status === 'aceito' && (
                        <button onClick={() => concluirCorrida(ag.id)} style={{ background: '#3b82f6', color: 'white', padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={16} /> Concluir Viagem
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CorridasAgendadasMotorista;