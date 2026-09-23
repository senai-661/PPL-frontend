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
  const [editandoCarro, setEditandoCarro] = useState<VeiculoDTO | null>(null);
  const [excluindoCarro, setExcluindoCarro] = useState<VeiculoDTO | null>(null);
  const [acaoLoading, setAcaoLoading] = useState(false);
  const [formEdit, setFormEdit] = useState({
    placa: '',
    modeloVeiculo: '',
    tipoVeiculo: '',
  });

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

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoCarro?.idVeiculo) return;
    setAcaoLoading(true);
    const sucesso = await CarroRequest.enviarFormularioAtualizacaoCarro({
      idVeiculo: editandoCarro.idVeiculo,
      ...formEdit,
    });
    setAcaoLoading(false);
    if (sucesso) {
      setEditandoCarro(null);
      fetchCarros();
    } else {
      alert('Erro ao atualizar veículo.');
    }
  };

  const handleConfirmarExclusao = async () => {
    if (!excluindoCarro?.idVeiculo) return;
    setAcaoLoading(true);
    const sucesso = await CarroRequest.removerCarro(excluindoCarro.idVeiculo);
    setAcaoLoading(false);
    if (sucesso) {
      setExcluindoCarro(null);
      fetchCarros();
    } else {
      alert('Erro ao excluir veículo.');
    }
  };


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
      <div className="rounded-2xl border border-white/60 bg-gradient-to-r from-[#17406f] to-[#1f5d9f] p-6 text-white shadow-lg dark:from-slate-900 dark:to-slate-800 dark:border-slate-700">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm uppercase tracking-[0.16em]">Frota</p>
            <h2 className="text-2xl sm:text-3xl font-semibold">Tabela de Carros</h2>
            <p className="text-white/90 mt-2">Acompanhe os veiculos cadastrados e seus respectivos motoristas.</p>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-3 text-right min-w-[120px] dark:bg-slate-800/70">
            <p className="text-xs text-white/80">Total</p>
            <p className="text-3xl font-semibold leading-none">{carros.length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:bg-slate-950 dark:border-slate-700">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 sm:px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
          <p className="text-sm text-gray-600 dark:text-slate-300">Lista completa de carros vinculados na plataforma.</p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Pesquisar por nome/modelo..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-[#1f5d9f] focus:ring-2 focus:ring-[#1f5d9f]/20 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
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
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
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
                  <tr key={c.idVeiculo} className="border-t border-gray-100 transition-colors dark:border-slate-700">
                    <td className="px-4 py-3 text-gray-800 dark:text-slate-100">{c.idVeiculo ?? '-'}</td>
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
                          onClick={() => {
                            setEditandoCarro(c);
                            setFormEdit({
                              placa: c.placa ?? '',
                              modeloVeiculo: c.modeloVeiculo ?? '',
                              tipoVeiculo: c.tipoVeiculo ?? 'Carro',
                            });
                          }}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Atualizar
                        </button>
                        <button
                          type="button"
                          onClick={() => setExcluindoCarro(c)}
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

      {/* Modal de Edição */}
      {editandoCarro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Atualizar Veículo #{editandoCarro.idVeiculo}
            </h3>
            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Placa</label>
                <input
                  type="text"
                  value={formEdit.placa}
                  onChange={(e) => setFormEdit({ ...formEdit, placa: e.target.value.toUpperCase() })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Modelo do Veículo</label>
                <input
                  type="text"
                  value={formEdit.modeloVeiculo}
                  onChange={(e) => setFormEdit({ ...formEdit, modeloVeiculo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Tipo de Veículo</label>
                <select
                  value={formEdit.tipoVeiculo}
                  onChange={(e) => setFormEdit({ ...formEdit, tipoVeiculo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
                >
                  <option value="Carro">Carro</option>
                  <option value="Carro Adaptado">Carro Adaptado</option>
                  <option value="Van">Van</option>
                  <option value="Moto">Moto</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditandoCarro(null)}
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
      {excluindoCarro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Excluir Veículo</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Tem certeza que deseja excluir o veículo placa <strong>{excluindoCarro.placa}</strong> ({excluindoCarro.modeloVeiculo})?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setExcluindoCarro(null)}
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

export default TabelaCarros;


