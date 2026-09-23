import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, RefreshCw, Search, Users } from 'lucide-react';
import PassageiroRequest from '../../fetch/PassageiroRequest';
import { PassageiroDTO } from '../../dto/PassageiroDTO';

const formatarCpf = (valor?: string | null): string => {
  if (!valor) return '-';

  const digits = valor.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '-';

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.replace(/(\d{3})(\d+)/, '$1.$2');
  if (digits.length <= 9) return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatarTelefone = (valor?: string | null): string => {
  if (!valor) return '-';

  const digits = valor.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '-';

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return digits.replace(/(\d{2})(\d+)/, '($1) $2');
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');

  return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

const TabelaPassageiros: React.FC = () => {
  const navigate = useNavigate();
  const [passageiros, setPassageiros] = useState<PassageiroDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editandoPassageiro, setEditandoPassageiro] = useState<PassageiroDTO | null>(null);
  const [excluindoPassageiro, setExcluindoPassageiro] = useState<PassageiroDTO | null>(null);
  const [acaoLoading, setAcaoLoading] = useState(false);
  const [formEdit, setFormEdit] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    celular: '',
    cpf: '',
  });

  const fetchPassageiros = useCallback(async () => {
    setLoading(true);
    setErro(null);
    const lista = await PassageiroRequest.listarPassageiros();
    if (lista) {
      setPassageiros(lista);
    } else {
      setErro('Erro ao buscar passageiros');
    }
    setLoading(false);
  }, []);

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoPassageiro?.idPassageiro) return;
    setAcaoLoading(true);
    const sucesso = await PassageiroRequest.atualizarPassageiroPorAdmin(
      editandoPassageiro.idPassageiro,
      formEdit
    );
    setAcaoLoading(false);
    if (sucesso) {
      setEditandoPassageiro(null);
      fetchPassageiros();
    } else {
      alert('Erro ao atualizar passageiro.');
    }
  };

  const handleConfirmarExclusao = async () => {
    if (!excluindoPassageiro?.idPassageiro) return;
    setAcaoLoading(true);
    const sucesso = await PassageiroRequest.removerPassageiro(excluindoPassageiro.idPassageiro);
    setAcaoLoading(false);
    if (sucesso) {
      setExcluindoPassageiro(null);
      fetchPassageiros();
    } else {
      alert('Erro ao excluir passageiro.');
    }
  };


  useEffect(() => {
    fetchPassageiros();
  }, [fetchPassageiros]);

  const filteredPassageiros = useMemo(() => {
    const termo = searchQuery.trim().toLowerCase();
    if (!termo) return passageiros;

    return passageiros.filter((p) => {
      const nome = ((p as any).nomePassageiro ?? p.nome ?? '').toString().toLowerCase();
      const sobrenome = ((p as any).sobrenomePassageiro ?? p.sobrenome ?? '').toString().toLowerCase();
      const nomeCompleto = `${nome} ${sobrenome}`.trim();
      return nomeCompleto.includes(termo);
    });
  }, [passageiros, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="rounded-2xl border border-white/60 bg-gradient-to-r from-[#1f6c6a] to-[#2f8e8b] p-6 text-white shadow-lg dark:from-slate-900 dark:to-slate-800 dark:border-slate-700">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm uppercase tracking-[0.16em]">Comunidade</p>
            <h2 className="text-2xl sm:text-3xl font-semibold">Tabela de Passageiros</h2>
            <p className="text-white/90 mt-2">Visualize os usuarios passageiros cadastrados na plataforma.</p>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-3 text-right min-w-[120px] dark:bg-slate-800/70">
            <p className="text-xs text-white/80">Total</p>
            <p className="text-3xl font-semibold leading-none">{passageiros.length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:bg-slate-950 dark:border-slate-700">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 sm:px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
          <p className="text-sm text-gray-600 dark:text-slate-300">Registros de passageiros para consulta administrativa.</p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Pesquisar por nome..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-[#1f6c6a] focus:ring-2 focus:ring-[#1f6c6a]/20 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              />
            </div>
            <button
              type="button"
              onClick={fetchPassageiros}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition "
            >
              <RefreshCw className="size-4" />
              Atualizar
            </button>
          </div>
        </div>

        {loading && (
          <div className="px-6 py-16 text-center text-gray-600 flex items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin text-[#1f6c6a]" />
            Carregando passageiros...
          </div>
        )}

        {!loading && erro && (
          <div className="px-6 py-12">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex items-center gap-2">
              <AlertCircle className="size-5" />
              <span>{erro}</span>
            </div>
          </div>
        )}

        {!loading && !erro && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-sm">
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold">CPF</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Celular</th>
                  <th className="px-4 py-3 text-left font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPassageiros.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-gray-500" colSpan={6}>
                      {searchQuery.trim()
                        ? `Nenhum passageiro encontrado para "${searchQuery.trim()}".`
                        : 'Nenhum passageiro encontrado.'}
                    </td>
                  </tr>
                )}
                {filteredPassageiros.map((p) => {
                  const nome = (p as any).nomePassageiro ?? p.nome;
                  const sobrenome = (p as any).sobrenomePassageiro ?? p.sobrenome;
                  return (
                    <tr
                      key={p.idPassageiro}
                      className="border-t border-gray-100 transition-colors dark:border-slate-700"
                    >
                      <td className="px-4 py-3 text-gray-800 dark:text-slate-100">{p.idPassageiro ?? '-'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 font-medium text-gray-900">
                          <span className="inline-flex size-7 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                            <Users className="size-4" />
                          </span>
                          {[nome, sobrenome].filter(Boolean).join(' ') || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{formatarCpf(p.cpf)}</td>
                      <td className="px-4 py-3 text-gray-700">{p.email || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{formatarTelefone(p.celular)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/administrador/tabela-passageiros/${p.idPassageiro}`, { state: p })}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                          >
                            Detalhes
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditandoPassageiro(p);
                              setFormEdit({
                                nome: (p as any).nomePassageiro ?? p.nome ?? '',
                                sobrenome: (p as any).sobrenomePassageiro ?? p.sobrenome ?? '',
                                email: p.email ?? '',
                                celular: p.celular ?? '',
                                cpf: p.cpf ?? '',
                              });
                            }}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                          >
                            Atualizar
                          </button>
                          <button
                            type="button"
                            onClick={() => setExcluindoPassageiro(p)}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {editandoPassageiro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Atualizar Passageiro #{editandoPassageiro.idPassageiro}
            </h3>
            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Nome</label>
                <input
                  type="text"
                  value={formEdit.nome}
                  onChange={(e) => setFormEdit({ ...formEdit, nome: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Sobrenome</label>
                <input
                  type="text"
                  value={formEdit.sobrenome}
                  onChange={(e) => setFormEdit({ ...formEdit, sobrenome: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={formEdit.email}
                  onChange={(e) => setFormEdit({ ...formEdit, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Celular</label>
                <input
                  type="text"
                  value={formEdit.celular}
                  onChange={(e) => setFormEdit({ ...formEdit, celular: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditandoPassageiro(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={acaoLoading}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {acaoLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {excluindoPassageiro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Excluir Passageiro</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Tem certeza que deseja excluir o passageiro{' '}
              <strong>
                {[(excluindoPassageiro as any).nomePassageiro ?? excluindoPassageiro.nome, (excluindoPassageiro as any).sobrenomePassageiro ?? excluindoPassageiro.sobrenome].filter(Boolean).join(' ')}
              </strong>
              ? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setExcluindoPassageiro(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={acaoLoading}
                onClick={handleConfirmarExclusao}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {acaoLoading ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TabelaPassageiros;


