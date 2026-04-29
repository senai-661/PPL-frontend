import { Loader2, MapPin, Car, Clock } from 'lucide-react';

interface AguardandoMotoristaProps {
  corridaId: number;
  origem: string;
  destino: string;
  preco: number;
  onCancelar?: () => void;
}

export function AguardandoMotorista({
  corridaId,
  origem,
  destino,
  preco,
  onCancelar,
}: AguardandoMotoristaProps) {
  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <Loader2 className="size-12 text-[#5a34a1] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Car className="size-5 text-[#5a34a1]" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Aguardando motorista
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Estamos procurando um motorista próximo para você
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Origem</p>
                <p className="text-sm font-semibold text-gray-800">{origem}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Destino</p>
                <p className="text-sm font-semibold text-gray-800">{destino}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="size-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Preço</p>
                <p className="text-sm font-semibold text-gray-800">{formatarMoeda(preco)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-[#5a34a1] h-2 rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-xs text-gray-500">
              ID da corrida: #{corridaId}
            </p>
          </div>

          {onCancelar && (
            <button
              onClick={onCancelar}
              className="mt-6 w-full border border-red-500 text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Cancelar solicitação
            </button>
          )}
        </div>
      </div>
    </div>
  );
}