import { AlertCircle, Car, DollarSign, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const stats = [
    { label: 'Passageiros Ativos', value: '12,450', icon: Users, change: '+12%', color: 'text-green-600' },
    { label: 'Motoristas Ativos', value: '523', icon: Car, change: '+8%', color: 'text-green-600' },
    { label: 'Viagens Hoje', value: '1,234', icon: MapPin, change: '+15%', color: 'text-green-600' },
    { label: 'Receita Mensal', value: 'R$ 245K', icon: DollarSign, change: '+23%', color: 'text-green-600' },
  ];

  const recentAlerts = [
    { type: 'warning', message: 'Motorista #4521 com avaliacao baixa', time: '5 min atras' },
    { type: 'info', message: 'Pico de demanda detectado em Zona Sul', time: '12 min atras' },
    { type: 'success', message: 'Meta mensal atingida em 75%', time: '1 hora atras' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 mb-8">
        <h2 className="text-2xl text-gray-900 mb-1">Resumo da plataforma</h2>
        <p className="text-gray-600">Acompanhe indicadores e acesse as principais tabelas administrativas.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="size-8 text-[#5a34a1]" />
              <span className={`text-sm ${stat.color}`}>{stat.change}</span>
            </div>
            <p className="text-3xl mb-1">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/administrador/tabela-passageiros"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <Users className="size-10 text-[#5a34a1] mb-3" />
          <h3 className="text-xl mb-2">Gerenciar Passageiros</h3>
          <p className="text-gray-600">Visualizar e gerenciar todos os passageiros</p>
        </Link>

        <Link
          to="/administrador/tabela-motoristas"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <Car className="size-10 text-[#5a34a1] mb-3" />
          <h3 className="text-xl mb-2">Gerenciar Motoristas</h3>
          <p className="text-gray-600">Aprovar e gerenciar motoristas</p>
        </Link>

        <Link
          to="/administrador/tabela-carros"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <Car className="size-10 text-[#5a34a1] mb-3" />
          <h3 className="text-xl mb-2">Gerenciar Veiculos</h3>
          <p className="text-gray-600">Controlar frota de veiculos</p>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl mb-4 flex items-center gap-2">
          <AlertCircle className="size-6 text-[#5a34a1]" />
          Alertas Recentes
        </h2>
        <div className="space-y-3">
          {recentAlerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-500' : alert.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                />
                <span className="text-gray-700">{alert.message}</span>
              </div>
              <span className="text-sm text-gray-500">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
