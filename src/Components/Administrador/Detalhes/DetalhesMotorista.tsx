import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, ShieldCheck, UserRound } from 'lucide-react';
import MotoristaRequest from '../../../fetch/MotoristaRequest';
import { MotoristaDTO } from '../../../dto/MotoristaDTO';

export function DetalhesMotorista() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const initialMotorista = location.state as MotoristaDTO | null;
  const [motorista, setMotorista] = useState<MotoristaDTO | null>(initialMotorista ?? null);
  const [loading, setLoading] = useState(!initialMotorista);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (initialMotorista) {
      setMotorista(initialMotorista);
      setLoading(false);
      return;
    }

    const buscar = async () => {
      if (!id) {
        setErro('ID do motorista inválido.');
        setLoading(false);
        return;
      }

      const idMotorista = Number(id);
      if (Number.isNaN(idMotorista)) {
        setErro('ID do motorista inválido.');
        setLoading(false);
        return;
      }

      const resultado = await MotoristaRequest.consultarMotorista(idMotorista);
      if (!resultado) {
        setErro('Não foi possível carregar os detalhes do motorista.');
      } else {
        setMotorista(resultado);
      }
      setLoading(false);
    };

    buscar();
  }, [id, initialMotorista]);

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
        <div className="rounded-2xl bg-gradient-to-r from-violet-700 to-purple-900 px-5 py-4 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.2em] text-violet-200">Detalhes do motorista</p>
          <h1 className="text-2xl font-semibold">Motorista #{id}</h1>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600 shadow-sm">
          <Loader2 className="mx-auto mb-3 size-7 animate-spin text-[#7b5eb6]" />
          Carregando detalhes...
        </div>
      ) : erro ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          <AlertCircle className="size-5 mb-3" />
          <p>{erro}</p>
        </div>
      ) : motorista ? (
        <div className="grid gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                <UserRound className="size-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Dados completos do motorista cadastrado.</p>
                <h2 className="text-2xl font-semibold text-slate-900">{motorista.nome} {motorista.sobrenome}</h2>
              </div>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">ID do motorista</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{motorista.idMotorista ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">CPF</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{motorista.cpf || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">CNH</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{motorista.cnh || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Email</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{motorista.email || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Celular</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{motorista.celular || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Especialização</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{motorista.especializacao || '-'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-slate-500">Antecedentes criminosos</dt>
                <dd className="mt-1 rounded-2xl bg-slate-50 p-4 text-slate-800">{motorista.antecedentesCriminais || 'Nenhum registro informado.'}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-800">
              <ShieldCheck className="size-5 text-slate-500" />
              <p className="text-sm">Verifique os dados antes de aprovar alterações ou bloqueios.</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
