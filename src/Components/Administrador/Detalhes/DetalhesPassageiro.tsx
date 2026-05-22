import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, ShieldCheck, Users } from 'lucide-react';
import PassageiroRequest from '../../../fetch/PassageiroRequest';
import { PassageiroDTO } from '../../../dto/PassageiroDTO';

export function DetalhesPassageiro() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const initialPassageiro = location.state as PassageiroDTO | null;
  const [passageiro, setPassageiro] = useState<PassageiroDTO | null>(initialPassageiro ?? null);
  const [loading, setLoading] = useState(!initialPassageiro);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (initialPassageiro) {
      setPassageiro(initialPassageiro);
      setLoading(false);
      return;
    }

    const buscar = async () => {
      if (!id) {
        setErro('ID do passageiro inválido.');
        setLoading(false);
        return;
      }

      const idPassageiro = Number(id);
      if (Number.isNaN(idPassageiro)) {
        setErro('ID do passageiro inválido.');
        setLoading(false);
        return;
      }

      const resultado = await PassageiroRequest.consultarPassageiro(idPassageiro);
      if (!resultado) {
        setErro('Não foi possível carregar os detalhes do passageiro.');
      } else {
        setPassageiro(resultado);
      }
      setLoading(false);
    };

    buscar();
  }, [id, initialPassageiro]);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </button>
        <div className="rounded-2xl bg-gradient-to-r from-teal-700 to-cyan-900 px-5 py-4 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.2em] text-teal-200">Detalhes do passageiro</p>
          <h1 className="text-2xl font-semibold">Passageiro #{id}</h1>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600 shadow-sm">
          <Loader2 className="mx-auto mb-3 size-7 animate-spin text-[#1f6c6a]" />
          Carregando detalhes...
        </div>
      ) : erro ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          <p>{erro}</p>
        </div>
      ) : passageiro ? (
        <div className="grid gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="rounded-2xl bg-teal-100 p-3 text-teal-700">
                <Users className="size-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Dados completos do passageiro cadastrado.</p>
                <h2 className="text-2xl font-semibold text-slate-900">{passageiro.nome} {passageiro.sobrenome}</h2>
              </div>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">ID do passageiro</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{passageiro.idPassageiro ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">CPF</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{passageiro.cpf || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Email</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{passageiro.email || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Celular</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{passageiro.celular || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Data de nascimento</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{new Date(passageiro.dataNascimento).toLocaleDateString()}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-slate-500">Necessidades</dt>
                <dd className="mt-1 rounded-2xl bg-slate-50 p-4 text-slate-800">{passageiro.necessidades?.length ? passageiro.necessidades.join(', ') : 'Nenhuma necessidade registrada.'}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-800">
              <ShieldCheck className="size-5 text-slate-500" />
              <p className="text-sm">Use esta visão para validar o perfil do passageiro antes de ajustes administrativos.</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
