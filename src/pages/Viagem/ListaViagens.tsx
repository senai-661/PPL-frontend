import { Calendar, MapPin, DollarSign, Star, Search, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CorridaRequest from '../../fetch/CorridaRequest';

interface PassageiroInfo {
  id: number;
  nome: string;
  sobrenome: string;
  celular: string;
  necessidades: string[] | null;
}

interface Trip {
  idCorrida: number;
  origemCorrida: string;
  destinoCorrida: string;
  tipoCorrida: string;
  preco: number;
  dataCorrida: string;
  duracaoCorrida: number;
  motivoCancelamento: string | null;
  statusCorrida: 'Pendente' | 'Aceito' | 'Em andamento' | 'Finalizada' | 'Cancelada';
  passageiro: PassageiroInfo;
}

export function TripList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filter, setFilter] = useState<'all' | 'Finalizada' | 'Cancelada'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function carregarHistorico() {
      setLoading(true);
      setError(null);
      try {
        const data = await CorridaRequest.getHistorico();
        setTrips(data || []);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar viagens');
      } finally {
        setLoading(false);
      }
    }
    
    carregarHistorico();
  }, []);

  // Filtros
  const filteredTrips = trips.filter(trip => {
    if (filter !== 'all' && trip.statusCorrida !== filter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        trip.idCorrida.toString().includes(searchLower) ||
        trip.origemCorrida.toLowerCase().includes(searchLower) ||
        trip.destinoCorrida.toLowerCase().includes(searchLower) ||
        trip.passageiro.nome.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: trips.length,
    completed: trips.filter(t => t.statusCorrida === 'Finalizada').length,
    cancelled: trips.filter(t => t.statusCorrida === 'Cancelada').length,
    totalEarned: trips
      .filter(t => t.statusCorrida === 'Finalizada')
      .reduce((sum, t) => sum + t.preco, 0),
  };

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function formatarData(dataISO: string) {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'Finalizada': return 'Concluída';
      case 'Cancelada': return 'Cancelada';
      case 'Pendente': return 'Pendente';
      case 'Aceito': return 'Aceita';
      case 'Em andamento': return 'Em Andamento';
      default: return status;
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case 'Finalizada': return 'bg-green-100 text-green-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#5a34a1]">
          <Loader2 className="size-10 animate-spin" />
          <p className="text-lg">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Minhas Viagens</h1>
          <p className="text-gray-600">Histórico completo de corridas realizadas</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl text-[#5a34a1] mb-1">{stats.total}</p>
            <p className="text-gray-600 text-sm">Total de Viagens</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl text-green-600 mb-1">{stats.completed}</p>
            <p className="text-gray-600 text-sm">Concluídas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl text-red-600 mb-1">{stats.cancelled}</p>
            <p className="text-gray-600 text-sm">Canceladas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl text-[#5a34a1] mb-1">{formatarMoeda(stats.totalEarned)}</p>
            <p className="text-gray-600 text-sm">Total Recebido</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="size-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-[#5a34a1] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('Finalizada')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'Finalizada'
                    ? 'bg-[#5a34a1] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Concluídas
              </button>
              <button
                onClick={() => setFilter('Cancelada')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'Cancelada'
                    ? 'bg-[#5a34a1] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Canceladas
              </button>
            </div>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Buscar por local ou passageiro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
              />
            </div>
          </div>
        </div>

        {/* Trip List */}
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <div key={trip.idCorrida} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(trip.statusCorrida)}`}>
                      {getStatusText(trip.statusCorrida)}
                    </span>
                    <span className="text-sm text-gray-500">#{trip.idCorrida}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="size-4" />
                    <span>{formatarData(trip.dataCorrida)}</span>
                  </div>

                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="size-4 text-green-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Origem</p>
                      <p className="text-gray-900 text-sm">{trip.origemCorrida}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="size-4 text-red-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Destino</p>
                      <p className="text-gray-900 text-sm">{trip.destinoCorrida}</p>
                    </div>
                  </div>

                  {trip.statusCorrida === 'Finalizada' && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <span>Passageiro: {trip.passageiro.nome} {trip.passageiro.sobrenome}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2 justify-end">
                    <DollarSign className="size-5 text-[#5a34a1]" />
                    <span className="text-2xl text-[#5a34a1]">{formatarMoeda(trip.preco)}</span>
                  </div>
                  <Link
                    to={`/viagem/${trip.idCorrida}`}
                    className="inline-block text-sm text-[#5a34a1] hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTrips.length === 0 && !loading && (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">
              {trips.length === 0 
                ? 'Nenhuma viagem realizada ainda.' 
                : 'Nenhuma viagem encontrada com os filtros selecionados.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}