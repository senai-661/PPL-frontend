import { User, Mail, Phone, Car, Star, MapPin, Edit, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SERVER_CFG } from '../../appConfig';

interface PerfilData {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  cnh: string;
  celular: string;
  dataNascimento: string;
  especializacao: string;
  disponivel: boolean;
}

interface VeiculoData {
  idVeiculo: number;
  placa: string;
  tipoVeiculo: string;
  modeloVeiculo: string;
}

interface StatsData {
  mediaAvaliacao: number | null;
  totalCorridas: number;
  ganhosTotais: number;
  criadoEm?: string;
}

export function DriverProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);

  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [veiculo, setVeiculo] = useState<VeiculoData | null>(null);
  const [stats, setStats] = useState<StatsData>({
    mediaAvaliacao: null,
    totalCorridas: 0,
    ganhosTotais: 0,
  });

  // Campos editáveis no formulário
  const [form, setForm] = useState({
    celular: '',
    email: '',
    especializacao: '',
    senha: '',
    confirmarSenha: '',
  });

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // ── Buscar perfil ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      setErro(null);
      try {
        // 1. Perfil do motorista
        const resPerfil = await fetch(`${SERVER_CFG.SERVER_URL}/api/motorista/perfil`, { headers });
        if (!resPerfil.ok) throw new Error('Não foi possível carregar o perfil.');
        const dadosPerfil: PerfilData = await resPerfil.json();
        setPerfil(dadosPerfil);
        setForm({
          celular: dadosPerfil.celular ?? '',
          email: dadosPerfil.email ?? '',
          especializacao: dadosPerfil.especializacao ?? '',
          senha: '',
          confirmarSenha: '',
        });

        // 2. Veículo do motorista
        const resVeiculo = await fetch(`${SERVER_CFG.SERVER_URL}/api/veiculos`, { headers });
        if (resVeiculo.ok) {
          const listaVeiculos: VeiculoData[] = await resVeiculo.json();
          if (listaVeiculos.length > 0) setVeiculo(listaVeiculos[0]);
        }

        // 3. Resumo/relatório do motorista para stats
        const resRelatorio = await fetch(`${SERVER_CFG.SERVER_URL}/api/motorista/relatorio`, { headers });
        if (resRelatorio.ok) {
          const relatorio = await resRelatorio.json();
          setStats({
            mediaAvaliacao: relatorio.mediaAvaliacao ?? null,
            totalCorridas: relatorio.totalCorridas ?? 0,
            ganhosTotais: relatorio.ganhosTotais ?? 0,
            criadoEm: relatorio.criadoEm,
          });
        }
      } catch (e: any) {
        setErro(e.message ?? 'Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  // ── Salvar alterações ──────────────────────────────────────────────────────
  async function salvarAlteracoes() {
    if (form.senha && form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    // Regex celular: (XX) 9XXXX-XXXX
    const regexCelular = /^\([1-9]{2}\) 9[0-9]{4}-[0-9]{4}$/;
    if (form.celular && !regexCelular.test(form.celular)) {
      setErro('Celular inválido. Use o formato (XX) 9XXXX-XXXX.');
      return;
    }

    setSaving(true);
    setErro(null);
    setSucessoMsg(null);

    try {
      const payload: Record<string, string> = {};
      if (form.celular !== perfil?.celular) payload.celular = form.celular;
      if (form.email !== perfil?.email) payload.email = form.email;
      if (form.especializacao !== perfil?.especializacao) payload.especializacao = form.especializacao;
      if (form.senha) payload.senha = form.senha;

      if (Object.keys(payload).length === 0) {
        setErro('Nenhuma alteração detectada.');
        setSaving(false);
        return;
      }

      const res = await fetch(`${SERVER_CFG.SERVER_URL}/api/motorista/perfil`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mensagem ?? 'Erro ao salvar alterações.');
      }

      // Atualiza estado local
      setPerfil((prev) => prev ? { ...prev, ...payload } : prev);
      setSucessoMsg('Perfil atualizado com sucesso!');
      setIsEditing(false);
      setForm((f) => ({ ...f, senha: '', confirmarSenha: '' }));
    } catch (e: any) {
      setErro(e.message ?? 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  // ── Cancelar edição ────────────────────────────────────────────────────────
  function cancelarEdicao() {
    if (!perfil) return;
    setForm({
      celular: perfil.celular ?? '',
      email: perfil.email ?? '',
      especializacao: perfil.especializacao ?? '',
      senha: '',
      confirmarSenha: '',
    });
    setErro(null);
    setIsEditing(false);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function formatarGanhos(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

function formatarData(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.getFullYear().toString(); // Retorna só o ano
}

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#5a34a1]">
          <Loader2 className="size-10 animate-spin" />
          <p className="text-lg">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-red-600">
          <AlertCircle className="size-10" />
          <p className="text-lg">{erro ?? 'Não foi possível carregar o perfil.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">

        {/* Feedback */}
        {erro && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="size-5 shrink-0" />
            <p>{erro}</p>
          </div>
        )}
        {sucessoMsg && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {sucessoMsg}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="bg-white text-[#5a34a1] w-24 h-24 rounded-full flex items-center justify-center text-4xl font-semibold">
                  {perfil.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl mb-1">{perfil.nome} {perfil.sobrenome}</h1>
                  <p className="text-white/80">Motorista Parceiro OpenLine</p>
                  {stats.mediaAvaliacao !== null && (
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="size-5 text-yellow-300" />
                      <span className="text-xl">{stats.mediaAvaliacao.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => (isEditing ? cancelarEdicao() : setIsEditing(true))}
                className="bg-white text-[#5a34a1] px-6 py-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-purple-50"
              >
                <Edit className="size-4" />
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </div>
          </div>

          {/* ── Stats ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 border-b">
            <div className="text-center">
              <p className="text-3xl text-[#5a34a1] mb-1">
                {stats.mediaAvaliacao !== null ? stats.mediaAvaliacao.toFixed(1) : '—'}
              </p>
              <p className="text-gray-600 text-sm">Avaliação</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-[#5a34a1] mb-1">{stats.totalCorridas}</p>
              <p className="text-gray-600 text-sm">Viagens</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-[#5a34a1] mb-1">{formatarGanhos(stats.ganhosTotais)}</p>
              <p className="text-gray-600 text-sm">Ganhos Totais</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-[#5a34a1] mb-1">{formatarData(stats.criadoEm)}</p>
              <p className="text-gray-600 text-sm">Desde</p>
            </div>
          </div>

          {/* ── Informações Pessoais ─────────────────────────────────────── */}
          <div className="p-8 border-b">
            <h2 className="text-2xl mb-6">Informações Pessoais</h2>
            <div className="grid md:grid-cols-2 gap-6">

              {/* Nome (somente leitura) */}
              <div className="flex items-center gap-3">
                <User className="size-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Nome Completo</p>
                  <p className="text-gray-900">{perfil.nome} {perfil.sobrenome}</p>
                </div>
              </div>

              {/* CPF (somente leitura) */}
              <div className="flex items-center gap-3">
                <User className="size-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">CPF</p>
                  <p className="text-gray-900">{perfil.cpf}</p>
                </div>
              </div>

              {/* CNH (somente leitura) */}
              <div className="flex items-center gap-3">
                <Car className="size-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">CNH</p>
                  <p className="text-gray-900">{perfil.cnh}</p>
                </div>
              </div>

              {/* E-mail */}
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">E-mail</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 mt-1 w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{perfil.email}</p>
                  )}
                </div>
              </div>

              {/* Celular */}
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Celular</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={form.celular}
                      placeholder="(11) 91234-5678"
                      onChange={(e) => setForm({ ...form, celular: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 mt-1 w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{perfil.celular}</p>
                  )}
                </div>
              </div>

              {/* Especialização */}
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Especialização</p>
                  {isEditing ? (
                    <select
                      value={form.especializacao}
                      onChange={(e) => setForm({ ...form, especializacao: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 mt-1 w-full"
                    >
                      <option value="NENHUMA">Nenhuma</option>
                      <option value="CADEIRANTE">Cadeirante</option>
                      <option value="VISUAL">Deficiência Visual</option>
                      <option value="AUDITIVA">Deficiência Auditiva</option>
                      <option value="COGNITIVA">Deficiência Cognitiva</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{perfil.especializacao || 'Nenhuma'}</p>
                  )}
                </div>
              </div>

              {/* Senha (só no modo edição) */}
              {isEditing && (
                <>
                  <div className="flex items-center gap-3">
                    <User className="size-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Nova Senha <span className="text-gray-400">(opcional)</span></p>
                      <input
                        type="password"
                        value={form.senha}
                        onChange={(e) => setForm({ ...form, senha: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 mt-1 w-full"
                        placeholder="Deixe em branco para não alterar"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="size-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Confirmar Nova Senha</p>
                      <input
                        type="password"
                        value={form.confirmarSenha}
                        onChange={(e) => setForm({ ...form, confirmarSenha: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 mt-1 w-full"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {isEditing && (
              <button
                onClick={salvarAlteracoes}
                disabled={saving}
                className="mt-6 bg-[#5a34a1] text-white px-6 py-3 rounded-lg transition-colors hover:bg-[#4a2891] disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <Loader2 className="size-4 animate-spin" />}
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            )}
          </div>

          {/* ── Veículo ──────────────────────────────────────────────────── */}
          <div className="p-8">
            <h2 className="text-2xl mb-6 flex items-center gap-2">
              <Car className="size-6 text-[#5a34a1]" />
              Veículo Cadastrado
            </h2>
            {veiculo ? (
              <div className="bg-gray-50 p-6 rounded-lg grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Placa</p>
                  <p className="text-gray-900 text-lg">{veiculo.placa}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="text-gray-900 text-lg">{veiculo.tipoVeiculo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Modelo</p>
                  <p className="text-gray-900 text-lg">{veiculo.modeloVeiculo}</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-gray-500 text-center">
                Nenhum veículo cadastrado ainda.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}