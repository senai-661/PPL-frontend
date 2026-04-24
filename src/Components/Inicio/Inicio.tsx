import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CorridaAgendamentoRequests from '../../fetch/CorridaAgendamentoRequests';

export default function Inicio() {
  const navigate = useNavigate();

  const [tipoSelecionado, setTipoSelecionado] = useState<'agora' | 'agendar'>('agora');
  const [dataAgendada, setDataAgendada] = useState('');
  const [horaAgendada, setHoraAgendada] = useState('');

  const handleVerPrecos = async () => {
    if (tipoSelecionado === 'agora') {
      navigate('/solicitar-corrida');
      return;
    }

    if (!dataAgendada || !horaAgendada) {
      alert('Selecione data e hora para agendar');
      return;
    }

    try {
      const dataHoraCompleta = new Date(`${dataAgendada}T${horaAgendada}`).toISOString();

      await CorridaAgendamentoRequests.criarAgendamento({
        origemCorrida: "Origem temporária",
        destinoCorrida: "Destino temporário",
        dataAgendada: dataHoraCompleta,
        tipoCorrida: 'NORMAL'
      });

      alert('Corrida agendada com sucesso 🚀');

      navigate('/corridas-agendadas');

    } catch (error) {
      console.error(error);
      alert('Erro ao agendar corrida');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">OpenLine</h1>
        
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setTipoSelecionado('agora')}
            className={`flex-1 py-3 rounded-xl border ${
              tipoSelecionado === 'agora' 
                ? 'bg-blue-500 text-white' 
                : 'border-gray-300 text-gray-600'
            }`}
          >
            Agora
          </button>
          
          <button
            onClick={() => setTipoSelecionado('agendar')}
            className={`flex-1 py-3 rounded-xl border ${
              tipoSelecionado === 'agendar' 
                ? 'bg-blue-500 text-white' 
                : 'border-gray-300 text-gray-600'
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
            />
            <input
              type="time"
              value={horaAgendada}
              onChange={(e) => setHoraAgendada(e.target.value)}
              className="flex-1 p-3 border rounded-xl"
            />
          </div>
        )}
        
        <button
          onClick={handleVerPrecos}
          className="w-full bg-blue-500 py-4 rounded-xl text-white font-bold text-lg mb-3"
        >
          Ver preços
        </button>

        <button
          onClick={() => navigate('/corridas-agendadas')}
          className="w-full bg-gray-200 py-3 rounded-xl text-gray-700 font-semibold"
        >
          Ver corridas agendadas
        </button>
      </div>
    </div>
  );
}