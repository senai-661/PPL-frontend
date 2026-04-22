import {
  Clock,
  DollarSign,
  MapPin,
  Navigation,
  Navigation2,
  Phone,
  Search,
  X,
} from 'lucide-react';
import type { LatLngTuple } from 'leaflet';
import { useEffect, useState } from 'react';

import MapRequests from '../../fetch/MapRequest';
import { MapComponent, type MapPoint } from './MapComponent';

interface DriverUberLayoutProps {
  onToggleOnline?: (isOnline: boolean) => void;
}

interface RideNotification {
  id: string;
  passengerName: string;
  passengerRating: number;
  origin: string;
  destination: string;
  estimatedPrice: string;
  estimatedTime: string;
  distance: string;
  rideType: 'EconoComigo' | 'Convencional' | 'Premium';
}

type RideMapLookup = Record<
  string,
  {
    origin: LatLngTuple | null;
    destination: LatLngTuple | null;
  }
>;

const DEFAULT_CENTER: LatLngTuple = [-23.55052, -46.633308];

export function DriverUberLayout({ onToggleOnline }: DriverUberLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [driverPosition, setDriverPosition] = useState<LatLngTuple>(DEFAULT_CENTER);
  const [rideMapLookup, setRideMapLookup] = useState<RideMapLookup>({});
  const [isMapLoading, setIsMapLoading] = useState(false);

  const [rideNotifications, setRideNotifications] = useState<RideNotification[]>([
    {
      id: '1',
      passengerName: 'Maria Silva',
      passengerRating: 4.9,
      origin: 'Av. Paulista, 1000, Sao Paulo',
      destination: 'Shopping Imigrantes, Sao Paulo',
      estimatedPrice: 'R$ 32,50',
      estimatedTime: '12 min',
      distance: '3.2 km',
      rideType: 'EconoComigo',
    },
    {
      id: '2',
      passengerName: 'Joao Santos',
      passengerRating: 4.8,
      origin: 'Centro, Sao Paulo',
      destination: 'Aeroporto GRU, Guarulhos',
      estimatedPrice: 'R$ 65,00',
      estimatedTime: '25 min',
      distance: '15.8 km',
      rideType: 'Premium',
    },
  ]);

  const handleToggleOnline = () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    onToggleOnline?.(nextStatus);
  };

  const handleAcceptRide = (rideId: string) => {
    alert(`Corrida ${rideId} aceita! Navegando para o passageiro...`);
    setRideNotifications(rideNotifications.filter((ride) => ride.id !== rideId));
    setSelectedRide(null);
  };

  const handleRejectRide = (rideId: string) => {
    setRideNotifications(rideNotifications.filter((ride) => ride.id !== rideId));
    setSelectedRide(null);
  };

  const getRideTypeColor = (rideType: string) => {
    switch (rideType) {
      case 'Premium':
        return 'bg-amber-600';
      case 'Convencional':
        return 'bg-[#5a34a1]';
      case 'EconoComigo':
        return 'bg-green-600';
      default:
        return 'bg-[#5a34a1]';
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

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

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

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
              MapRequests.geocodeAddress(ride.origin),
              MapRequests.geocodeAddress(ride.destination),
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

        if (!isMounted) {
          return;
        }

        setRideMapLookup(Object.fromEntries(entries));
      } finally {
        if (isMounted) {
          setIsMapLoading(false);
        }
      }
    };

    void loadRideCoordinates();

    return () => {
      isMounted = false;
    };
  }, [isOnline, rideNotifications]);

  const mapPoints: MapPoint[] = [
    {
      id: 'driver-position',
      label: isOnline ? 'Sua localizacao' : 'Posicao estimada',
      position: driverPosition,
      color: isOnline ? '#16a34a' : '#64748b',
      description: isOnline
        ? 'Sua posicao atual esta sendo compartilhada no mapa.'
        : 'Ative o modo online para compartilhar sua localizacao.',
      radius: 10,
    },
  ];

  for (const ride of rideNotifications) {
    const rideCoordinates = rideMapLookup[ride.id];

    if (rideCoordinates?.origin) {
      mapPoints.push({
        id: `ride-origin-${ride.id}`,
        label: `Coleta: ${ride.passengerName}`,
        position: rideCoordinates.origin,
        color: selectedRide === ride.id ? '#2563eb' : '#f59e0b',
        description: ride.origin,
      });
    }

    if (selectedRide === ride.id && rideCoordinates?.destination) {
      mapPoints.push({
        id: `ride-destination-${ride.id}`,
        label: `Destino: ${ride.passengerName}`,
        position: rideCoordinates.destination,
        color: '#dc2626',
        description: ride.destination,
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
                className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all ${
                  isOnline
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </button>

              {isOnline && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Voce esta disponivel para receber solicitacoes.
                  </p>
                </div>
              )}

              {!isOnline && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Clique no botao acima para ativar o modo online.
                  </p>
                </div>
              )}
            </div>

            {isOnline && (
              <div className="p-6 border-b border-gray-200 space-y-3">
                <p className="text-xs text-gray-600 font-semibold mb-3">HOJE</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Ganhos:</span>
                  <span className="font-bold text-green-600 text-lg">R$ 245,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Viagens:</span>
                  <span className="font-bold text-[#5a34a1] text-lg">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Avaliacao:</span>
                  <span className="font-bold text-yellow-600">4.9</span>
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
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  <MapPin className="size-5 text-gray-600" />
                  <span className="text-sm font-semibold">Meu Veiculo</span>
                </button>
              </div>
            </div>

            {isOnline && rideNotifications.length === 0 && (
              <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div>
                  <Search className="size-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600 text-sm">
                    Aguardando solicitacoes proximas...
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
          emptySubtitle="Sua localizacao e as proximas corridas aparecerao aqui."
        />

        {isOnline && rideNotifications.length > 0 && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-6 right-6 max-w-md pointer-events-auto">
              {rideNotifications.slice(0, 3).map((ride, index) => (
                <div
                  key={ride.id}
                  className={`bg-white rounded-lg shadow-2xl p-4 mb-4 transform transition-all cursor-pointer border-l-4 ${
                    getRideTypeColor(ride.rideType)
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
                      <p className="font-bold text-gray-800">{ride.passengerName}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600">{ride.passengerRating}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getRideTypeColor(ride.rideType)}`}
                    >
                      {ride.rideType.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex gap-3">
                      <MapPin className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-600">Origem</p>
                        <p className="text-sm font-semibold text-gray-800">{ride.origin}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <MapPin className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-600">Destino</p>
                        <p className="text-sm font-semibold text-gray-800">{ride.destination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded">
                    <div className="text-center">
                      <DollarSign className="size-4 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Preco</p>
                      <p className="text-sm font-bold text-gray-800">{ride.estimatedPrice}</p>
                    </div>
                    <div className="text-center">
                      <Clock className="size-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Tempo</p>
                      <p className="text-sm font-bold text-gray-800">{ride.estimatedTime}</p>
                    </div>
                    <div className="text-center">
                      <Navigation className="size-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Distancia</p>
                      <p className="text-sm font-bold text-gray-800">{ride.distance}</p>
                    </div>
                  </div>

                  {selectedRide === ride.id && (
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAcceptRide(ride.id);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition-colors"
                      >
                        Aceitar
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRejectRide(ride.id);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition-colors"
                      >
                        Rejeitar
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
              <h2 className="text-3xl font-bold mb-2">Voce esta Offline</h2>
              <p className="text-lg opacity-90">
                Ative o modo online para receber solicitacoes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
