import { DollarSign, Loader2, MapPin, Navigation, X } from 'lucide-react';
import type { LatLngTuple } from 'leaflet';
import { useEffect, useRef, useState, type FormEvent } from 'react';

import { SERVER_CFG } from '../../../appConfig';
import MapRequests, { type RouteData } from '../../../fetch/MapRequest';
import { useToast } from '../../../hooks/useToast';
import { AguardandoMotorista } from '../../Viagem/AguardandoMotorista/AguardandoMotorista';
import {
  AddressAutocomplete,
  type AutocompleteAddress,
} from '../../Viagem/AddressAutocomplete/AddressAutocomplete';
import { MapComponent, type MapPoint } from '../../Viagem/MapComponent/MapComponent';

interface UberLikeLayoutProps {
  userType: 'passenger' | 'driver';
  onRequestRide?: (data: RideRequestData) => void;
}

export interface RideRequestData {
  origin: string;
  destination: string;
  originCoords?: LatLngTuple | null;
  destinationCoords?: LatLngTuple | null;
  passengers?: number;
  notes?: string;
  rideType?: string;
}

interface AguardandoCorridaState {
  ativo: boolean;
  id: number | null;
  origem: string;
  destino: string;
  preco: number;
}

const DEFAULT_CENTER: LatLngTuple = [-23.55052, -46.633308];

function toLatLngTuple(lat: number, lng: number): LatLngTuple {
  return [lat, lng];
}

function toRoutePoint(position: LatLngTuple): [number, number] {
  return [position[0], position[1]];
}

const AGUARDANDO_CORRIDA_INICIAL: AguardandoCorridaState = {
  ativo: false,
  id: null,
  origem: '',
  destino: '',
  preco: 0,
};

