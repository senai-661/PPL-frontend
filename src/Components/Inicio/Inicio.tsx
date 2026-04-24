import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inicio() {
  const navigate = useNavigate();
  const [tipoSelecionado, setTipoSelecionado] = useState<'agora' | 'agendar'>('agora');
  const [dataAgendada, setDataAgendada] = useState('');
  const [horaAgendada, setHoraAgendada] = useState('');

  const handleVerPrecos = () => {
    if (tipoSelecionado === 'agora') {
      navigate('/solicitar-corrida');
    } else {
      if (!dataAgendada || !horaAgendada) {
        alert('Selecione data e hora para agendar');
        return;
      }
      navigate('/solicitar-corrida', {
        state: {
          tipo: 'agendada',
          data: dataAgendada,
          hora: horaAgendada
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">OpenLine</h1>
        
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setTipoSelecionado('agora')}
            className={`flex-1 py-3 rounded-xl border transition-all ${
              tipoSelecionado === 'agora' 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Agora
          </button>
          
          <button
            onClick={() => setTipoSelecionado('agendar')}
            className={`flex-1 py-3 rounded-xl border transition-all ${
              tipoSelecionado === 'agendar' 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Agendar mais tarde
          </button>
        </div>

        {tipoSelecionado === 'agendar' && (
          <div className="flex gap-3 mb-5">
            <input
              type="date"
              value={dataAgendada}
              onChange={(e) => setDataAgendada(e.target.value)}
              className="flex-1 p-3 border rounded-xl"
              placeholder="Data"
            />
            <input
              type="time"
              value={horaAgendada}
              onChange={(e) => setHoraAgendada(e.target.value)}
              className="flex-1 p-3 border rounded-xl"
              placeholder="Hora"
            />
          </div>
        )}
        
        <button
          onClick={handleVerPrecos}
          className="w-full bg-blue-500 py-4 rounded-xl text-white font-bold text-lg mb-3 hover:bg-blue-600 transition-all"
        >
          Ver preços
        </button>
        
        <p className="text-center text-gray-400 text-sm">
          Faça login para ver sua atividade recente
        </p>
      </div>
      <h2 className="text-2xl font-bold mb-2">Nossos Serviços</h2>
      <p className="text-gray-500 mb-5">
        Soluções completas para sua mobilidade e muito mais
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold mb-2">Corridas</h3>
          <p className="text-gray-500">
            Solicite uma corrida imediata ou agende para mais tarde
          </p>
        </div>
      </div>

    </div>
  );
}