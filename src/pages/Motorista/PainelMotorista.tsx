import { DollarSign, MapPin, Star, TrendingUp, Clock, Car, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SERVER_CFG } from '../../appConfig';

interface ResumoDia {
  ganhosDia: number;
  viagensDia: number;
  horasOnline: number;
  mediaAvaliacao: number | null;
}

interface CorridaResumo {
  idCorrida: number;
  nomePassageiro?: string;
  origemCorrida: string;
  destinoCorrida: string;
  preco: number;
  dataCorrida: string;
  statusCorrida: string;
}

interface GanhoDia {
  dia: string;
  total: number;
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function DriverDashboard() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [disponivel, setDisponivel] = useState(false);
  const [togglingDisp, setTogglingDisp] = useState(false);

  const [resumo, setResumo] = useState<ResumoDia>({
    ganhosDia: 0,
    viagensDia: 0,
    horasOnline: 0,
    mediaAvaliacao: null,
  });
  const [corridasRecentes, setCorridasRecentes] = useState<CorridaResumo[]>([]);
  const [ganhosSemana, setGanhosSemana] = useState<GanhoDia[]>([]);
  const [nomeMotorista, setNomeMotorista] = useState('Motorista');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // ── Carregar dados ─────────────────────────────────────────────────────────
  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      setErro(null);
      try {
        // 1. Perfil (para nome e disponibilidade)
        const resPerfil = await fetch(`${SERVER_CFG.SERVER_URL}/api/motorista/perfil`, { headers });
        if (resPerfil.ok) {
          const perfil = await resPerfil.json();
          setNomeMotorista(perfil.nome ?? 'Motorista');
          setDisponivel(perfil.disponivel ?? false);
        }

        // 2. Resumo do dia
        const resResumo = await fetch(`${SERVER_CFG.SERVER_URL}/api/motorista/resumo-dia`, { headers });
        if (resResumo.ok) {
          const dados = await resResumo.json();
          setResumo({
            ganhosDia: dados.ganhosDia ?? 0,
            viagensDia: dados.viagensDia ?? 0,
            horasOnline: dados.horasOnline ?? 0,
            mediaAvaliacao: dados.mediaAvaliacao ?? null,
          });
        }

        // 3. Histórico de corridas (últimas 3)
        const resHistorico = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/historico`, { headers });
        if (resHistorico.ok) {
          const lista: CorridaResumo[] = await resHistorico.json();
          setCorridasRecentes(lista.slice(0, 3));

          // Montar gráfico de ganhos por dia da semana
          const agora = new Date();
          const ganhosPorDia: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
          lista.forEach((c) => {
            const data = new Date(c.dataCorrida);
            const diffDias = Math.floor((agora.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDias <= 6 && c.statusCorrida === 'Finalizada') {
              const diaSemana = data.getDay();
              ganhosPorDia[diaSemana] = (ganhosPorDia[diaSemana] ?? 0) + (c.preco ?? 0);
            }
          });

          const semana = DIAS_SEMANA.map((dia, idx) => ({
            dia,
            total: ganhosPorDia[idx] ?? 0,
          }));
          setGanhosSemana(semana);
        }
      } catch (e: any) {
        setErro(e.message ?? 'Erro ao carregar painel.');
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  // ── Alternar disponibilidade ───────────────────────────────────────────────
  async function toggleDisponibilidade() {
    setTogglingDisp(true);
    try {
      const novoStatus = !disponivel;
      const res = await fetch(`${SERVER_CFG.SERVER_URL}/api/motorista/disponibilidade`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ disponivel: novoStatus }),
      });
      if (res.ok) {
        setDisponivel(novoStatus);
      }
    } catch (e) {
      console.error('Erro ao alterar disponibilidade:', e);
    } finally {
      setTogglingDisp(false);
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function formatarHoras(horas: number) {
    const h = Math.floor(horas);
    const m = Math.round((horas - h) * 60);
    return `${h}h ${m > 0 ? `${m}min` : ''}`.trim();
  }

  function formatarHorario(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // Altura proporcional para o gráfico
  const maxGanho = Math.max(...ganhosSemana.map((g) => g.total), 1);

  const stats = [
    {
      label: 'Ganhos Hoje',
      value: formatarMoeda(resumo.ganhosDia),
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      label: 'Viagens Hoje',
      value: String(resumo.viagensDia),
      icon: MapPin,
      color: 'text-blue-600',
    },
    {
      label: 'Avaliação',
      value: resumo.mediaAvaliacao !== null ? `${resumo.mediaAvaliacao.toFixed(1)} ⭐` : '— ⭐',
      icon: Star,
      color: 'text-yellow-600',
    },
    {
      label: 'Horas Online',
      value: formatarHoras(resumo.horasOnline),
      icon: Clock,
      color: 'text-purple-600',
    },
  ];

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#5a34a1]">
          <Loader2 className="size-10 animate-spin" />
          <p className="text-lg">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl mb-2">Olá, {nomeMotorista}!</h1>
              <p className="text-white/80">Bem-vindo ao seu painel</p>
            </div>
            <button
              onClick={toggleDisponibilidade}
              disabled={togglingDisp}
              className={`px-8 py-4 rounded-full text-lg transition-all flex items-center gap-2 disabled:opacity-60 ${
                disponivel
                  ? 'bg-green-400 text-white hover:bg-green-500'
                  : 'bg-white text-[#5a34a1] hover:bg-purple-50'
              }`}
            >
              {togglingDisp ? (
                <Loader2 className="size-5 animate-spin" />
              ) : disponivel ? (
                <Wifi className="size-5" />
              ) : (
                <WifiOff className="size-5" />
              )}
              {disponivel ? 'Online' : 'Ficar Online'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Erro não fatal */}
        {erro && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="size-5 shrink-0" />
            <p>{erro}</p>
          </div>
        )}

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
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

        {/* ── Links rápidos ─────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/motorista/perfil" className="bg-white p-6 rounded-lg shadow transition-shadow hover:shadow-md">
            <Star className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Meu Perfil</h3>
            <p className="text-gray-600">Visualizar e editar informações</p>
          </Link>
          <Link to="/viagem/lista" className="bg-white p-6 rounded-lg shadow transition-shadow hover:shadow-md">
            <MapPin className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Histórico de Viagens</h3>
            <p className="text-gray-600">Ver todas as corridas</p>
          </Link>
          <Link to="/motorista/cadastro-carro" className="bg-white p-6 rounded-lg shadow transition-shadow hover:shadow-md">
            <Car className="size-10 text-[#5a34a1] mb-3" />
            <h3 className="text-xl mb-2">Meu Veículo</h3>
            <p className="text-gray-600">Gerenciar veículo</p>
          </Link>
        </div>

        {/* ── Viagens Recentes ──────────────────────────────────────────────── */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Viagens Recentes</h2>
          {corridasRecentes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma viagem registrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {corridasRecentes.map((c) => (
                <div
                  key={c.idCorrida}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      #{c.idCorrida} • {formatarHorario(c.dataCorrida)}
                    </p>
                    {c.nomePassageiro && (
                      <p className="mb-1">{c.nomePassageiro}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {c.origemCorrida} → {c.destinoCorrida}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg text-[#5a34a1]">{formatarMoeda(c.preco)}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        c.statusCorrida === 'Finalizada'
                          ? 'bg-green-100 text-green-700'
                          : c.statusCorrida === 'Cancelada'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {c.statusCorrida}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Gráfico de Ganhos ─────────────────────────────────────────────── */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4 flex items-center gap-2">
            <TrendingUp className="size-6 text-[#5a34a1]" />
            Ganhos da Semana
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {ganhosSemana.map(({ dia, total }) => {
              const altura = maxGanho > 0 ? Math.max((total / maxGanho) * 100, total > 0 ? 5 : 0) : 0;
              return (
                <div key={dia} className="flex-1 flex flex-col items-center group relative">
                  {total > 0 && (
                    <span className="absolute bottom-full mb-1 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatarMoeda(total)}
                    </span>
                  )}
                  <div
                    className="w-full bg-[#5a34a1] rounded-t transition-all"
                    style={{ height: `${altura}%`, minHeight: altura > 0 ? '4px' : '0' }}
                  />
                  <p className="text-sm text-gray-600 mt-2">{dia}</p>
                </div>
              );
            })}
          </div>
          {ganhosSemana.every((g) => g.total === 0) && (
            <p className="text-center text-gray-400 text-sm mt-2">Nenhum ganho registrado esta semana.</p>
          )}
        </div>

      </div>
    </div>
  );
}
