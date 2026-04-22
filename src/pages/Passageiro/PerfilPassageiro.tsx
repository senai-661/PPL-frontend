import { User, Mail, Phone, MapPin, Edit, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SERVER_CFG } from '../../appConfig';

interface PerfilData {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  celular: string;
  dataNascimento: string;
  endereco?: string;
  necessidadesEspeciais?: string;
}

interface StatsData {
  totalViagens: number;
  totalGasto: number;
  destinoFavorito?: string;
  desde: string;
}

export function PassengerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [stats, setStats] = useState<StatsData>({
    totalViagens: 0,
    totalGasto: 0,
    destinoFavorito: '---',
    desde: '',
  });

  // Campos editáveis no formulário
  const [form, setForm] = useState({
    celular: '',
    email: '',
    endereco: '',
    necessidadesEspeciais: '',
    senha: '',
    confirmarSenha: '',
  });

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // ✅ Função para formatar celular automaticamente
  const formatarCelular = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  };

  // ✅ Validação de celular
  const validarCelular = (celular: string): boolean => {
    const regex = /^\([1-9]{2}\) 9[0-9]{4}-[0-9]{4}$/;
    return regex.test(celular);
  };

  // ✅ Formatar celular enquanto digita
  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatado = formatarCelular(e.target.value);
    setForm({ ...form, celular: formatado });
  };

  // ── Buscar perfil ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      setError(null);
      try {
        // 1. Perfil do passageiro
        const resPerfil = await fetch(`${SERVER_CFG.SERVER_URL}/api/passageiro/perfil`, { headers });
        if (!resPerfil.ok) throw new Error('Não foi possível carregar o perfil.');
        const dadosPerfil: PerfilData = await resPerfil.json();
        setPerfil(dadosPerfil);
        setForm({
          celular: dadosPerfil.celular ?? '',
          email: dadosPerfil.email ?? '',
          endereco: dadosPerfil.endereco ?? '',
          necessidadesEspeciais: dadosPerfil.necessidadesEspeciais ?? '',
          senha: '',
          confirmarSenha: '',
        });

        // 2. Stats do passageiro (viagens, gastos, etc)
        const resStats = await fetch(`${SERVER_CFG.SERVER_URL}/api/passageiro/relatorio`, { headers });
        if (resStats.ok) {
          const dadosStats = await resStats.json();
          setStats({
            totalViagens: dadosStats.totalViagens ?? 0,
            totalGasto: dadosStats.totalGasto ?? 0,
            destinoFavorito: dadosStats.destinoFavorito ?? '---',
            desde: dadosStats.desde ?? new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
          });
        }
      } catch (e: any) {
        setError(e.message ?? 'Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  // ── Salvar alterações ──────────────────────────────────────────────────────
  async function salvarAlteracoes() {
    if (form.senha && form.senha !== form.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    // Validação do celular
    if (form.celular && !validarCelular(form.celular)) {
      setError('Celular inválido. Use o formato (XX) 9XXXX-XXXX');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload: Record<string, string> = {};
      if (form.celular !== perfil?.celular) payload.celular = form.celular;
      if (form.email !== perfil?.email) payload.email = form.email;
      if (form.endereco !== perfil?.endereco) payload.endereco = form.endereco;
      if (form.necessidadesEspeciais !== perfil?.necessidadesEspeciais) payload.necessidadesEspeciais = form.necessidadesEspeciais;
      if (form.senha) payload.senha = form.senha;

      if (Object.keys(payload).length === 0) {
        setError('Nenhuma alteração detectada.');
        setSaving(false);
        return;
      }

      const res = await fetch(`${SERVER_CFG.SERVER_URL}/api/passageiro/perfil`, {
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
      setSuccessMsg('Perfil atualizado com sucesso!');
      setIsEditing(false);
      setForm((f) => ({ ...f, senha: '', confirmarSenha: '' }));
      
      // Limpa mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      setError(e.message ?? 'Erro ao salvar.');
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
      endereco: perfil.endereco ?? '',
      necessidadesEspeciais: perfil.necessidadesEspeciais ?? '',
      senha: '',
      confirmarSenha: '',
    });
    setError(null);
    setIsEditing(false);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function formatarData(iso?: string) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
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
          <p className="text-lg">{error ?? 'Não foi possível carregar o perfil.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Feedback */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="size-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {successMsg}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="bg-white text-[#5a34a1] w-24 h-24 rounded-full flex items-center justify-center text-4xl font-semibold">
                  {perfil.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl mb-2">{perfil.nome} {perfil.sobrenome}</h1>
                  <p className="text-white/80">Passageiro OpenLine</p>
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

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 p-8 border-b">
            <div className="text-center">
              <p className="text-3xl text-[#5a34a1] mb-1">{stats.totalViagens}</p>
              <p className="text-gray-600 text-sm">Viagens</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-[#5a34a1] mb-1">{formatarMoeda(stats.totalGasto)}</p>
              <p className="text-gray-600 text-sm">Total Gasto</p>
            </div>
            <div className="text-center">
              <p className="text-xl text-[#5a34a1] mb-1 truncate">{stats.destinoFavorito}</p>
              <p className="text-gray-600 text-sm">Destino Favorito</p>
            </div>
            <div className="text-center">
              <p className="text-xl text-[#5a34a1] mb-1">{stats.desde}</p>
              <p className="text-gray-600 text-sm">Desde</p>
            </div>
          </div>

          {/* Informações Pessoais */}
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
                      onChange={handleCelularChange}
                      placeholder="(11) 91234-5678"
                      className="border border-gray-300 rounded px-2 py-1 mt-1 w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{perfil.celular}</p>
                  )}
                </div>
              </div>

              {/* Endereço */}
              <div className="flex items-center gap-3 md:col-span-2">
                <MapPin className="size-5 text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Endereço</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={form.endereco}
                      onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 mt-1 w-full"
                      placeholder="Seu endereço completo"
                    />
                  ) : (
                    <p className="text-gray-900">{perfil.endereco || 'Não informado'}</p>
                  )}
                </div>
              </div>

              {/* Necessidades Especiais */}
              <div className="flex items-center gap-3 md:col-span-2">
                <MapPin className="size-5 text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Necessidades Especiais</p>
                  {isEditing ? (
                    <textarea
                      value={form.necessidadesEspeciais}
                      onChange={(e) => setForm({ ...form, necessidadesEspeciais: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 mt-1 w-full"
                      rows={2}
                      placeholder="Descreva suas necessidades de acessibilidade (opcional)"
                    />
                  ) : (
                    <p className="text-gray-900">{perfil.necessidadesEspeciais || 'Nenhuma necessidade especial informada'}</p>
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

          {/* Métodos de Pagamento */}
          <div className="p-8">
            <h2 className="text-2xl mb-6 flex items-center gap-2">
              <CreditCard className="size-6 text-[#5a34a1]" />
              Métodos de Pagamento
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900">**** **** **** 1234</p>
                    <p className="text-sm text-gray-500">Cartão de Crédito - Principal</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Editar
                </button>
              </div>
              
              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#5a34a1] hover:text-[#5a34a1] transition-colors">
                + Adicionar Método de Pagamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}