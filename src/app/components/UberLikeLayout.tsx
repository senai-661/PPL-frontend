import { DollarSign, MapPin, Navigation, X } from 'lucide-react';
import type { LatLngTuple } from 'leaflet';
import { useEffect, useState } from 'react';

import {
  AddressAutocomplete,
  type AutocompleteAddress,
} from './AddressAutocomplete';
import MapRequests, { type RouteData } from '../../fetch/MapRequest';
import { MapComponent, type MapPoint } from './MapComponent';

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
}

const DEFAULT_CENTER: LatLngTuple = [-23.55052, -46.633308];

export function UberLikeLayout({ userType, onRequestRide }: UberLikeLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [formData, setFormData] = useState<RideRequestData>({
    origin: '',
    destination: '',
    passengers: 1,
    notes: '',
  });
  const [originPosition, setOriginPosition] = useState<LatLngTuple | null>(null);
  const [destinationPosition, setDestinationPosition] = useState<LatLngTuple | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [selectedOriginAddress, setSelectedOriginAddress] = useState<AutocompleteAddress | null>(null);
  const [selectedDestinationAddress, setSelectedDestinationAddress] = useState<AutocompleteAddress | null>(null);

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
    setOriginPosition([address.lat, address.lon]);
  };

  const handleDestinationSelect = (address: AutocompleteAddress) => {
    setSelectedDestinationAddress(address);
    setDestinationPosition([address.lat, address.lon]);
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
          resolvedOrigin ? [resolvedOrigin.lat, resolvedOrigin.lng] : null,
        );
        setDestinationPosition(
          resolvedDestination ? [resolvedDestination.lat, resolvedDestination.lng] : null,
        );
      } finally {
        if (isMounted) {
          setIsMapLoading(false);
        }
      }
    }, 500);

    return () => {
      isMounted = false;
      window.clearTimeout(timerId);
    };
  }, [
    formData.destination,
    formData.origin,
    selectedDestinationAddress,
    selectedOriginAddress,
  ]);

  // Calcular rota real quando origem e destino estiverem disponíveis
  useEffect(() => {
    let isMounted = true;

    const calculateRoute = async () => {
      if (!originPosition || !destinationPosition) {
        setRouteData(null);
        return;
      }

      setIsRouteLoading(true);

      try {
        const route = await MapRequests.calculateRoute(originPosition, destinationPosition);
        if (isMounted) {
          setRouteData(route);
        }
      } finally {
        if (isMounted) {
          setIsRouteLoading(false);
        }
      }
    };

    calculateRoute();

    return () => {
      isMounted = false;
    };
  }, [originPosition, destinationPosition]);

  const handleRequestRide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination) {
      alert('Por favor, preencha a origem e o destino');
      return;
    }
    if (onRequestRide) {
      onRequestRide({
        ...formData,
        originCoords: originPosition,
        destinationCoords: destinationPosition,
      });
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Numero de Passageiros
                  </label>
                  <select
                    value={formData.passengers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passengers: Number.parseInt(e.target.value, 10),
                      })
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
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observacoes (opcional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Tenho muitas malas, precisamos de carro grande..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#5a34a1] transition-colors resize-none h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#5a34a1] hover:bg-[#4a2a85] text-white font-bold py-4 rounded-lg transition-colors text-lg mt-6"
              >
                {userType === 'passenger' ? 'Solicitar Viagem' : 'Ativar Modo Online'}
              </button>
            </form>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 font-semibold mb-3">ATALHOS</p>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  <MapPin className="size-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700">Casa</p>
                    <p className="text-xs text-gray-500 truncate">Seu endereco de casa</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  <MapPin className="size-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700">Trabalho</p>
                    <p className="text-xs text-gray-500 truncate">Seu endereco de trabalho</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
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
          <div className="absolute bottom-6 left-6 right-6 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">PRECO ESTIMADO</p>
                <p className="text-2xl font-bold text-[#5a34a1]">R$ 32,50</p>
              </div>
              <DollarSign className="size-5 text-green-600" />
            </div>
            <div className="border-t border-gray-200 pt-3 text-sm text-gray-600">
              {isRouteLoading ? (
                <p className="text-gray-400">Calculando rota...</p>
              ) : routeData ? (
                <>
                  <p>Tempo: ~{MapRequests.formatDuration(routeData.duration)}</p>
                  <p>Distancia: {MapRequests.formatDistance(routeData.distance)}</p>
                </>
              ) : (
                <>
                  <p>Tempo: --</p>
                  <p>Distancia: --</p>
                </>
              )}
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
    </div>
  );
}
