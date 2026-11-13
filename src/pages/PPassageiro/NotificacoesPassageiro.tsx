import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronLeft,
  CircleCheck,
  Clock3,
  Inbox,
  Trash2,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notificacao {
  id: number;
  corridaId?: number;
  status?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

type FiltroNotificacoes = 'todas' | 'nao-lidas' | 'lidas';
type NotificationTone = 'emerald' | 'rose' | 'blue' | 'violet';
const STORAGE_KEY = 'openline_notificacoes';

function parseNotificacoes(value: string | null): Notificacao[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Notificacao =>
        typeof item?.id === 'number' &&
        typeof item?.message === 'string' &&
        typeof item?.createdAt === 'string',
    ).map((item) => ({
      ...item,
      read: Boolean(item.read),
      status: typeof item.status === 'string'
        ? item.status.toLowerCase()
        : /aceita/i.test(item.message)
          ? 'aceito'
          : /recusada/i.test(item.message)
            ? 'recusado'
            : /conclu[ií]da/i.test(item.message)
              ? 'concluido'
              : undefined,
    }));
  } catch {
    return [];
  }
}

function getStatusPresentation(status?: string): {
  title: string;
  label: string;
  icon: typeof CircleCheck;
  tone: NotificationTone;
} {
  switch (status?.toLowerCase()) {
    case 'aceito':
      return {
        title: 'Corrida aceita',
        label: 'Aceita',
        icon: CircleCheck,
        tone: 'emerald',
      };
    case 'recusado':
      return {
        title: 'Corrida recusada',
        label: 'Recusada',
        icon: XCircle,
        tone: 'rose',
      };
    case 'concluido':
      return {
        title: 'Viagem concluída',
        label: 'Concluída',
        icon: CheckCheck,
        tone: 'blue',
      };
    default:
      return {
        title: 'Atualização da viagem',
        label: 'Atualização',
        icon: Bell,
        tone: 'violet',
      };
  }
}

function formatarData(data: string) {
  const date = new Date(data);
  if (Number.isNaN(date.getTime())) return 'Data indisponível';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

const toneClasses = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20',
} as const;

