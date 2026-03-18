import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Loader2, RefreshCw, UserRound } from 'lucide-react';
import MotoristaRequest from '../../fetch/MotoristaRequest';
import { MotoristaDTO } from '../../interface/MotoristaDTO';

const TabelaMotoristas: React.FC = () => {
  const [motoristas, setMotoristas] = useState<MotoristaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const fetchMotoristas = useCallback(async () => {
    setLoading(true);
    setErro(null);
    const lista = await MotoristaRequest.listarMotoristas();
    if (lista) {
      setMotoristas(lista);
    } else {
      setErro('Erro ao buscar motoristas');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMotoristas();
  }, [fetchMotoristas]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="rounded-2xl border border-white/60 bg-gradient-to-r from-[#5a34a1] to-[#7b5eb6] p-6 text-white shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm uppercase tracking-[0.16em]">Equipe</p>
            <h2 className="text-2xl sm:text-3xl font-semibold">Tabela de Motoristas</h2>
            <p className="text-white/90 mt-2">Visualize os perfis cadastrados para analise administrativa.</p>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-3 text-right min-w-[120px]">
            <p className="text-xs text-white/80">Total</p>
            <p className="text-3xl font-semibold leading-none">{motoristas.length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-4">
          <p className="text-sm text-gray-600">Dados principais para aprovacao e acompanhamento dos motoristas.</p>
          <button
            type="button"
            onClick={fetchMotoristas}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw className="size-4" />
            Atualizar
          </button>
        </div>

        {loading && (
          <div className="px-6 py-16 text-center text-gray-600 flex items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin text-[#5a34a1]" />
            Carregando motoristas...
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
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold">CPF</th>
                  <th className="px-4 py-3 text-left font-semibold">CNH</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Celular</th>
                </tr>
              </thead>
              <tbody>
                {motoristas.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-gray-500" colSpan={6}>
                      Nenhum motorista encontrado.
                    </td>
                  </tr>
                )}
                {motoristas.map((m) => {
                  const nome = (m as any).nomeMotorista ?? m.nome;
                  const sobrenome = (m as any).sobrenomeMotorista ?? m.sobrenome;
                  return (
                    <tr
                      key={m.idMotorista}
                      className="border-t border-gray-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-800">{m.idMotorista ?? '-'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 font-medium text-gray-900">
                          <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#f1ebfe] text-[#5a34a1]">
                            <UserRound className="size-4" />
                          </span>
                          {[nome, sobrenome].filter(Boolean).join(' ') || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{m.cpf || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{m.cnh || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{m.email || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{m.celular || '-'}</td>
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

export default TabelaMotoristas;
