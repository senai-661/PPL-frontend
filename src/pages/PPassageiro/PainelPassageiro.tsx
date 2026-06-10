import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Car, RefreshCw, PlusCircle, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('todas');

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'agendado':
        return { 
          label: 'Aguardando', 
          color: '#f59e0b', 
          bg: '#fef3c7', 
          icon: <Clock size={14} />,
          borderLeft: '4px solid #f59e0b'
        };
      case 'aceito':
        return { 
          label: 'Aceita', 
          color: '#10b981', 
          bg: '#d1fae5', 
          icon: <CheckCircle size={14} />,
          borderLeft: '4px solid #10b981'
        };
      case 'recusado':
        return { 
          label: 'Recusada', 
          color: '#ef4444', 
          bg: '#fee2e2', 
          icon: <XCircle size={14} />,
          borderLeft: '4px solid #ef4444'
        };
      case 'concluido':
        return { 
          label: 'Concluída', 
          color: '#3b82f6', 
          bg: '#dbeafe', 
          icon: <CheckCircle size={14} />,
          borderLeft: '4px solid #3b82f6'
        };
      default:
        return { 
          label: status, 
          color: '#6b7280', 
          bg: '#f3f4f6', 
          icon: null,
          borderLeft: '4px solid #9ca3af'
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

  const filteredAgendamentos = agendamentos.filter(ag => {
    if (selectedFilter === 'todas') return true;
    return ag.status === selectedFilter;
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '3px solid #e2e8f0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748b' }}>Carregando suas viagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', 
        color: 'white', 
        padding: '60px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '12px' }}>🚗 Olá, Passageiro!</h1>
          <p style={{ opacity: 0.9, fontSize: '18px' }}>Bem-vindo ao seu painel de controle. Gerencie todas as suas viagens em um só lugar.</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-30px auto 0', padding: '0 20px 40px', position: 'relative', zIndex: 2 }}>
        {/* Cards de estatísticas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px'
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '20px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9',
            transition: 'transform 0.2s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Total de Viagens</span>
              <div style={{ background: '#eef2ff', padding: '8px', borderRadius: '12px' }}>
                <TrendingUp size={18} color="#7c3aed" />
              </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b' }}>{stats.total}</div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '20px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Aguardando</span>
              <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '12px' }}>
                <Clock size={18} color="#f59e0b" />
              </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.agendado}</div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '20px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Aceitas</span>
              <div style={{ background: '#d1fae5', padding: '8px', borderRadius: '12px' }}>
                <CheckCircle size={18} color="#10b981" />
              </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>{stats.aceito}</div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '20px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Concluídas</span>
              <div style={{ background: '#dbeafe', padding: '8px', borderRadius: '12px' }}>
                <DollarSign size={18} color="#3b82f6" />
              </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.concluido}</div>
          </div>
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link 
              to="/" 
              style={{ 
                background: '#7c3aed', 
                color: 'white', 
                padding: '12px 24px', 
                borderRadius: '12px', 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <PlusCircle size={18} /> Nova Viagem
            </Link>
            <button 
              onClick={carregarAgendamentos} 
              style={{ 
                background: 'white', 
                color: '#475569', 
                padding: '12px 24px', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0',
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={18} /> Atualizar
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'todas', label: '📋 Todas', count: stats.total },
            { id: 'agendado', label: '⏳ Aguardando', count: stats.agendado, color: '#f59e0b' },
            { id: 'aceito', label: '✅ Aceitas', count: stats.aceito, color: '#10b981' },
            { id: 'concluido', label: '✓ Concluídas', count: stats.concluido, color: '#3b82f6' },
            { id: 'recusado', label: '❌ Recusadas', count: stats.recusado, color: '#ef4444' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              style={{
                padding: '8px 20px',
                borderRadius: '40px',
                border: selectedFilter === filter.id ? `1px solid ${filter.color || '#7c3aed'}` : '1px solid #e2e8f0',
                background: selectedFilter === filter.id ? (filter.color ? `${filter.color}10` : '#f3e8ff') : 'white',
                color: selectedFilter === filter.id ? (filter.color || '#7c3aed') : '#64748b',
                cursor: 'pointer',
                fontWeight: selectedFilter === filter.id ? '600' : '500',
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {filter.label}
              {filter.count > 0 && (
                <span style={{
                  background: selectedFilter === filter.id ? (filter.color || '#7c3aed') : '#e2e8f0',
                  color: selectedFilter === filter.id ? 'white' : '#64748b',
                  padding: '2px 8px',
                  borderRadius: '30px',
                  fontSize: '11px'
                }}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Lista de viagens */}
        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {filteredAgendamentos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚗</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Nenhuma viagem encontrada</h3>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>Comece solicitando sua primeira corrida</p>
              <Link to="/" style={{ background: '#7c3aed', color: 'white', padding: '12px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '500', display: 'inline-block' }}>
                Solicitar viagem
              </Link>
            </div>
          ) : (
            filteredAgendamentos.map((ag, index) => {
              const status = getStatusConfig(ag.status);
              return (
                <div 
                  key={ag.id} 
                  style={{ 
                    padding: '24px', 
                    borderBottom: index !== filteredAgendamentos.length - 1 ? '1px solid #f1f5f9' : 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    borderLeft: status.borderLeft
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ 
                        background: status.bg, 
                        color: status.color, 
                        padding: '4px 12px', 
                        borderRadius: '30px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#94a3b8', background: '#f8fafc', padding: '4px 10px', borderRadius: '20px' }}>
                      ID: #{ag.id}
                    </span>
                  </div>

                  {/* Rotas */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                      <div style={{ width: '28px', height: '28px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MapPin size={14} style={{ color: '#10b981' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', color: '#94a3af', marginBottom: '4px', fontWeight: '500' }}>ORIGEM</div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', lineHeight: '1.4' }}>{ag.origin}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <div style={{ width: '28px', height: '28px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MapPin size={14} style={{ color: '#ef4444' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', color: '#94a3af', marginBottom: '4px', fontWeight: '500' }}>DESTINO</div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', lineHeight: '1.4' }}>{ag.destination}</div>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes */}
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '20px', 
                    paddingTop: '16px', 
                    borderTop: '1px solid #f1f5f9',
                    fontSize: '13px',
                    color: '#64748b'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} style={{ color: '#94a3af' }} />
                      <span>{formatDate(ag.date)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} style={{ color: '#94a3af' }} />
                      <span>{ag.time}</span>
                    </div>
                    {ag.service && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Car size={14} style={{ color: '#94a3af' }} />
                        <span>{ag.service}</span>
                      </div>
                    )}
                    <div style={{ marginLeft: 'auto', fontWeight: 'bold', fontSize: '20px', color: '#7c3aed' }}>
                      {ag.price}
                    </div>
                  </div>
                </div>
              );
            })
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
}

export default PassengerDashboard;