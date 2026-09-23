import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, MapPin } from 'lucide-react';

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

const HistoricoCorridas: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filter, setFilter] = useState<'todos' | 'agendado' | 'aceito' | 'recusado' | 'concluido'>('todos');

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = () => {
    const saved = localStorage.getItem('openline_agendamentos');
    if (saved) setAgendamentos(JSON.parse(saved));
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

  const filteredAgendamentos = agendamentos.filter(ag => {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/passageiro/painel" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
          <ChevronLeft size={20} /> Voltar para Painel
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📋 Histórico de Corridas</h1>
          <p className="text-gray-500">Total de {stats.total} viagem(ns)</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-orange-600">{stats.agendado}</div>
            <div className="text-xs text-gray-500">Aguardando</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-green-600">{stats.aceito}</div>
            <div className="text-xs text-gray-500">Aceitas</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-blue-600">{stats.concluido}</div>
            <div className="text-xs text-gray-500">Concluídas</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-red-600">{stats.recusado}</div>
            <div className="text-xs text-gray-500">Recusadas</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'todos', label: '📋 Todas' },
            { id: 'agendado', label: '⏳ Aguardando' },
            { id: 'aceito', label: '✅ Aceitas' },
            { id: 'concluido', label: '🏁 Concluídas' },
            { id: 'recusado', label: '❌ Recusadas' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === f.id ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {filteredAgendamentos.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">Nenhuma viagem encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAgendamentos.map((ag) => {
              const status = getStatusInfo(ag.status);
              return (
                <div key={ag.id} className="bg-white rounded-xl p-5 shadow-sm border-l-4" style={{ borderLeftColor: status.color }}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium`} style={{ background: status.bg, color: status.color }}>
                      {status.text}
                    </span>
                    <span className="text-xs text-gray-400">#{ag.id}</span>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin size={14} className="text-green-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Partida</div>
                      <div className="text-sm font-medium">{ag.origin}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin size={14} className="text-red-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Destino</div>
                      <div className="text-sm font-medium">{ag.destination}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 border-t pt-3">
                    <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(ag.date).toLocaleDateString('pt-BR')}</div>
                    <div className="flex items-center gap-1"><Clock size={14} /> {ag.time}</div>
                    <div className="font-bold text-purple-600">{ag.price}</div>
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

export default HistoricoCorridas;