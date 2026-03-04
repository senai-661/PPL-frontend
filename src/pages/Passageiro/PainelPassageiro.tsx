import { MapPin, Clock, Star, CreditCard, User, List } from 'lucide-react';
import { Link } from 'react-router';

export function PassengerDashboard() {
  const stats = [
    { label: 'Viagens no Mês', value: '24', icon: MapPin, color: 'text-blue-600' },
    { label: 'Tempo Médio', value: '12 min', icon: Clock, color: 'text-green-600' },
    { label: 'Avaliação Média', value: '4.9 ★', icon: Star, color: 'text-yellow-600' },
    { label: 'Gasto Mensal', value: 'R$ 580,00', icon: CreditCard, color: 'text-purple-600' },
  ];

  const recentTrips = [
    { id: '1234', driver: 'João Silva', from: 'Casa', to: 'Shopping', value: 'R$ 25,00', date: 'Hoje, 10:30', rating: 5 },
    { id: '1233', driver: 'Maria Santos', from: 'Trabalho', to: 'Casa', value: 'R$ 22,00', date: 'Ontem, 18:45', rating: 5 },
    { id: '1232', driver: 'Carlos Oliveira', from: 'Casa', to: 'Aeroporto GRU', value: 'R$ 65,00', date: '10 Fev, 06:00', rating: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl mb-2">Olá, Passageiro!</h1>
              <p className="text-white/80">Bem-vindo ao seu painel</p>
            </div>
            <Link
              to="/viagem/nova"
              className="bg-white text-[#5a34a1] px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-lg"
            >
              Nova Viagem
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            to="/passageiro/perfil"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <User className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Meu Perfil</h3>
            <p className="text-gray-600">Visualizar e editar informações</p>
          </Link>

          <Link
            to="/viagem/lista"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <List className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Histórico de Viagens</h3>
            <p className="text-gray-600">Consultar corridas anteriores</p>
          </Link>

          <Link
            to="/viagem/nova"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <MapPin className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Solicitar Viagem</h3>
            <p className="text-gray-600">Fazer uma nova solicitação</p>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Viagens Recentes</h2>
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">#{trip.id} • {trip.date}</p>
                  <p className="mb-1">Motorista: {trip.driver}</p>
                  <p className="text-sm text-gray-600">{trip.from} → {trip.to}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-[#5a34a1]">{trip.value}</p>
                  <p className="text-yellow-600 text-sm">{'★'.repeat(trip.rating)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
