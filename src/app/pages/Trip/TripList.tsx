import { Calendar, MapPin, DollarSign, Star, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export function TripList() {
  const [filter, setFilter] = useState('all'); // all, completed, cancelled
  const [searchTerm, setSearchTerm] = useState('');

  const trips = [
    {
      id: '1234',
      date: '13 Fev 2026, 10:30',
      driver: 'João Silva',
      from: 'Av. Paulista, 1000',
      to: 'Shopping Eldorado',
      value: 'R$ 28,00',
      status: 'completed',
      rating: 5,
    },
    {
      id: '1233',
      date: '12 Fev 2026, 18:45',
      driver: 'Maria Santos',
      from: 'Trabalho',
      to: 'Casa',
      value: 'R$ 22,00',
      status: 'completed',
      rating: 4,
    },
    {
      id: '1232',
      date: '10 Fev 2026, 06:00',
      driver: 'Carlos Oliveira',
      from: 'Casa',
      to: 'Aeroporto GRU',
      value: 'R$ 65,00',
      status: 'completed',
      rating: 5,
    },
    {
      id: '1231',
      date: '09 Fev 2026, 14:20',
      driver: 'Ana Costa',
      from: 'Shopping',
      to: 'Hospital',
      value: 'R$ 18,00',
      status: 'cancelled',
      rating: 0,
    },
  ];

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    return trip.status === filter;
  });

  const stats = {
    total: trips.length,
    completed: trips.filter(t => t.status === 'completed').length,
    cancelled: trips.filter(t => t.status === 'cancelled').length,
    totalSpent: 'R$ 1.245,00',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Minhas Viagens</h1>
          <p className="text-gray-600">Histórico completo de corridas</p>
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
            <p className="text-3xl text-[#5a34a1] mb-1">{stats.totalSpent}</p>
            <p className="text-gray-600 text-sm">Total Gasto</p>
          </div>
        </div>

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
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'completed'
                    ? 'bg-[#5a34a1] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Concluídas
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'cancelled'
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
                placeholder="Buscar viagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
              />
            </div>
          </div>
        </div>

        {/* Trip List */}
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      trip.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {trip.status === 'completed' ? 'Concluída' : 'Cancelada'}
                    </span>
                    <span className="text-sm text-gray-500">#{trip.id}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="size-4" />
                    <span>{trip.date}</span>
                  </div>

                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="size-4 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Origem</p>
                      <p className="text-gray-900">{trip.from}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="size-4 text-red-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Destino</p>
                      <p className="text-gray-900">{trip.to}</p>
                    </div>
                  </div>

                  {trip.status === 'completed' && (
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(trip.rating)].map((_, i) => (
                        <Star key={i} className="size-4 text-yellow-500 fill-yellow-500" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">Motorista: {trip.driver}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="size-5 text-[#5a34a1]" />
                    <span className="text-2xl text-[#5a34a1]">{trip.value}</span>
                  </div>
                  <Link
                    to={`/Viagem/dashboard-viagem`}
                    className="inline-block text-sm text-blue-600 hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">Nenhuma viagem encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
