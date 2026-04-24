import {
  Clock,
  DollarSign,
  MapPin,
  Navigation2,
  Phone,
  Search,
  X,
  Loader2,
} from 'lucide-react';
import type { LatLngTuple } from 'leaflet';
import { useEffect, useState } from 'react';

import MapRequests from '../../fetch/MapRequest';
import { MapComponent, type MapPoint } from './MapComponent';
import { SERVER_CFG } from '../../appConfig';

interface DriverUberLayoutProps {
  onToggleOnline?: (isOnline: boolean) => void;
}

interface RideNotification {
  id: number;
  passageiro: {
    nome: string;
    sobrenome: string;
    celular: string;
    necessidades: string[] | null;
  };
  origemCorrida: string;
  destinoCorrida: string;
  preco: number;
  dataCorrida: string;
  statusCorrida: string;
}

type RideMapLookup = Record<
  number,
  {
    origin: LatLngTuple | null;
    destination: LatLngTuple | null;
  }
>;

const DEFAULT_CENTER: LatLngTuple = [-23.55052, -46.633308];

export function DriverUberLayout({ onToggleOnline }: DriverUberLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedRide, setSelectedRide] = useState<number | null>(null);
  const [driverPosition, setDriverPosition] = useState<LatLngTuple>(DEFAULT_CENTER);
  const [rideMapLookup, setRideMapLookup] = useState<RideMapLookup>({});
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [rideNotifications, setRideNotifications] = useState<RideNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    ganhosDia: 0,
    viagensDia: 0,
    mediaAvaliacao: null as number | null,
  });
  const [togglingOnline, setTogglingOnline] = useState(false);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Buscar corridas pendentes
  const fetchPendingRides = async () => {
    if (!isOnline) return;
    
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas?status=Pendente`, { headers });
      if (response.ok) {
        const data = await response.json();
        setRideNotifications(data);
      }
    } catch (error) {
      console.error('Erro ao buscar corridas:', error);
    }
  };

  // Buscar stats do dia
  const fetchDailyStats = async () => {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/motorista/resumo-dia`, { headers });
      if (response.ok) {
        const data = await response.json();
        setStats({
          ganhosDia: data.totalGanho || 0,
          viagensDia: data.corridasFinalizadas || 0,
          mediaAvaliacao: null,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar stats:', error);
    }
  };

  // Alternar disponibilidade
  const handleToggleOnline = async () => {
    setTogglingOnline(true);
    const novoStatus = !isOnline;
    
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/motorista/disponibilidade`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ disponivel: novoStatus }),
      });
      
      if (response.ok) {
        setIsOnline(novoStatus);
        onToggleOnline?.(novoStatus);
        if (novoStatus) {
          fetchPendingRides();
          fetchDailyStats();
        } else {
          setRideNotifications([]);
          setRideMapLookup({});
        }
      }
    } catch (error) {
      console.error('Erro ao alterar disponibilidade:', error);
    } finally {
      setTogglingOnline(false);
    }
  };

  // Buscar corridas a cada 10 segundos quando online
  useEffect(() => {
    if (!isOnline) return;
    
    fetchPendingRides();
    const interval = setInterval(fetchPendingRides, 10000);
    return () => clearInterval(interval);
  }, [isOnline]);

  // Buscar stats quando online
  useEffect(() => {
    if (isOnline) {
      fetchDailyStats();
    }
  }, [isOnline]);

  // Geolocalização do motorista
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setDriverPosition([coords.latitude, coords.longitude]);
      },
      () => {
        setDriverPosition(DEFAULT_CENTER);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 15000,
        timeout: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Geocodificar endereços das corridas
  useEffect(() => {
    let isMounted = true;

    if (!isOnline || rideNotifications.length === 0) {
      setRideMapLookup({});
      setIsMapLoading(false);
      return;
    }

    const loadRideCoordinates = async () => {
      setIsMapLoading(true);

      try {
        const entries = await Promise.all(
          rideNotifications.map(async (ride) => {
            const [origin, destination] = await Promise.all([
              MapRequests.geocodeAddress(ride.origemCorrida),
              MapRequests.geocodeAddress(ride.destinoCorrida),
            ]);

            return [
              ride.id,
              {
                origin: origin ? ([origin.lat, origin.lng] as LatLngTuple) : null,
                destination: destination
                  ? ([destination.lat, destination.lng] as LatLngTuple)
                  : null,
              },
            ] as const;
          }),
        );

        if (!isMounted) return;
        setRideMapLookup(Object.fromEntries(entries));
      } finally {
        if (isMounted) setIsMapLoading(false);
      }
    };

    loadRideCoordinates();
    return () => { isMounted = false; };
  }, [isOnline, rideNotifications]);

  // Aceitar corrida
  const handleAcceptRide = async (rideId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/${rideId}/aceitar`, {
        method: 'PATCH',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Erro ao aceitar corrida');
      }

      alert(`Corrida aceita! Navegando para o passageiro...`);
      setRideNotifications(prev => prev.filter(ride => ride.id !== rideId));
      setSelectedRide(null);
      fetchDailyStats();
    } catch (err: any) {
      alert(err.message || 'Erro ao aceitar corrida');
    } finally {
      setLoading(false);
    }
  };

  // Recusar corrida (cancelar)
  const handleRejectRide = async (rideId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/${rideId}/cancelar`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ motivoCancelamento: 'Motorista recusou a corrida' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Erro ao recusar corrida');
      }

      setRideNotifications(prev => prev.filter(ride => ride.id !== rideId));
      setSelectedRide(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao recusar corrida');
    } finally {
      setLoading(false);
    }
  };

  const getRideTypeColor = (necessidades: string[] | null) => {
    if (necessidades && necessidades.length > 0) return 'bg-amber-600';
    return 'bg-[#5a34a1]';
  };

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const mapPoints: MapPoint[] = [
    {
      id: 'driver-position',
      label: isOnline ? 'Sua localização' : 'Posição estimada',
      position: driverPosition,
      color: isOnline ? '#16a34a' : '#64748b',
      description: isOnline
        ? 'Sua posição atual está sendo compartilhada.'
        : 'Ative o modo online para compartilhar sua localização.',
      radius: 10,
    },
  ];

  for (const ride of rideNotifications) {
    const rideCoordinates = rideMapLookup[ride.id];

    if (rideCoordinates?.origin) {
      mapPoints.push({
        id: `ride-origin-${ride.id}`,
        label: `Coleta: ${ride.passageiro.nome} ${ride.passageiro.sobrenome}`,
        position: rideCoordinates.origin,
        color: selectedRide === ride.id ? '#2563eb' : '#f59e0b',
        description: ride.origemCorrida,
      });
    }

    if (selectedRide === ride.id && rideCoordinates?.destination) {
      mapPoints.push({
        id: `ride-destination-${ride.id}`,
        label: `Destino: ${ride.passageiro.nome} ${ride.passageiro.sobrenome}`,
        position: rideCoordinates.destination,
        color: '#dc2626',
        description: ride.destinoCorrida,
      });
    }
  }

  const selectedRideCoordinates = selectedRide ? rideMapLookup[selectedRide] : undefined;
  const selectedRideRoute =
    selectedRideCoordinates?.origin && selectedRideCoordinates.destination
      ? [driverPosition, selectedRideCoordinates.origin, selectedRideCoordinates.destination]
      : undefined;
  const mapCenter = selectedRideCoordinates?.origin ?? driverPosition;

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
            {isExpanded ? <X className="size-5" /> : <Navigation2 className="size-5" />}
          </button>
        </div>

        {isExpanded && (
          <>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Modo Motorista</h3>

              <button
                onClick={handleToggleOnline}
                disabled={togglingOnline}
                className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  isOnline
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 hover:bg-gray-500'
                } disabled:opacity-50`}
              >
                {togglingOnline && <Loader2 className="size-5 animate-spin" />}
                {togglingOnline ? (isOnline ? 'Ficando Offline...' : 'Ficando Online...') : (isOnline ? 'Online' : 'Offline')}
              </button>

              {isOnline && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Você está disponível para receber solicitações.
                  </p>
                </div>
              )}

              {!isOnline && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Clique no botão acima para ativar o modo online.
                  </p>
                </div>
              )}
            </div>

            {isOnline && (
              <div className="p-6 border-b border-gray-200 space-y-3">
                <p className="text-xs text-gray-600 font-semibold mb-3">HOJE</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Ganhos:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatarMoeda(stats.ganhosDia)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Viagens:</span>
                  <span className="font-bold text-[#5a34a1] text-lg">{stats.viagensDia}</span>
                </div>
              </div>
            )}

            <div className="p-6 border-b border-gray-200">
              <p className="text-xs text-gray-600 font-semibold mb-3">ATALHOS</p>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  <Phone className="size-5 text-blue-600" />
                  <span className="text-sm font-semibold">Suporte 24/7</span>
                </button>
              </div>
            </div>

            {isOnline && rideNotifications.length === 0 && (
              <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div>
                  <Search className="size-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600 text-sm">
                    Aguardando solicitações próximas...
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex-1 relative bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 overflow-hidden flex flex-col">
        <MapComponent
          center={mapCenter}
          zoom={12}
          points={mapPoints}
          route={selectedRideRoute}
          loading={isMapLoading}
          emptyTitle="Mapa do motorista"
          emptySubtitle="Sua localização e as próximas corridas aparecerão aqui."
        />

        {isOnline && rideNotifications.length > 0 && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-6 right-6 max-w-md pointer-events-auto">
              {rideNotifications.slice(0, 3).map((ride, index) => (
                <div
                  key={ride.id}
                  className={`bg-white rounded-lg shadow-2xl p-4 mb-4 transform transition-all cursor-pointer border-l-4 ${
                    getRideTypeColor(ride.passageiro.necessidades)
                  } ${
                    selectedRide === ride.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedRide(selectedRide === ride.id ? null : ride.id)}
                  style={{
                    transform: `translateY(${index * 8}px)`,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-800">
                        {ride.passageiro.nome} {ride.passageiro.sobrenome}
                      </p>
                      {ride.passageiro.necessidades && ride.passageiro.necessidades.length > 0 && (
                        <span className="text-xs text-amber-600">
                          🦽 Necessidades especiais
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getRideTypeColor(ride.passageiro.necessidades)}`}
                    >
                      {ride.passageiro.necessidades && ride.passageiro.necessidades.length > 0 ? 'ADAPTADO' : 'CONVENCIONAL'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex gap-3">
                      <MapPin className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-600">Origem</p>
                        <p className="text-sm font-semibold text-gray-800">{ride.origemCorrida}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <MapPin className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-600">Destino</p>
                        <p className="text-sm font-semibold text-gray-800">{ride.destinoCorrida}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 rounded">
                    <div className="text-center">
                      <DollarSign className="size-4 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Preço</p>
                      <p className="text-sm font-bold text-gray-800">{formatarMoeda(ride.preco)}</p>
                    </div>
                    <div className="text-center">
                      <Clock className="size-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Solicitada</p>
                      <p className="text-sm font-bold text-gray-800">
                        {new Date(ride.dataCorrida).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {selectedRide === ride.id && (
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAcceptRide(ride.id);
                        }}
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition-colors disabled:opacity-50"
                      >
                        Aceitar
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRejectRide(ride.id);
                        }}
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition-colors disabled:opacity-50"
                      >
                        Recusar
                      </button>
                    </div>
                  )}

                  {selectedRide !== ride.id && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      Clique para detalhes
                    </p>
                  )}
                </div>
              ))}
            </div>

            {rideNotifications.length > 3 && (
              <div className="absolute top-6 right-6 mt-96 bg-red-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center font-bold shadow-lg pointer-events-auto">
                +{rideNotifications.length - 3}
              </div>
            )}
          </div>
        )}

        {!isOnline && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
            <div className="text-center text-white">
              <Navigation2 className="size-20 mx-auto mb-4 opacity-75" />
              <h2 className="text-3xl font-bold mb-2">Você está Offline</h2>
              <p className="text-lg opacity-90">
                Ative o modo online para receber solicitações
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}