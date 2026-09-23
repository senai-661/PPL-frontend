import { useState, useEffect } from 'react';
import { Loader2, MapPin, Car, Clock, Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { SERVER_CFG } from '../../appConfig';
import { useToast } from '../../hooks/useToast';

interface MotoristaInfo {
  id?: number;
  nome?: string;
  sobrenome?: string;
  celular?: string;
}

interface VeiculoInfo {
  modelo?: string;
  placa?: string;
  tipo?: string;
}

export interface PainelCorridaPassageiroProps {
  corridaId: number;
  origem: string;
  destino: string;
  preco: number;
  statusCorrida: 'Pendente' | 'Aceito' | 'Em andamento' | 'Finalizada' | 'Cancelada';
  motorista?: MotoristaInfo | null;
  veiculo?: VeiculoInfo | null;
  dataInicioCorrida?: string | null;
  onCancelar?: () => void;
  onFinalizarAvaliacao?: () => void;
}

export function PainelCorridaPassageiro({
  corridaId,
  origem,
  destino,
  preco,
  statusCorrida,
  motorista,
  veiculo,
  dataInicioCorrida,
  onCancelar,
  onFinalizarAvaliacao,
}: PainelCorridaPassageiroProps) {
  const { success, error: showError } = useToast();
  const token = localStorage.getItem('token');

  // Estado para cronômetro de tempo decorrido
  const [tempoDecorrido, setTempoDecorrido] = useState<string>('00:00');

  // Estado para avaliação
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = [
    'Motorista educado',
    'Veículo limpo',
    'Direção segura',
    'Pontual',
    'Prestativo',
    'Boa conversa',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Cronômetro para o estado 'Em andamento'
  useEffect(() => {
    if (statusCorrida !== 'Em andamento') return;

    const startTime = dataInicioCorrida ? new Date(dataInicioCorrida).getTime() : Date.now();

    const updateTimer = () => {
      const diffMs = Math.max(0, Date.now() - startTime);
      const totalSegundos = Math.floor(diffMs / 1000);
      const minutos = Math.floor(totalSegundos / 60);
      const segundos = totalSegundos % 60;
      setTempoDecorrido(
        `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [statusCorrida, dataInicioCorrida]);

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Enviar avaliação
  const handleEnviarAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setEnviandoAvaliacao(true);
    try {
      const comentarioCompleto = selectedTags.length > 0
        ? `[${selectedTags.join(', ')}] ${comentario}`.trim()
        : comentario.trim();

      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/avaliacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idCorrida: corridaId,
          nota: rating,
          comentario: comentarioCompleto || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.mensagem || 'Erro ao enviar avaliação');
      }

      success('Obrigado pela sua avaliação!');
      onFinalizarAvaliacao?.();
    } catch (err: any) {
      showError(err.message || 'Erro ao enviar avaliação');
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  const nomeMotorista = motorista
    ? `${motorista.nome || ''} ${motorista.sobrenome || ''}`.trim()
    : 'Motorista OpenLine';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
        
        {/* ESTADO 1: PENDENTE */}
        {statusCorrida === 'Pendente' && (
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
              Estamos procurando um motorista próximo para você...
            </p>
          </div>
        )}

        {/* ESTADO 2: ACEITO */}
        {statusCorrida === 'Aceito' && (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-green-100 p-4 rounded-full text-green-600">
                <CheckCircle className="size-12" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Corrida Aceita!
            </h2>
            <div className="my-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <p className="text-sm text-purple-700 font-medium">Seu motorista é:</p>
              <p className="text-xl font-bold text-[#5a34a1] mt-1">{nomeMotorista}</p>
              {veiculo && (
                <p className="text-xs text-gray-600 mt-1">
                  Veículo: <strong>{veiculo.modelo}</strong> {veiculo.placa && `• Placa: ${veiculo.placa}`}
                </p>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-6 animate-pulse">
              Aguarde o início da corrida pelo motorista.
            </p>
          </div>
        )}

        {/* ESTADO 3: EM ANDAMENTO */}
        {statusCorrida === 'Em andamento' && (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <Car className="size-12 animate-bounce" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Corrida em Andamento
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Motorista: <strong>{nomeMotorista}</strong>
            </p>
            
            {/* TIMER EM TEMPO REAL */}
            <div className="my-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col items-center">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                Tempo Decorrido
              </span>
              <span className="text-4xl font-mono font-bold text-blue-900 tracking-widest">
                {tempoDecorrido}
              </span>
            </div>
          </div>
        )}

        {/* ESTADO 4: FINALIZADA (AVALIAÇÃO) */}
        {statusCorrida === 'Finalizada' && (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
                <ThumbsUp className="size-12" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Como foi sua viagem?
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Avalie seu motorista <strong>{nomeMotorista}</strong>
            </p>

            <form onSubmit={handleEnviarAvaliacao} className="space-y-4">
              <div className="flex justify-center gap-2 my-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`size-10 ${
                        star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-[#5a34a1] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div>
                    <textarea
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5a34a1] resize-none"
                      rows={3}
                      placeholder="Comentário opcional..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enviandoAvaliacao}
                    className="w-full bg-[#5a34a1] text-white font-bold py-3 rounded-lg hover:bg-[#4a2891] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {enviandoAvaliacao && <Loader2 className="size-4 animate-spin" />}
                    {enviandoAvaliacao ? 'Enviando...' : 'Enviar Avaliação'}
                  </button>
                </>
              )}
            </form>
          </div>
        )}

        {/* DETALHES COMUNS DA CORRIDA */}
        {statusCorrida !== 'Finalizada' && (
          <div className="bg-gray-50 rounded-lg p-4 my-4 text-left space-y-3">
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
        )}

        {/* BOTÃO DE CANCELAR (apenas quando Pendente ou Aceito) */}
        {(statusCorrida === 'Pendente' || statusCorrida === 'Aceito') && onCancelar && (
          <button
            onClick={onCancelar}
            className="w-full border border-red-500 text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm"
          >
            Cancelar solicitação
          </button>
        )}
      </div>
    </div>
  );
}
