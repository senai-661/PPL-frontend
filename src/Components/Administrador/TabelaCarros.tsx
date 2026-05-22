import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Car, Loader2, RefreshCw, Search } from 'lucide-react';
import CarroRequest from '../../fetch/CarroRequest';
import { VeiculoDTO } from '../../dto/VeiculoDTO';

const TabelaCarros: React.FC = () => {
  const navigate = useNavigate();
  const [carros, setCarros] = useState<VeiculoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCarros = useCallback(async () => {
    setLoading(true);
    setErro(null);
    const lista = await CarroRequest.listarCarros();
    if (lista) {
      setCarros(Array.isArray(lista) ? lista : [lista]);
    } else {
      setErro('Erro ao buscar carros');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCarros();
  }, [fetchCarros]);

  const filteredCarros = useMemo(() => {
    const termo = searchQuery.trim().toLowerCase();
    if (!termo) return carros;

    return carros.filter((c) => {
      const nomeModelo = (c.modeloVeiculo ?? '').toLowerCase();
      const tipo = (c.tipoVeiculo ?? '').toLowerCase();
      return nomeModelo.includes(termo) || tipo.includes(termo);
    });
  }, [carros, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="rounded-2xl border border-white/60 bg-gradient-to-r from-[#17406f] to-[#1f5d9f] p-6 text-white shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm uppercase tracking-[0.16em]">Frota</p>
            <h2 className="text-2xl sm:text-3xl font-semibold">Tabela de Carros</h2>
            <p className="text-white/90 mt-2">Acompanhe os veiculos cadastrados e seus respectivos motoristas.</p>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-3 text-right min-w-[120px]">
            <p className="text-xs text-white/80">Total</p>
            <p className="text-3xl font-semibold leading-none">{carros.length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 sm:px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">Lista completa de carros vinculados na plataforma.</p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Pesquisar por nome/modelo..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-[#1f5d9f] focus:ring-2 focus:ring-[#1f5d9f]/20"
              />
            </div>
            <button
              type="button"
              onClick={fetchCarros}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition "
            >
              <RefreshCw className="size-4" />
              Atualizar
            </button>
          </div>
        </div>

        {loading && (
          <div className="px-6 py-16 text-center text-gray-600 flex items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin text-[#1f5d9f]" />
            Carregando carros...
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
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Placa</th>
                  <th className="px-4 py-3 text-left font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-left font-semibold">Modelo</th>
                  <th className="px-4 py-3 text-left font-semibold">ID Motorista</th>
                  <th className="px-4 py-3 text-left font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCarros.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-gray-500" colSpan={6}>
                      {searchQuery.trim()
                        ? `Nenhum carro encontrado para "${searchQuery.trim()}".`
                        : 'Nenhum carro encontrado.'}
                    </td>
                  </tr>
                )}
                {filteredCarros.map((c) => (
                  <tr key={c.idVeiculo} className="border-t border-gray-100  transition-colors">
                    <td className="px-4 py-3 text-gray-800">{c.idVeiculo ?? '-'}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{c.placa || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                        <Car className="size-3.5" />
                        {c.tipoVeiculo || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{c.modeloVeiculo || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{c.idMotorista ?? '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/administrador/tabela-carros/${c.idVeiculo}`, { state: c })}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                        >
                          Detalhes
                        </button>
                        <button
                          type="button"
                          onClick={() => window.alert(`Atualizar carro ${c.idVeiculo ?? '-'} ainda não implementado.`)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Atualizar
                        </button>
                        <button
                          type="button"
                          onClick={() => window.alert(`Excluir carro ${c.idVeiculo ?? '-'} ainda não implementado.`)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default TabelaCarros;

