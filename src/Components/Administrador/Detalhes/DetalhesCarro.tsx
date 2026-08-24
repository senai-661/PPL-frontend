import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Car, Loader2, MapPin, ShieldCheck } from 'lucide-react';
import CarroRequest from '../../../fetch/CarroRequest';
import { VeiculoDTO } from '../../../dto/VeiculoDTO';

export function DetalhesCarro() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const initialCarro = location.state as VeiculoDTO | null;
  const [carro, setCarro] = useState<VeiculoDTO | null>(initialCarro ?? null);
  const [loading, setLoading] = useState(!initialCarro);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (initialCarro) {
      setCarro(initialCarro);
      setLoading(false);
      return;
    }

    const buscar = async () => {
      if (!id) {
        setErro('ID do veículo inválido.');
        setLoading(false);
        return;
      }

      const idVeiculo = Number(id);
      if (Number.isNaN(idVeiculo)) {
        setErro('ID do veículo inválido.');
        setLoading(false);
        return;
      }

      const resultado = await CarroRequest.consultarCarro(idVeiculo);
      if (!resultado) {
        setErro('Não foi possível carregar os detalhes do carro.');
      } else {
        setCarro(resultado);
      }
      setLoading(false);
    };

    buscar();
  }, [id, initialCarro]);

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
        <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Detalhes do veículo</p>
          <h1 className="text-2xl font-semibold">Carro #{id}</h1>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600 shadow-sm">
          <Loader2 className="mx-auto mb-3 size-7 animate-spin text-[#1f5d9f]" />
          Carregando detalhes...
        </div>
      ) : erro ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          <p>{erro}</p>
        </div>
      ) : carro ? (
        <div className="grid gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <Car className="size-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Detalhes completos do veículo cadastrado.</p>
                <h2 className="text-2xl font-semibold text-slate-900">{carro.modeloVeiculo || 'Veículo desconhecido'}</h2>
              </div>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">ID do veículo</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{carro.idVeiculo ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Placa</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{carro.placa || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Tipo</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{carro.tipoVeiculo || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">ID do motorista</dt>
                <dd className="mt-1 text-lg font-medium text-slate-900">{carro.idMotorista ?? '-'}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-800">
              <ShieldCheck className="size-5 text-slate-500" />
              <p className="text-sm">Use este painel para validar o cadastro completo do veículo.</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
