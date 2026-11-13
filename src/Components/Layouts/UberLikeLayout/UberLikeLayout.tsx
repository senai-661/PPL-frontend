import { DollarSign, Loader2, MapPin, Navigation, X } from 'lucide-react';
import type { LatLngTuple } from 'leaflet';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { SERVER_CFG } from '@/appConfig';
import MapRequests, { type RouteData } from '@/fetch/MapRequest';
import { useToast } from '@/hooks/useToast';
import { PainelCorridaPassageiro } from '@/Components/Elementos/PainelCorridaPassageiro';
import {
  AddressAutocomplete,
  type AutocompleteAddress,
} from '@/Components/Viagem/AddressAutocomplete/AddressAutocomplete';
import { MapComponent, type MapPoint } from '@/Components/Viagem/MapComponent/MapComponent';
import { loadRideShortcuts } from '@/utils/rideShortcuts';
import { getDashboardText, loadDashboardPreferences } from '@/utils/dashboardPreferences';
import {
  loadAccessibilityPreferences,
  speakAccessibilityText,
} from '@/utils/accessibilityPreferences';

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
  statusCorrida: 'Pendente' | 'Aceito' | 'Em andamento' | 'Finalizada' | 'Cancelada';
  motorista?: any;
  veiculo?: any;
  dataInicioCorrida?: string | null;
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
  statusCorrida: 'Pendente',
  motorista: null,
  veiculo: null,
  dataInicioCorrida: null,
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
  const [rideShortcuts] = useState(loadRideShortcuts);
  const [dashboardPreferences] = useState(loadDashboardPreferences);
  const panelText = getDashboardText(dashboardPreferences.language);
  const accessibilityPreferences = loadAccessibilityPreferences();
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
  const scheduleTriggerRef = useRef<HTMLButtonElement>(null);
  const scheduleDateRef = useRef<HTMLSelectElement>(null);

  const token = localStorage.getItem('token');
  const pollingIntervalRef = useRef<number | null>(null);
  const { error: showError, info, success, warning } = useToast();

  useEffect(() => {
    if (!showScheduleModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => scheduleDateRef.current?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowScheduleModal(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      scheduleTriggerRef.current?.focus();
    };
  }, [showScheduleModal]);

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
    if (accessibilityPreferences.audioDescriptions) {
      speakAccessibilityText(`Origem selecionada: ${address.display_name}`, dashboardPreferences.language);
    }
  };

  const handleDestinationSelect = (address: AutocompleteAddress) => {
    setSelectedDestinationAddress(address);
    setDestinationPosition(toLatLngTuple(address.lat, address.lon));
    if (accessibilityPreferences.audioDescriptions) {
      speakAccessibilityText(`Destino selecionado: ${address.display_name}`, dashboardPreferences.language);
    }
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

        if (data && data.idCorrida && ['Pendente', 'Aceito', 'Em andamento'].includes(data.statusCorrida)) {
          setAguardandoCorrida({
            ativo: true,
            id: data.idCorrida,
            origem: data.origemCorrida,
            destino: data.destinoCorrida,
            preco: data.preco,
            statusCorrida: data.statusCorrida,
            motorista: data.motorista,
            veiculo: data.veiculo,
            dataInicioCorrida: data.dataInicioCorrida,
          });
          iniciarPollingCorrida(data.idCorrida);
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

      if (['Pendente', 'Aceito', 'Em andamento', 'Finalizada'].includes(data.statusCorrida)) {
        setAguardandoCorrida((prev) => ({
          ...prev,
          ativo: true,
          statusCorrida: data.statusCorrida,
          motorista: data.motorista,
          veiculo: data.veiculo,
          dataInicioCorrida: data.dataInicioCorrida,
        }));
      }

      if (data.statusCorrida === 'Finalizada') {
        clearPollingInterval();
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

    if (accessibilityPreferences.confirmationBeforeCancel &&
      !window.confirm('Deseja mesmo cancelar a solicitação desta corrida?')) {
      return;
    }

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
      observations: [
        formData.notes,
        accessibilityPreferences.boardingAssistance
          ? 'Passageiro precisa de auxílio no embarque e desembarque.'
          : '',
        accessibilityPreferences.accessibleVehicleRequest
          ? 'Passageiro solicita veículo acessível/adaptado.'
          : '',
      ].filter(Boolean).join('\n'),
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
          if (route && accessibilityPreferences.voiceRouteSummary) {
            const duration = MapRequests.formatDuration(route.duration);
            speakAccessibilityText(
              `Trajeto para ${formData.destination}. Tempo estimado: ${duration}.`,
              dashboardPreferences.language,
            );
          }
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
          observacoes: [
            formData.notes,
            accessibilityPreferences.boardingAssistance
              ? 'Passageiro precisa de auxílio no embarque e desembarque.'
              : '',
            accessibilityPreferences.accessibleVehicleRequest
              ? 'Passageiro solicita veículo acessível/adaptado.'
              : '',
          ].filter(Boolean).join('\n') || null,
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
        statusCorrida: 'Pendente',
        motorista: null,
        veiculo: null,
        dataInicioCorrida: null,
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

  const applyRideShortcut = (shortcut: (typeof rideShortcuts)[number]) => {
    setRouteData(null);
    setEstimatedTime(null);
    setEstimatedDistance(null);

    if (shortcut.target === 'origin') {
      setFormData((current) => ({ ...current, origin: shortcut.address }));
      setSelectedOriginAddress(null);
      setOriginPosition(null);
      return;
    }

    setFormData((current) => ({ ...current, destination: shortcut.address }));
    setSelectedDestinationAddress(null);
    setDestinationPosition(null);
  };

  const mapPoints: MapPoint[] = [];

  if (originPosition) {
    mapPoints.push({
      id: 'origin',
      label: panelText.origin,
      position: originPosition,
      color: '#16a34a',
      description: formData.origin,
      isLocation: true,
    });
  }

  if (destinationPosition) {
    mapPoints.push({
      id: 'destination',
      label: panelText.destination,
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
                  {userType === 'passenger' ? panelText.passengerTitle : 'Disponível para viagens'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {userType === 'passenger'
                    ? panelText.passengerSubtitle
                    : panelText.locationShared}
                </p>
              </div>

              <form onSubmit={handleRequestRide} className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {panelText.origin}
                  </label>
                  <AddressAutocomplete
                    value={formData.origin}
                    onChange={handleOriginChange}
                    onSelect={handleOriginSelect}
                    placeholder={panelText.originPlaceholder}
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
                    title={panelText.swap}
                  >
                    <Navigation className="size-5 text-gray-600 rotate-90" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {panelText.destination}
                  </label>
                  <AddressAutocomplete
                    value={formData.destination}
                    onChange={handleDestinationChange}
                    onSelect={handleDestinationSelect}
                    placeholder={panelText.destinationPlaceholder}
                    iconColor="text-red-600"
                    maxSuggestions={6}
                    required
                  />
                </div>

                {userType === 'passenger' && (
                  <>
                    <div className="a11y-optional-ride-setting">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {panelText.rideType}
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
                        <option value="Convencional">{panelText.conventionalRide}</option>
                        <option value="Premium">{panelText.premiumRide}</option>
                        <option value="EconoComigo">{panelText.ecoRide}</option>
                      </select>
                    </div>

                    <div className="a11y-optional-ride-setting">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {panelText.passengers}
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
                            {num} {num === 1 ? panelText.passenger : panelText.passengersPlural}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="a11y-optional-ride-setting">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {panelText.notes}
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData((current) => ({ ...current, notes: e.target.value }))
                        }
                        placeholder={panelText.notesPlaceholder}
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
                      ? panelText.scheduling
                      : userType === 'passenger'
                        ? panelText.requestRide
                        : panelText.activateDriverMode}
                  </button>
                  
                  {userType === 'passenger' && (
                    <button
                      type="button"
                      onClick={handleAgendarClick}
                      ref={scheduleTriggerRef}
                      className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center gap-2"
                    >
                      📅 {panelText.schedule}
                    </button>
                  )}
                </div>

                {(accessibilityPreferences.boardingAssistance || accessibilityPreferences.accessibleVehicleRequest) && (
                  <p className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs leading-5 text-violet-900 dark:border-violet-400/25 dark:bg-violet-400/10 dark:text-violet-200" role="status">
                    As preferências de acessibilidade selecionadas serão incluídas nas observações para o motorista. A correspondência com veículo adaptado ainda não é automática.
                  </p>
                )}
              </form>

              {userType === 'passenger' && (
                <div className="border-t border-gray-200 pt-4 dark:border-slate-700">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-300">{panelText.shortcuts}</p>
                    <Link
                      to="/passageiro/atalhos"
                      className="text-xs font-semibold text-[#5a34a1] hover:underline dark:text-violet-300"
                    >
                      {panelText.edit}
                    </Link>
                  </div>
                  {rideShortcuts.length > 0 ? (
                    <div className="space-y-2">
                      {rideShortcuts.map((shortcut) => (
                        <button
                          key={shortcut.id}
                          type="button"
                          onClick={() => applyRideShortcut(shortcut)}
                          className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          <MapPin className="size-5 shrink-0 text-gray-400 dark:text-slate-500" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-gray-700 dark:text-slate-200">
                              {shortcut.label}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-slate-400">
                              {shortcut.address} · {shortcut.target === 'origin' ? panelText.origin : panelText.destination}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg bg-gray-50 px-3 py-4 text-sm text-gray-500 dark:bg-slate-800/70 dark:text-slate-400">
                      {panelText.noShortcuts}
                    </p>
                  )}
                </div>
              )}
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
          emptyTitle={userType === 'passenger' ? panelText.mapPassengerTitle : panelText.mapDriverTitle}
          emptySubtitle={
            userType === 'passenger'
              ? panelText.mapPassengerSubtitle
              : panelText.mapDriverSubtitle
          }
          mapStyle={dashboardPreferences.mapStyle}
          locationIcon={dashboardPreferences.locationIcon}
          language={dashboardPreferences.language}
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
        <PainelCorridaPassageiro
          corridaId={aguardandoCorrida.id}
          origem={aguardandoCorrida.origem}
          destino={aguardandoCorrida.destino}
          preco={aguardandoCorrida.preco}
          statusCorrida={aguardandoCorrida.statusCorrida}
          motorista={aguardandoCorrida.motorista}
          veiculo={aguardandoCorrida.veiculo}
          dataInicioCorrida={aguardandoCorrida.dataInicioCorrida}
          onCancelar={handleCancelarAguardando}
          onFinalizarAvaliacao={() => {
            clearPollingInterval();
            resetAguardandoCorrida();
          }}
        />
      )}

      {/* Modal de Agendamento */}
      {showScheduleModal && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-md sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowScheduleModal(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="schedule-dialog-title"
            aria-describedby="schedule-dialog-description"
            className="my-auto w-full max-w-md overflow-hidden rounded-[1.65rem] border border-white/10 bg-white shadow-[0_32px_100px_rgba(2,6,23,0.5)] dark:border-slate-700 dark:bg-slate-900"
          >
            <header className="relative overflow-hidden bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 px-5 py-5 text-white sm:px-6">
              <div className="pointer-events-none absolute -right-7 -top-12 size-36 rounded-full border-[22px] border-white/10" />
              <div className="relative flex items-center gap-3.5">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner">
                  <span className="text-2xl" aria-hidden="true">🗓️</span>
                </span>
                <div>
                  <h2 id="schedule-dialog-title" className="text-xl font-bold tracking-tight sm:text-2xl">Agendar viagem</h2>
                  <p id="schedule-dialog-description" className="mt-0.5 text-sm text-white/85">Escolha quando você quer viajar</p>
                </div>
              </div>
            </header>

            <div className="max-h-[calc(100dvh-9rem)] space-y-5 overflow-y-auto p-4 sm:p-5">
              <section aria-label="Resumo da viagem" className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/70">
                <div className="flex items-center gap-3 border-b border-dashed border-slate-200 pb-3 dark:border-slate-600">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xl dark:bg-violet-400/15" aria-hidden="true">🚗</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Sua viagem</p>
                    <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-5 text-slate-800 dark:text-slate-100">
                      {formData.origin || '📍 Origem'} <span className="text-violet-500">→</span> {formData.destination || '🏁 Destino'}
                    </p>
                  </div>
                </div>
                <div className="pt-3 text-center">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Preço estimado</p>
                  <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-violet-700 dark:text-violet-300">{getPrecoFormatado()}</p>
                </div>
              </section>

              <div className="space-y-4">
                <div>
                  <label htmlFor="schedule-date" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <span aria-hidden="true">📅</span> Data da viagem
                  </label>
                  <select
                    ref={scheduleDateRef}
                    id="schedule-date"
                    value={scheduleDate}
                    onChange={(event) => setScheduleDate(event.target.value)}
                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-violet-400"
                  >
                    <option value="">Selecione uma data</option>
                    {getAvailableDates().map((date) => <option key={date.value} value={date.value}>{date.label}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="schedule-time" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <span aria-hidden="true">⏰</span> Horário da viagem
                  </label>
                  <select
                    id="schedule-time"
                    value={scheduleTime}
                    onChange={(event) => setScheduleTime(event.target.value)}
                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-violet-400"
                  >
                    <option value="">Selecione um horário</option>
                    {getAvailableTimes().map((time) => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>
              </div>

              <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/25 dark:bg-amber-400/10" aria-label="Informações sobre o agendamento">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="inline-flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200" aria-hidden="true">ℹ</span>
                  <p className="text-sm font-bold text-amber-950 dark:text-amber-100">Sobre o agendamento</p>
                </div>
                <ul className="space-y-1.5 text-xs leading-5 text-amber-900 dark:text-amber-100/90">
                  <li>✓ Agende com até 30 dias de antecedência</li>
                  <li>✓ Tempo extra para embarque incluído</li>
                  <li>✓ Cancelamento sem custo com até 60 minutos de antecedência</li>
                </ul>
              </aside>

              <div className="flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmarAgendamento}
                  className="min-h-12 flex-1 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/20 transition hover:from-fuchsia-700 hover:to-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}