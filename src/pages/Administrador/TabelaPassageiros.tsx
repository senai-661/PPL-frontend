import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Loader2, RefreshCw, Search, Users } from 'lucide-react';
import PassageiroRequest from '../../fetch/PassageiroRequest';
import { PassageiroDTO } from '../../interface/PassageiroDTO';

const TabelaPassageiros: React.FC = () => {
  const [passageiros, setPassageiros] = useState<PassageiroDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      <div className="rounded-2xl border border-white/60 bg-gradient-to-r from-[#1f6c6a] to-[#2f8e8b] p-6 text-white shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm uppercase tracking-[0.16em]">Comunidade</p>
            <h2 className="text-2xl sm:text-3xl font-semibold">Tabela de Passageiros</h2>
            <p className="text-white/90 mt-2">Visualize os usuarios passageiros cadastrados na plataforma.</p>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-3 text-right min-w-[120px]">
            <p className="text-xs text-white/80">Total</p>
            <p className="text-3xl font-semibold leading-none">{passageiros.length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 sm:px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">Registros de passageiros para consulta administrativa.</p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Pesquisar por nome..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-[#1f6c6a] focus:ring-2 focus:ring-[#1f6c6a]/20"
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
              <thead className="bg-slate-100 text-slate-700">
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
                      className="border-t border-gray-100  transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-800">{p.idPassageiro ?? '-'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 font-medium text-gray-900">
                          <span className="inline-flex size-7 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                            <Users className="size-4" />
                          </span>
                          {[nome, sobrenome].filter(Boolean).join(' ') || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{p.cpf || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{p.email || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{p.celular || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => window.alert(`Detalhes do passageiro ${p.idPassageiro ?? '-'} ainda não implementados.`)}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                          >
                            Detalhes
                          </button>
                          <button
                            type="button"
                            onClick={() => window.alert(`Atualizar passageiro ${p.idPassageiro ?? '-'} ainda não implementado.`)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                          >
                            Atualizar
                          </button>
                          <button
                            type="button"
                            onClick={() => window.alert(`Excluir passageiro ${p.idPassageiro ?? '-'} ainda não implementado.`)}
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
    </section>
  );
};

export default TabelaPassageiros;

