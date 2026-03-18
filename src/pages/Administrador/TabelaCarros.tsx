import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Car, Loader2, RefreshCw } from 'lucide-react';
import CarroRequest from '../../fetch/CarroRequest';
import { VeiculoDTO } from '../../interface/VeiculoDTO';

const TabelaCarros: React.FC = () => {
  const [carros, setCarros] = useState<VeiculoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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
        <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-4">
          <p className="text-sm text-gray-600">Lista completa de carros vinculados na plataforma.</p>
          <button
            type="button"
            onClick={fetchCarros}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw className="size-4" />
            Atualizar
          </button>
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
                </tr>
              </thead>
              <tbody>
                {carros.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-gray-500" colSpan={5}>
                      Nenhum carro encontrado.
                    </td>
                  </tr>
                )}
                {carros.map((c) => (
                  <tr key={c.idVeiculo} className="border-t border-gray-100 hover:bg-slate-50 transition-colors">
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
