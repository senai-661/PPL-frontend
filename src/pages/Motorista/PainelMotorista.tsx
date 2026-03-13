import { DollarSign, MapPin, Star, TrendingUp, Clock, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DriverDashboard() {
  const stats = [
    { label: 'Ganhos Hoje', value: 'R$ 245,00', icon: DollarSign, color: 'text-green-600' },
    { label: 'Viagens Hoje', value: '12', icon: MapPin, color: 'text-blue-600' },
    { label: 'Avaliação', value: '4.9 ⭐', icon: Star, color: 'text-yellow-600' },
    { label: 'Horas Online', value: '6h 30min', icon: Clock, color: 'text-purple-600' },
  ];

  const recentTrips = [
    { id: '1234', passenger: 'Maria Silva', from: 'Av. Paulista', to: 'Shopping Center', value: 'R$ 25,00', time: '10:30' },
    { id: '1235', passenger: 'João Santos', from: 'Centro', to: 'Aeroporto GRU', value: 'R$ 65,00', time: '12:15' },
    { id: '1236', passenger: 'Ana Costa', from: 'Zona Sul', to: 'Hospital', value: 'R$ 18,00', time: '14:45' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl mb-2">Olá, Motorista!</h1>
              <p className="text-white/80">Bem-vindo ao seu painel</p>
            </div>
            <button className="bg-white text-[#5a34a1] px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-lg">
              Ficar Online
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`size-8 ${stat.color}`} />
              </div>
              <p className="text-3xl mb-1">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/motorista/perfil"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <Star className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Meu Perfil</h3>
            <p className="text-gray-600">Visualizar e editar informações</p>
          </Link>

          <Link
            to="/viagem/lista"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <MapPin className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Histórico de Viagens</h3>
            <p className="text-gray-600">Ver todas as corridas</p>
          </Link>

          <Link
            to="/motorista/cadastro-carro"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <Car className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Meu Veículo</h3>
            <p className="text-gray-600">Gerenciar veículo</p>
          </Link>
        </div>

        {/* Recent Trips */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Viagens Recentes</h2>
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">#{trip.id} • {trip.time}</p>
                  <p className="mb-1">{trip.passenger}</p>
                  <p className="text-sm text-gray-600">{trip.from} → {trip.to}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-[#5a34a1]">{trip.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4 flex items-center gap-2">
            <TrendingUp className="size-6 text-[#5a34a1]" />
            Ganhos da Semana
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, idx) => {
              const heights = [60, 75, 85, 70, 90, 50, 40];
              return (
                <div key={day} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-[#5a34a1] rounded-t"
                    style={{ height: `${heights[idx]}%` }}
                  />
                  <p className="text-sm text-gray-600 mt-2">{day}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

