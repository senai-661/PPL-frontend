import { MapPin, Clock, Star, CreditCard, User, List } from 'lucide-react';
import { Link } from 'react-router';

export function PassengerDashboard() {
  const recentTrips = [
    { id: '1234', driver: 'João Silva', from: 'Casa', to: 'Shopping', value: 'R$ 25,00', date: 'Hoje, 10:30', rating: 5 },
    { id: '1233', driver: 'Maria Santos', from: 'Trabalho', to: 'Casa', value: 'R$ 22,00', date: 'Ontem, 18:45', rating: 5 },
    { id: '1232', driver: 'Carlos Oliveira', from: 'Casa', to: 'Aeroporto GRU', value: 'R$ 65,00', date: '10 Fev, 06:00', rating: 4 },
  ];

  const favoriteAddresses = [
    { name: 'Casa', address: 'Rua das Flores, 123 - Vila Mariana' },
    { name: 'Trabalho', address: 'Av. Paulista, 1000 - Bela Vista' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl mb-2">Bem-vindo de volta!</h1>
          <p className="text-white/80">Para onde vamos hoje?</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Action - New Trip */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl mb-6">Solicitar Nova Viagem</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">Origem</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="text"
                  placeholder="Endereço de origem"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Destino</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="text"
                  placeholder="Para onde você vai?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Link
              to="/Viagem/nova-viagem"
              className="flex-1 bg-[#5a34a1] text-white py-3 rounded-lg hover:bg-[#4a2891] transition-colors text-center"
            >
              Solicitar Agora
            </Link>
            <button className="flex-1 border-2 border-[#5a34a1] text-[#5a34a1] py-3 rounded-lg hover:bg-[#5a34a1] hover:text-white transition-colors">
              Agendar Viagem
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/Passageiro/perfil-passageiro"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <User className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Meu Perfil</h3>
            <p className="text-gray-600">Editar informações pessoais</p>
          </Link>

          <Link
            to="/Viagem/lista-viagens"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <List className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Minhas Viagens</h3>
            <p className="text-gray-600">Ver histórico completo</p>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <CreditCard className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Pagamento</h3>
            <p className="text-gray-600">Gerenciar métodos de pagamento</p>
          </div>
        </div>

        {/* Recent Trips */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl mb-4 flex items-center gap-2">
            <Clock className="size-6 text-[#5a34a1]" />
            Viagens Recentes
          </h2>
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">#{trip.id} • {trip.date}</p>
                  <p className="mb-1">Motorista: {trip.driver}</p>
                  <p className="text-sm text-gray-600">{trip.from} → {trip.to}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(trip.rating)].map((_, i) => (
                      <Star key={i} className="size-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg text-[#5a34a1]">{trip.value}</p>
                  <Link to={`/Viagem/avaliação-viagem`} className="text-sm text-blue-600 hover:underline">
                    Ver detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Addresses */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Endereços Favoritos</h2>
          <div className="space-y-3">
            {favoriteAddresses.map((addr, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="size-5 text-[#5a34a1]" />
                <div>
                  <p className="text-sm text-gray-500">{addr.name}</p>
                  <p className="text-gray-900">{addr.address}</p>
                </div>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#5a34a1] hover:text-[#5a34a1] transition-colors">
              + Adicionar Endereço
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
