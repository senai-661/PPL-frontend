import { AlertCircle, Car, DollarSign, MapPin, Truck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

type AlertType = 'warning' | 'info' | 'success';

type Stat = {
  label: string;
  value: string;
  icon: React.ElementType;
  change: string;
};

type RecentAlert = {
  id: string;
  type: AlertType;
  message: string;
  time: string;
};

type QuickLink = {
  to: string;
  label: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
};

const ALERT_COLOR: Record<AlertType, string> = {
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
  success: 'bg-green-500',
};

const STATS: Stat[] = [
  { label: 'Passageiros Ativos', value: '12.450', icon: Users, change: '+12%' },
  { label: 'Motoristas Ativos', value: '523', icon: Car, change: '+8%' },
  { label: 'Viagens Hoje', value: '1.234', icon: MapPin, change: '+15%' },
  { label: 'Receita Mensal', value: 'R$ 245K', icon: DollarSign, change: '+23%' },
];

const QUICK_LINKS: QuickLink[] = [
  {
    to: '/administrador/tabela-passageiros',
    label: 'Gerenciar Passageiros',
    description: 'Visualizar e gerenciar todos os passageiros',
    icon: Users,
    colorClass: 'bg-teal-100 text-teal-700',
  },
  {
    to: '/administrador/tabela-motoristas',
    label: 'Gerenciar Motoristas',
    description: 'Aprovar e gerenciar motoristas',
    icon: Car,
    colorClass: 'bg-violet-100 text-violet-700',
  },
  {
    to: '/administrador/tabela-carros',
    label: 'Gerenciar Veículos',
    description: 'Controlar frota de veículos',
    icon: Truck,
    colorClass: 'bg-blue-100 text-blue-700',
  },
];

const RECENT_ALERTS: RecentAlert[] = [
  { id: 'alert-1', type: 'warning', message: 'Motorista #4521 com avaliação baixa', time: '5 min atrás' },
  { id: 'alert-2', type: 'info', message: 'Pico de demanda detectado em Zona Sul', time: '12 min atrás' },
  { id: 'alert-3', type: 'success', message: 'Meta mensal atingida em 75%', time: '1 hora atrás' },
];

export function AdminDashboard() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-[#24305f] to-[#4b5f9e] p-6 sm:p-8 text-white shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Resumo da plataforma</h2>
        <p className="text-white/85">Acompanhe indicadores e acesse rapidamente as principais tabelas administrativas.</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center justify-center size-11 rounded-xl bg-[#f0e8ff] dark:bg-violet-950">
                <stat.icon className="size-6 text-[#5a34a1] dark:text-violet-400" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">{stat.change}</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">{stat.value}</p>
            <p className="text-gray-600 dark:text-slate-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {QUICK_LINKS.map(({ to, label, description, icon: Icon, colorClass }) => (
          <Link
            key={to}
            to={to}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md"
          >
            <span className={`inline-flex items-center justify-center size-11 rounded-xl mb-4 ${colorClass}`}>
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h3 className="text-xl mb-2 text-gray-900 dark:text-white">{label}</h3>
            <p className="text-gray-600 dark:text-slate-400">{description}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <AlertCircle className="size-6 text-[#5a34a1]" aria-hidden="true" />
          Alertas Recentes
        </h2>
        <div className="space-y-3">
          {RECENT_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${ALERT_COLOR[alert.type]}`} aria-hidden="true" />
                <span className="text-gray-700 dark:text-slate-300">{alert.message}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-slate-400 shrink-0">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}