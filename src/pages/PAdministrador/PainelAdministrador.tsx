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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-[#24305f] to-[#4b5f9e] p-6 sm:p-8 text-white shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Resumo da plataforma</h2>
        <p className="text-white/85">Acompanhe indicadores e acesse rapidamente as principais tabelas administrativas.</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center justify-center size-11 rounded-xl bg-[#f0e8ff]">
                <stat.icon className="size-6 text-[#5a34a1]" />
              </span>
              <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Link
          to="/administrador/tabela-passageiros"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm  transition-all "
        >
          <span className="inline-flex items-center justify-center size-11 rounded-xl bg-teal-100 text-teal-700 mb-4">
            <Users className="size-6" />
          </span>
          <h3 className="text-xl mb-2 text-gray-900">Gerenciar Passageiros</h3>
          <p className="text-gray-600">Visualizar e gerenciar todos os passageiros</p>
        </Link>

        <Link
          to="/administrador/tabela-motoristas"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm  transition-all "
        >
          <span className="inline-flex items-center justify-center size-11 rounded-xl bg-violet-100 text-violet-700 mb-4">
            <Car className="size-6" />
          </span>
          <h3 className="text-xl mb-2 text-gray-900">Gerenciar Motoristas</h3>
          <p className="text-gray-600">Aprovar e gerenciar motoristas</p>
        </Link>

        <Link
          to="/administrador/tabela-carros"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm  transition-all "
        >
          <span className="inline-flex items-center justify-center size-11 rounded-xl bg-blue-100 text-blue-700 mb-4">
            <Car className="size-6" />
          </span>
          <h3 className="text-xl mb-2 text-gray-900">Gerenciar Veiculos</h3>
          <p className="text-gray-600">Controlar frota de veiculos</p>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl text-gray-900 mb-5 flex items-center gap-2">
          <AlertCircle className="size-6 text-[#5a34a1]" />
          Alertas Recentes
        </h2>
        <div className="space-y-3">
          {recentAlerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
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