// Função para calcular preço com base nas coordenadas e tipo de serviço
const calcularPrecoPorCoordenadas = (origin: LatLngTuple | null, destination: LatLngTuple | null, rideType: string): number => {
  if (!origin || !destination) return 15.0;
  
  const R = 6371;
  const lat1 = origin[0] * Math.PI / 180;
  const lat2 = destination[0] * Math.PI / 180;
  const dlat = (destination[0] - origin[0]) * Math.PI / 180;
  const dlng = (destination[1] - origin[1]) * Math.PI / 180;
  
  const a = Math.sin(dlat/2) * Math.sin(dlat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dlng/2) * Math.sin(dlng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distancia = R * c;
  
  let multiplicador = 1.0;
  switch (rideType) {
    case 'Convencional':
      multiplicador = 1.0;
      break;
    case 'Premium':
      multiplicador = 1.8;
      break;
    case 'EconoComigo':
      multiplicador = 0.7;
      break;
    default:
      multiplicador = 1.0;
  }
  
  return (4.5 + distancia * 1.5) * multiplicador;
};

export function UberLikeLayout({ userType, onRequestRide }: UberLikeLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RideRequestData>({
    origin: '',
    destination: '',
    passengers: 1,
    notes: '',
    rideType: 'Convencional',
  });
  const [originPosition, setOriginPosition] = useState<LatLngTuple | null>(null);
  const [destinationPosition, setDestinationPosition] = useState<LatLngTuple | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [selectedOriginAddress, setSelectedOriginAddress] = useState<AutocompleteAddress | null>(null);
  const [selectedDestinationAddress, setSelectedDestinationAddress] = useState<AutocompleteAddress | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [estimatedDistance, setEstimatedDistance] = useState<string | null>(null);
  const [aguardandoCorrida, setAguardandoCorrida] = useState<AguardandoCorridaState>(
    AGUARDANDO_CORRIDA_INICIAL,
  );

  // Estado para agendamento
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const token = localStorage.getItem('token');
  const pollingIntervalRef = useRef<number | null>(null);
  const { success, error: showError, info, warning } = useToast();

  // Função para obter o preço atual baseado no tipo de serviço
  const getPrecoAtual = (): number => {
    return calcularPrecoPorCoordenadas(originPosition, destinationPosition, formData.rideType ?? 'Convencional');
  };

  const getPrecoFormatado = (): string => {
    const preco = getPrecoAtual();
    return `R$ ${preco.toFixed(2)}`;
  };

  const clearPollingInterval = () => {
    if (pollingIntervalRef.current !== null) {
      window.clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const resetAguardandoCorrida = () => {
    setAguardandoCorrida(AGUARDANDO_CORRIDA_INICIAL);
  };

  const handleOriginChange = (value: string) => {
    setFormData((current) => ({ ...current, origin: value }));

    if (selectedOriginAddress?.display_name !== value) {
      setSelectedOriginAddress(null);
    }
  };

  const handleDestinationChange = (value: string) => {
    setFormData((current) => ({ ...current, destination: value }));

    if (selectedDestinationAddress?.display_name !== value) {
      setSelectedDestinationAddress(null);
    }
  };

  const handleOriginSelect = (address: AutocompleteAddress) => {
    setSelectedOriginAddress(address);
    setOriginPosition(toLatLngTuple(address.lat, address.lon));
  };

  const handleDestinationSelect = (address: AutocompleteAddress) => {
    setSelectedDestinationAddress(address);
    setDestinationPosition(toLatLngTuple(address.lat, address.lon));
  };

  useEffect(() => {
    return () => {
      clearPollingInterval();
    };
  }, []);

  useEffect(() => {
    if (userType !== 'passenger') return;

    const verificarCorridaPendente = async () => {
      try {
        const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/passageiro/corrida-atual`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const data = await response.json();

        if (data && data.idCorrida && data.statusCorrida === 'Pendente') {
          setAguardandoCorrida({
            ativo: true,
            id: data.idCorrida,
            origem: data.origemCorrida,
            destino: data.destinoCorrida,
            preco: data.preco,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar corrida pendente:', error);
      }
    };

    verificarCorridaPendente();
  }, [userType, token]);

  const verificarStatusCorrida = async (corridaId: number) => {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/${corridaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (data.statusCorrida === 'Aceito' || data.statusCorrida === 'Em andamento') {
        clearPollingInterval();
        resetAguardandoCorrida();
        success(`Corrida aceita! O motorista ${data.motorista?.nome || 'esta'} a caminho.`);
      }

      if (data.statusCorrida === 'Cancelada') {
        clearPollingInterval();
        resetAguardandoCorrida();
        info('Sua solicitacao foi cancelada.');
      }
    } catch (error) {
      console.error('Erro ao verificar status da corrida:', error);
    }
  };

  const iniciarPollingCorrida = (corridaId: number) => {
    clearPollingInterval();
    pollingIntervalRef.current = window.setInterval(() => {
      void verificarStatusCorrida(corridaId);
    }, 5000);
  };

  const handleCancelarAguardando = async () => {
    const corridaId = aguardandoCorrida.id;
    clearPollingInterval();

    if (!corridaId) {
      resetAguardandoCorrida();
      return;
    }

    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/atual`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.mensagem || 'Erro ao cancelar solicitacao');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao cancelar solicitacao';
      showError(message);
    } finally {
      resetAguardandoCorrida();
    }
  };

  // Funções de agendamento
  const handleAgendarClick = () => {
    if (!formData.origin.trim()) {
      warning('Digite o local de partida');
      return;
    }
    if (!formData.destination.trim()) {
      warning('Digite o local de destino');
      return;
    }
    if (!originPosition || !destinationPosition) {
      info('Aguardando localização dos endereços. Tente novamente.');
      return;
    }
    setShowScheduleModal(true);
  };

  const confirmarAgendamento = () => {
    if (!scheduleDate) {
      warning('Selecione uma data');
      return;
    }
    if (!scheduleTime) {
      warning('Selecione um horário');
      return;
    }

    const servicoNome = formData.rideType ?? 'Convencional';
    const precoFinal = getPrecoFormatado();

    const novoAgendamento = {
      id: Date.now(),
      origin: formData.origin,
      destination: formData.destination,
      date: scheduleDate,
      time: scheduleTime,
      price: precoFinal,
      service: servicoNome,
      status: 'agendado',
      createdAt: new Date().toISOString(),
    };

    const saved = localStorage.getItem('openline_agendamentos');
    const agendamentosSalvos = saved ? JSON.parse(saved) : [];
    agendamentosSalvos.push(novoAgendamento);
    localStorage.setItem('openline_agendamentos', JSON.stringify(agendamentosSalvos));
    
    setShowScheduleModal(false);
    setScheduleDate('');
    setScheduleTime('');
    
    success(`✅ Viagem agendada com sucesso para ${scheduleDate} às ${scheduleTime}!`);
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      dates.push({ value: date.toISOString().split('T')[0], label: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${date.getDate()}/${date.getMonth() + 1}` });
    }
    return dates;
  };

  const getAvailableTimes = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      times.push(`${i.toString().padStart(2, '0')}:00`);
      times.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  useEffect(() => {
    let isMounted = true;

    const timerId = window.setTimeout(async () => {
      const origin = formData.origin.trim();
      const destination = formData.destination.trim();

      if (!origin && !destination) {
        setOriginPosition(null);
        setDestinationPosition(null);
        setIsMapLoading(false);
        setEstimatedTime(null);
        setEstimatedDistance(null);
        return;
      }

      setIsMapLoading(true);

      try {
        const originPromise = origin
          ? selectedOriginAddress?.display_name === origin
            ? Promise.resolve({
                lat: selectedOriginAddress.lat,
                lng: selectedOriginAddress.lon,
                label: selectedOriginAddress.display_name,
              })
            : MapRequests.geocodeAddress(origin)
          : Promise.resolve(null);

        const destinationPromise = destination
          ? selectedDestinationAddress?.display_name === destination
            ? Promise.resolve({
                lat: selectedDestinationAddress.lat,
                lng: selectedDestinationAddress.lon,
                label: selectedDestinationAddress.display_name,
              })
            : MapRequests.geocodeAddress(destination)
          : Promise.resolve(null);

        const [resolvedOrigin, resolvedDestination] = await Promise.all([
          originPromise,
          destinationPromise,
        ]);

        if (!isMounted) {
          return;
        }

        setOriginPosition(
          resolvedOrigin ? toLatLngTuple(resolvedOrigin.lat, resolvedOrigin.lng) : null,
        );
        setDestinationPosition(
          resolvedDestination
            ? toLatLngTuple(resolvedDestination.lat, resolvedDestination.lng)
            : null,
        );

        if (resolvedOrigin && resolvedDestination && userType === 'passenger') {
          const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/preco-estimado`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latOrigem: resolvedOrigin.lat,
              lngOrigem: resolvedOrigin.lng,
              latDestino: resolvedDestination.lat,
              lngDestino: resolvedDestination.lng,
              tipoCorrida: formData.rideType ?? 'Convencional',
            }),
          });

          if (response.ok) {
            const data = await response.json();

            if (!isMounted) {
              return;
            }

            setEstimatedTime(
              typeof data.duracaoEstimadaMin === 'number'
                ? `${data.duracaoEstimadaMin} min`
                : null,
            );
            setEstimatedDistance(
              typeof data.distanciaKm === 'number'
                ? `${data.distanciaKm.toFixed(1)} km`
                : null,
            );
          }
        } else if (isMounted) {
          setEstimatedTime(null);
          setEstimatedDistance(null);
        }
      } catch (error) {
        if (isMounted) {
          setEstimatedTime(null);
          setEstimatedDistance(null);
        }
        console.error('Erro ao preparar dados da corrida:', error);
      } finally {
        if (isMounted) {
          setIsMapLoading(false);
        }
      }
    }, 800);

    return () => {
      isMounted = false;
      window.clearTimeout(timerId);
    };
  }, [
    formData.destination,
    formData.origin,
    formData.rideType,
    selectedDestinationAddress,
    selectedOriginAddress,
    userType,
  ]);

  useEffect(() => {
    let isMounted = true;

    const calculateRoute = async () => {
      if (!originPosition || !destinationPosition) {
        setRouteData(null);
        setIsRouteLoading(false);
        return;
      }

      setIsRouteLoading(true);

      try {
        const route = await MapRequests.calculateRoute(
          toRoutePoint(originPosition),
          toRoutePoint(destinationPosition),
        );

        if (isMounted) {
          setRouteData(route);
        }
      } catch (error) {
        if (isMounted) {
          setRouteData(null);
        }
        console.error('Erro ao calcular rota da viagem:', error);
      } finally {
        if (isMounted) {
          setIsRouteLoading(false);
        }
      }
    };

    void calculateRoute();

    return () => {
      isMounted = false;
    };
  }, [destinationPosition, originPosition]);

  const handleRequestRide = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.origin || !formData.destination) {
      warning('Por favor, preencha a origem e o destino');
      return;
    }

    if (!originPosition || !destinationPosition) {
      info('Aguardando localizacao dos enderecos. Tente novamente.');
      return;
    }

    if (userType !== 'passenger') {
      onRequestRide?.({
        ...formData,
        originCoords: originPosition,
        destinationCoords: destinationPosition,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origemCorrida: formData.origin,
          destinoCorrida: formData.destination,
          latOrigem: originPosition[0],
          lngOrigem: originPosition[1],
          latDestino: destinationPosition[0],
          lngDestino: destinationPosition[1],
          tipoCorrida: formData.rideType ?? 'Convencional',
          numPassageiros: formData.passengers ?? 1,
          observacoes: formData.notes ?? null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || 'Erro ao solicitar viagem');
      }

      setAguardandoCorrida({
        ativo: true,
        id: data.idCorrida ?? null,
        origem: formData.origin,
        destino: formData.destination,
        preco: data.preco ?? getPrecoAtual(),
      });

      if (data.idCorrida) {
        iniciarPollingCorrida(data.idCorrida);
      }

      onRequestRide?.({
        ...formData,
        originCoords: originPosition,
        destinationCoords: destinationPosition,
      });

      setFormData({
        origin: '',
        destination: '',
        passengers: 1,
        notes: '',
        rideType: 'Convencional',
      });
      setOriginPosition(null);
      setDestinationPosition(null);
      setSelectedOriginAddress(null);
      setSelectedDestinationAddress(null);
      setRouteData(null);
      setEstimatedTime(null);
      setEstimatedDistance(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao solicitar viagem';
      
      if (message.includes('corrida em andamento')) {
        alert(message);
        setLoading(false);
        return;
      }
      
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const swapLocations = () => {
    setFormData((current) => ({
      ...current,
      origin: current.destination,
      destination: current.origin,
    }));
    setSelectedOriginAddress(selectedDestinationAddress);
    setSelectedDestinationAddress(selectedOriginAddress);
    setOriginPosition(destinationPosition);
    setDestinationPosition(originPosition);
  };

  const mapPoints: MapPoint[] = [];

  if (originPosition) {
    mapPoints.push({
      id: 'origin',
      label: 'Origem',
      position: originPosition,
      color: '#16a34a',
      description: formData.origin,
    });
  }

  if (destinationPosition) {
    mapPoints.push({
      id: 'destination',
      label: 'Destino',
      position: destinationPosition,
      color: '#dc2626',
      description: formData.destination,
    });
  }

  const tripRoute = routeData?.coordinates;
  const mapCenter = destinationPosition ?? originPosition ?? DEFAULT_CENTER;

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <div
        className={`${
          isExpanded ? 'w-96' : 'w-20'
        } bg-white shadow-lg transition-all duration-300 overflow-y-auto flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isExpanded && <h2 className="text-xl font-bold text-[#5a34a1]">OpenLine</h2>}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? <X className="size-5" /> : <Navigation className="size-5" />}
          </button>
        </div>

        {isExpanded && (
          <>
            <div className="flex-1 p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {userType === 'passenger' ? 'Solicitar Viagem' : 'Disponivel para Viagens'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {userType === 'passenger'
                    ? 'Para onde voce quer ir?'
                    : 'Sua localizacao atual esta sendo compartilhada'}
                </p>
              </div>

              <form onSubmit={handleRequestRide} className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Origem
                  </label>
                  <AddressAutocomplete
                    value={formData.origin}
                    onChange={handleOriginChange}
                    onSelect={handleOriginSelect}
                    placeholder="Digite sua rua, avenida ou bairro"
                    iconColor="text-green-600"
                    maxSuggestions={6}
                    required
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={swapLocations}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Trocar origem e destino"
                  >
                    <Navigation className="size-5 text-gray-600 rotate-90" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Destino
                  </label>
                  <AddressAutocomplete
                    value={formData.destination}
                    onChange={handleDestinationChange}
                    onSelect={handleDestinationSelect}
                    placeholder="Para onde voce quer ir?"
                    iconColor="text-red-600"
                    maxSuggestions={6}
                    required
                  />
                </div>

                {userType === 'passenger' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tipo de Corrida
                      </label>
                      <select
                        value={formData.rideType}
                        onChange={(e) =>
                          setFormData((current) => ({
                            ...current,
                            rideType: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#5a34a1] transition-colors"
                      >
                        <option value="Convencional">Convencional</option>
                        <option value="Premium">Premium</option>
                        <option value="EconoComigo">EconoComigo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Numero de Passageiros
                      </label>
                      <select
                        value={formData.passengers}
                        onChange={(e) =>
                          setFormData((current) => ({
                            ...current,
                            passengers: Number.parseInt(e.target.value, 10),
                          }))
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#5a34a1] transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Passageiro' : 'Passageiros'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Observacoes (opcional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData((current) => ({ ...current, notes: e.target.value }))
                        }
                        placeholder="Ex: Tenho muitas malas, precisamos de carro grande..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#5a34a1] transition-colors resize-none h-20"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#5a34a1] hover:bg-[#4a2a85] text-white font-bold py-4 rounded-lg transition-colors text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="size-5 animate-spin" />}
                    {loading
                      ? 'Solicitando...'
                      : userType === 'passenger'
                        ? 'Solicitar Viagem'
                        : 'Ativar Modo Online'}
                  </button>
                  
                  {userType === 'passenger' && (
                    <button
                      type="button"
                      onClick={handleAgendarClick}
                      className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center gap-2"
                    >
                      📅 Agendar
                    </button>
                  )}
                </div>
              </form>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-3">ATALHOS</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((current) => ({
                        ...current,
                        origin: 'Av. Paulista, 1000, Sao Paulo',
                      }))
                    }
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <MapPin className="size-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700">Av. Paulista</p>
                      <p className="text-xs text-gray-500 truncate">
                        Av. Paulista, 1000 - Bela Vista, SP
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((current) => ({
                        ...current,
                        destination: 'Shopping Ibirapuera, Sao Paulo',
                      }))
                    }
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <MapPin className="size-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700">Shopping Ibirapuera</p>
                      <p className="text-xs text-gray-500 truncate">
                        Av. Ibirapuera, 3103 - SP
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 relative bg-gray-300 overflow-hidden">
        <MapComponent
          center={mapCenter}
          zoom={12}
          points={mapPoints}
          route={tripRoute}
          loading={isMapLoading}
          emptyTitle="Mapa da viagem"
          emptySubtitle={
            userType === 'passenger'
              ? 'Digite origem e destino para visualizar o trajeto no mapa.'
              : 'Sua area de atuacao aparecera aqui quando houver localizacao.'
          }
        />

        {userType === 'passenger' && formData.destination && (
          <div className="absolute left-6 top-6 z-10 w-[min(290px,calc(100%-3rem))] overflow-hidden rounded-2xl border border-[#e6ddf7] bg-white/92 shadow-[0_16px_40px_rgba(90,52,161,0.16)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/92 dark:shadow-[0_18px_45px_rgba(15,23,42,0.45)]">
            <div className="bg-gradient-to-r from-[#f6f1ff] via-white to-[#fbf8ff] px-4 py-2.5 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7b65aa] dark:text-slate-300">
                Resumo da corrida
              </p>
            </div>

            <div className="p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="mb-1 text-[11px] font-semibold text-gray-500 dark:text-slate-400">
                    PRECO ESTIMADO
                  </p>
                  <p className="text-2xl font-bold text-[#5a34a1] dark:text-[#c7b5f3]">
                    {getPrecoFormatado()}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f3edff] p-2.5 text-[#5a34a1] dark:bg-slate-800 dark:text-[#c7b5f3]">
                  <DollarSign className="size-4.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-sm dark:border-slate-800">
                <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-slate-800/80">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-slate-500">
                    Tempo
                  </p>
                  <p className="mt-1 font-semibold text-gray-700 dark:text-slate-200">
                    {isRouteLoading
                      ? 'Calculando...'
                      : routeData
                        ? `~${MapRequests.formatDuration(routeData.duration)}`
                        : estimatedTime
                          ? `~${estimatedTime}`
                          : '--'}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-slate-800/80">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-slate-500">
                    Distancia
                  </p>
                  <p className="mt-1 font-semibold text-gray-700 dark:text-slate-200">
                    {isRouteLoading
                      ? 'Calculando...'
                      : routeData
                        ? MapRequests.formatDistance(routeData.distance)
                        : estimatedDistance
                          ? `~${estimatedDistance}`
                          : '--'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {userType === 'driver' && (
          <div className="absolute top-6 right-6 z-10 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-3 bg-green-600 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-gray-700">Voce esta online</span>
            </div>
            <p className="text-xs text-gray-600">Aguardando solicitacoes proximas...</p>
          </div>
        )}
      </div>

      {aguardandoCorrida.ativo && aguardandoCorrida.id && (
        <AguardandoMotorista
          corridaId={aguardandoCorrida.id}
          origem={aguardandoCorrida.origem}
          destino={aguardandoCorrida.destino}
          preco={aguardandoCorrida.preco}
          onCancelar={handleCancelarAguardando}
        />
      )}

      {/* Modal de Agendamento */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-3xl max-w-md w-full mx-4 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Agendar Viagem</h3>
                  <p className="text-purple-100 text-sm">Escolha quando você quer viajar</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-dashed border-gray-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🚗</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Sua viagem</p>
                    <p className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">
                      {formData.origin || '📍 Origem'} → {formData.destination || '🏁 Destino'}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Preço estimado</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {getPrecoFormatado()}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">📅</span> Data da viagem
                </label>
                <select
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white text-gray-700"
                >
                  <option value="">Selecione uma data</option>
                  {getAvailableDates().map((date) => (
                    <option key={date.value} value={date.value}>{date.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">⏰</span> Horário da viagem
                </label>
                <select
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white text-gray-700"
                >
                  <option value="">Selecione um horário</option>
                  {getAvailableTimes().map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">ℹ️</span>
                  <p className="text-sm font-semibold text-amber-800">Sobre o agendamento</p>
                </div>
                <ul className="text-xs text-amber-700 space-y-2">
                  <li className="flex items-center gap-2">✓ Agende com até 30 dias de antecedência</li>
                  <li className="flex items-center gap-2">✓ Tempo de espera extra incluído</li>
                  <li className="flex items-center gap-2">✓ Cancele sem custo com até 60 minutos de antecedência</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarAgendamento}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}