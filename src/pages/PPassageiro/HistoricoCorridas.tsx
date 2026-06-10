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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/passageiro/painel" className="text-purple-600 hover:underline flex items-center gap-2 mb-6">
          <ChevronLeft size={20} /> Voltar para Painel
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">📋 Histórico de Corridas</h1>

          {agendamentos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500">Você ainda não tem corridas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {agendamentos.map((ag) => {
                const status = getStatusInfo(ag.status);
                return (
                  <div key={ag.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
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
    </div>
  );
};

export default HistoricoCorridas;