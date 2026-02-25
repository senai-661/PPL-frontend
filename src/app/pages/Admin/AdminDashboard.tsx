import { Users, Car, MapPin, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export function AdminDashboard() {
  const stats = [
    { label: 'Passageiros Ativos', value: '12,450', icon: Users, change: '+12%', color: 'text-green-600' },
    { label: 'Motoristas Ativos', value: '523', icon: Car, change: '+8%', color: 'text-green-600' },
    { label: 'Viagens Hoje', value: '1,234', icon: MapPin, change: '+15%', color: 'text-green-600' },
    { label: 'Receita Mensal', value: 'R$ 245K', icon: DollarSign, change: '+23%', color: 'text-green-600' },
  ];

  const recentAlerts = [
    { type: 'warning', message: 'Motorista #4521 com avaliação baixa', time: '5 min atrás' },
    { type: 'info', message: 'Pico de demanda detectado em Zona Sul', time: '12 min atrás' },
    { type: 'success', message: 'Meta mensal atingida em 75%', time: '1 hora atrás' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl mb-2">Dashboard Administrativo</h1>
          <p className="text-white/80">Visão geral da plataforma OpenLine</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="size-8 text-[#5a34a1]" />
                <span className={`text-sm ${stat.color}`}>{stat.change}</span>
              </div>
              <p className="text-3xl mb-1">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/Administrador/tabela-passageiros"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <Users className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Gerenciar Passageiros</h3>
            <p className="text-gray-600">Visualizar e gerenciar todos os passageiros</p>
          </Link>

          <Link
            to="/Administrador/tabela-motoristas"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <Car className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Gerenciar Motoristas</h3>
            <p className="text-gray-600">Aprovar e gerenciar motoristas</p>
          </Link>

          <Link
            to="/Administrador/tabela-carros"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <Car className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Gerenciar Veículos</h3>
            <p className="text-gray-600">Controlar frota de veículos</p>
          </Link>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4 flex items-center gap-2">
            <AlertCircle className="size-6 text-[#5a34a1]" />
            Alertas Recentes
          </h2>
          <div className="space-y-3">
            {recentAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <span className="text-gray-700">{alert.message}</span>
                </div>
                <span className="text-sm text-gray-500">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
