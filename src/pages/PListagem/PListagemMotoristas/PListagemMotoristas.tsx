import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Loader2, RefreshCw, Search, UserRound } from 'lucide-react';
import MotoristaRequest from '../../../fetch/MotoristaRequest';
import { MotoristaDTO } from '../../../dto/MotoristaDTO';

const TabelaMotoristas: React.FC = () => {
  const [motoristas, setMotoristas] = useState<MotoristaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editMotorista, setEditMotorista] = useState<MotoristaDTO | null>(null);
  const [editForm, setEditForm] = useState({
    nome: '',
    sobrenome: '',
    cpf: '',
    cnh: '',
    email: '',
    celular: '',
    dataNascimento: '',
    senha: '',
    antecedentesCriminais: '',
    especializacao: 'NENHUMA'
  });
  const [saving, setSaving] = useState(false);

  const formatarDataInput = (data: Date | string | undefined): string => {
    if (!data) return '';
    const d = new Date(data);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  const handleEditClick = (m: MotoristaDTO) => {
    setEditMotorista(m);
    setEditForm({
      nome: m.nome || '',
      sobrenome: m.sobrenome || '',
      cpf: m.cpf || '',
      cnh: m.cnh || '',
      email: m.email || '',
      celular: m.celular || '',
      dataNascimento: formatarDataInput(m.dataNascimento),
      senha: '',
      antecedentesCriminais: m.antecedentesCriminais || '',
      especializacao: m.especializacao || 'NENHUMA'
    });
    setIsEditModalOpen(true);
  };

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

  const filteredMotoristas = useMemo(() => {
    const termo = searchQuery.trim().toLowerCase();
    if (!termo) return motoristas;

    return motoristas.filter((m) => {
      const nome = ((m as any).nomeMotorista ?? m.nome ?? '').toString().toLowerCase();
      const sobrenome = ((m as any).sobrenomeMotorista ?? m.sobrenome ?? '').toString().toLowerCase();
      const nomeCompleto = `${nome} ${sobrenome}`.trim();
      return nomeCompleto.includes(termo);
    });
  }, [motoristas, searchQuery]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMotorista || !editMotorista.idMotorista) return;
    setSaving(true);

    const dadosEnvio: any = {
      nome: editForm.nome,
      sobrenome: editForm.sobrenome,
      cpf: editForm.cpf,
      cnh: editForm.cnh,
      email: editForm.email,
      celular: editForm.celular,
      dataNascimento: editForm.dataNascimento ? new Date(editForm.dataNascimento) : undefined,
      antecedentesCriminais: editForm.antecedentesCriminais,
      especializacao: editForm.especializacao
    };

    if (editForm.senha) {
      dadosEnvio.senha = editForm.senha;
    }

    const sucesso = await MotoristaRequest.atualizarMotoristaPorAdmin(editMotorista.idMotorista, dadosEnvio);
    setSaving(false);

    if (sucesso) {
      setIsEditModalOpen(false);
      fetchMotoristas();
    } else {
      window.alert("Erro ao atualizar o motorista.");
    }
  };

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
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 sm:px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">Dados principais para aprovacao e acompanhamento dos motoristas.</p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Pesquisar por nome..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-[#5a34a1] focus:ring-2 focus:ring-[#5a34a1]/20"
              />
            </div>
            <button
              type="button"
              onClick={fetchMotoristas}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition "
            >
              <RefreshCw className="size-4" />
              Atualizar
            </button>
          </div>
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
                  <th className="px-4 py-3 text-left font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredMotoristas.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-gray-500" colSpan={7}>
                      {searchQuery.trim()
                        ? `Nenhum motorista encontrado para "${searchQuery.trim()}".`
                        : 'Nenhum motorista encontrado.'}
                    </td>
                  </tr>
                )}
                {filteredMotoristas.map((m) => {
                  const nome = (m as any).nomeMotorista ?? m.nome;
                  const sobrenome = (m as any).sobrenomeMotorista ?? m.sobrenome;
                  return (
                    <tr
                      key={m.idMotorista}
                      className="border-t border-gray-100  transition-colors"
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
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => window.alert(`Detalhes do motorista ${m.idMotorista ?? '-'} ainda não implementados.`)}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                          >
                            Detalhes
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditClick(m)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                          >
                            Atualizar
                          </button>
                          <button
                            type="button"
                            onClick={() => window.alert(`Excluir motorista ${m.idMotorista ?? '-'} ainda não implementado.`)}
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

      {isEditModalOpen && editMotorista && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-slate-800">Atualizar Motorista</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Nome</label>
                  <input
                    type="text"
                    required
                    value={editForm.nome}
                    onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#5a34a1] focus:ring-2 focus:ring-[#5a34a1]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Sobrenome</label>
                  <input
                    type="text"
                    required
                    value={editForm.sobrenome}
                    onChange={e => setEditForm({ ...editForm, sobrenome: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#5a34a1] focus:ring-2 focus:ring-[#5a34a1]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase">E-mail</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#5a34a1] focus:ring-2 focus:ring-[#5a34a1]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">CPF</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={editForm.cpf}
                    onChange={e => setEditForm({ ...editForm, cpf: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#5a34a1] focus:ring-2 focus:ring-[#5a34a1]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">CNH</label>
                  <input
                    type="text"
                    required
                    value={editForm.cnh}
                    onChange={e => setEditForm({ ...editForm, cnh: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#5a34a1] focus:ring-2 focus:ring-[#5a34a1]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Celular</label>
                  <input
                    type="text"
                    required
                    value={editForm.celular}
                    onChange={e => setEditForm({ ...editForm, celular: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#5a34a1] focus:ring-2 focus:ring-[#5a34a1]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Data de Nascimento</label>
                  <input
                    type="date"
                    required
                    value={editForm.dataNascimento}
                    onChange={e => setEditForm({ ...editForm, dataNascimento: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#5a34a1] focus:ring-2 focus:ring-[#5a34a1]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Nova Senha (Opcional)</label>
                  <input
                    type="password"
                    placeholder="Deixe em branco para manter"
                    value={editForm.senha}
                    onChange={e => setEditForm({ ...editForm, senha: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#5a34a1] focus:ring-2 focus:ring-[#5a34a1]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Especialização</label>
                  <select
                    value={editForm.especializacao}
                    onChange={e => setEditForm({ ...editForm, especializacao: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#5a34a1] focus:ring-2 focus:ring-[#5a34a1]/20"
                  >
                    <option value="NENHUMA">Nenhuma</option>
                    <option value="LIBRAS">Libras</option>
                    <option value="MOBILIDADE REDUZIDA">Mobilidade Reduzida</option>
                    <option value="DEFICIÊNCIA VISUAL">Deficiência Visual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase">Antecedentes Criminais</label>
                <input
                  type="text"
                  required
                  value={editForm.antecedentesCriminais}
                  onChange={e => setEditForm({ ...editForm, antecedentesCriminais: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#5a34a1] focus:ring-2 focus:ring-[#5a34a1]/20"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5a34a1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#482883] disabled:bg-gray-400 transition"
                >
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default TabelaMotoristas;