const NotificacoesPassageiro = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [filtro, setFiltro] = useState<FiltroNotificacoes>('todas');

  useEffect(() => {
    setNotificacoes(parseNotificacoes(localStorage.getItem(STORAGE_KEY)));
  }, []);

  const salvarNotificacoes = (novas: Notificacao[]) => {
    setNotificacoes(novas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novas));
  };

  const naoLidas = notificacoes.filter((item) => !item.read).length;
  const lidas = notificacoes.length - naoLidas;

  const notificacoesFiltradas = useMemo(() => {
    const filtradas = notificacoes.filter((item) => {
      if (filtro === 'nao-lidas') return !item.read;
      if (filtro === 'lidas') return item.read;
      return true;
    });

    return [...filtradas].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [filtro, notificacoes]);

  const alternarLeitura = (item: Notificacao) => {
    salvarNotificacoes(notificacoes.map((notification) =>
      notification.id === item.id ? { ...notification, read: !notification.read } : notification,
    ));
  };

  const removerNotificacao = (id: number) => {
    salvarNotificacoes(notificacoes.filter((item) => item.id !== id));
  };

  const limparTodas = () => {
    if (!window.confirm('Tem certeza de que deseja apagar todas as notificações?')) return;
    salvarNotificacoes([]);
  };

  const tabs: { value: FiltroNotificacoes; label: string; count: number }[] = [
    { value: 'todas', label: 'Todas', count: notificacoes.length },
    { value: 'nao-lidas', label: 'Não lidas', count: naoLidas },
    { value: 'lidas', label: 'Lidas', count: lidas },
  ];

  return (
    <section className="min-h-[65vh] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/passageiro/painel"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
        >
          <ChevronLeft className="size-4" aria-hidden="true" /> Voltar ao painel
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#4a2c86] via-[#5a34a1] to-[#7653bd] px-6 py-8 text-white sm:px-8 sm:py-9">
            <div className="pointer-events-none absolute -right-10 -top-20 size-64 rounded-full border-[40px] border-white/5" />
            <div className="relative flex flex-wrap items-start justify-between gap-5">
              <div className="flex items-center gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner">
                  <Bell className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">Central de avisos</p>
                  <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Notificações</h1>
                  <p className="mt-1 text-sm text-white/75">Acompanhe as atualizações das suas viagens.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold backdrop-blur">
                <span className={`size-2 rounded-full ${naoLidas ? 'animate-pulse bg-amber-300' : 'bg-emerald-300'}`} />
                {naoLidas ? `${naoLidas} não ${naoLidas === 1 ? 'lida' : 'lidas'}` : 'Tudo em dia'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-b border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70 sm:gap-4 sm:px-8 sm:py-5">
            {[
              { label: 'Total', value: notificacoes.length, icon: Inbox },
              { label: 'Não lidas', value: naoLidas, icon: Bell },
              { label: 'Lidas', value: lidas, icon: Check },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950/60 sm:gap-3 sm:px-4">
                <span className="hidden size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300 sm:inline-flex">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <strong className="block text-lg leading-5 text-slate-900 dark:text-slate-100">{value}</strong>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">{label}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex w-full rounded-xl bg-slate-100 p-1 dark:bg-slate-800 sm:w-auto" role="group" aria-label="Filtrar notificações">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={filtro === tab.value}
                  onClick={() => setFiltro(tab.value)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition sm:flex-none sm:px-3.5 ${
                    filtro === tab.value
                      ? 'bg-white text-violet-800 shadow-sm dark:bg-slate-950 dark:text-violet-200'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  {tab.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filtro === tab.value ? 'bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200' : 'bg-slate-200/70 text-slate-500 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3">
              {naoLidas > 0 && (
                <button
                  type="button"
                  onClick={() => salvarNotificacoes(notificacoes.map((item) => ({ ...item, read: true })))}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-400/10"
                >
                  <CheckCheck className="size-4" aria-hidden="true" /> Marcar todas como lidas
                </button>
              )}
              {notificacoes.length > 0 && (
                <button
                  type="button"
                  onClick={limparTodas}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 dark:text-slate-400 dark:hover:bg-rose-400/10 dark:hover:text-rose-300"
                >
                  <Trash2 className="size-4" aria-hidden="true" /> Limpar
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3 p-4 sm:p-6">
            {notificacoesFiltradas.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-950/40">
                <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm dark:bg-slate-900 dark:text-slate-500">
                  {notificacoes.length === 0 ? <BellOff className="size-6" /> : <Inbox className="size-6" />}
                </span>
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  {notificacoes.length === 0 ? 'Nenhuma notificação por enquanto' : 'Nada neste filtro'}
                </h2>
                <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  {notificacoes.length === 0
                    ? 'As atualizações sobre suas corridas aparecerão aqui.'
                    : 'Tente outra categoria para encontrar suas notificações.'}
                </p>
              </div>
            ) : (
              notificacoesFiltradas.map((notif) => {
                const config = getStatusPresentation(notif.status);
                const StatusIcon = config.icon;

                return (
                  <article
                    key={notif.id}
                    className={`group rounded-2xl border p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                      !notif.read
                        ? 'border-violet-200 bg-violet-50/50 shadow-sm shadow-violet-950/[0.03] dark:border-violet-400/25 dark:bg-violet-400/[0.06]'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 sm:gap-4">
                      <span className={`relative inline-flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${toneClasses[config.tone]}`}>
                        <StatusIcon className="size-5" aria-hidden="true" />
                        {!notif.read && <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-white bg-violet-600 dark:border-slate-900" />}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className={`text-sm font-bold ${notif.read ? 'text-slate-700 dark:text-slate-200' : 'text-slate-950 dark:text-white'}`}>
                            {config.title}
                          </h2>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${toneClasses[config.tone]}`}>
                            {config.label}
                          </span>
                          {!notif.read && <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Nova</span>}
                        </div>
                        <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {notif.message}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="size-3.5" aria-hidden="true" />
                            <time dateTime={notif.createdAt}>{formatarData(notif.createdAt)}</time>
                          </span>
                          {typeof notif.corridaId === 'number' && (
                            <span>Corrida #{notif.corridaId}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => alternarLeitura(notif)}
                          aria-label={notif.read ? 'Marcar como não lida' : 'Marcar como lida'}
                          title={notif.read ? 'Marcar como não lida' : 'Marcar como lida'}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-violet-100 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:bg-violet-400/10 dark:hover:text-violet-300"
                        >
                          {notif.read ? <Bell className="size-4" /> : <Check className="size-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => removerNotificacao(notif.id)}
                          aria-label="Remover notificação"
                          title="Remover notificação"
                          className="inline-flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-100 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:hover:bg-rose-400/10 dark:hover:text-rose-300"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotificacoesPassageiro;