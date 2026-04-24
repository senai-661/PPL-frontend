import { DollarSign, MapPin, Navigation, X, Loader2 } from 'lucide-react';
import type { LatLngTuple } from 'leaflet';
import { useEffect, useState } from 'react';

import {
  AddressAutocomplete,
  type AutocompleteAddress,
} from './AutocompleteEndereco';
import MapRequests from '../../fetch/MapRequest';
import { AguardandoMotorista } from './AguardandoMotorista';
import { MapComponent, type MapPoint } from './MapComponent';
import { SERVER_CFG } from '../../appConfig';

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

const DEFAULT_CENTER: LatLngTuple = [-23.55052, -46.633308];

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
  const [selectedOriginAddress, setSelectedOriginAddress] = useState<AutocompleteAddress | null>(null);
  const [selectedDestinationAddress, setSelectedDestinationAddress] = useState<AutocompleteAddress | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [estimatedDistance, setEstimatedDistance] = useState<string | null>(null);
  const [aguardandoCorrida, setAguardandoCorrida] = useState<{
    ativo: boolean;
    id: number | null;
  }>({ ativo: false, id: null });
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);

  const token = localStorage.getItem('token');

  // Limpar intervalo ao desmontar
  useEffect(() => {
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [pollingInterval]);

  // Verificar status da corrida
  const verificarStatusCorrida = async (corridaId: number) => {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/${corridaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.statusCorrida === 'Aceito' || data.statusCorrida === 'Em andamento') {
          if (pollingInterval) clearInterval(pollingInterval);
          setAguardandoCorrida({ ativo: false, id: null });
          alert(`🎉 Corrida aceita! O motorista ${data.motorista?.nome || 'está'} a caminho.`);
        }
        
        if (data.statusCorrida === 'Cancelada') {
          if (pollingInterval) clearInterval(pollingInterval);
          setAguardandoCorrida({ ativo: false, id: null });
          alert('❌ Sua solicitação foi cancelada.');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
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
        setEstimatedPrice(null);
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
          resolvedOrigin ? [resolvedOrigin.lat, resolvedOrigin.lng] : null,
        );
        setDestinationPosition(
          resolvedDestination ? [resolvedDestination.lat, resolvedDestination.lng] : null,
        );

        // Calcular preço estimado se tiver os dois pontos
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
            setEstimatedPrice(data.preco);
            setEstimatedTime(`${data.duracaoEstimadaMin} min`);
            setEstimatedDistance(`${data.distanciaKm.toFixed(1)} km`);
          }
        }
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

  const handleRequestRide = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.origin || !formData.destination) {
      alert('Por favor, preencha a origem e o destino');
      return;
    }

    if (!originPosition || !destinationPosition) {
      alert('Aguardando localização dos endereços... Tente novamente');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

      // Mostrar modal de aguardando motorista
      if (data.idCorrida) {
        setAguardandoCorrida({ ativo: true, id: data.idCorrida });
        
        const interval = setInterval(() => {
          verificarStatusCorrida(data.idCorrida);
        }, 5000);
        setPollingInterval(interval);
      }

      if (onRequestRide) {
        onRequestRide({
          ...formData,
          originCoords: originPosition,
          destinationCoords: destinationPosition,
        });
      }

      // Limpar formulário
      setFormData({
        origin: '',
        destination: '',
        passengers: 1,
        notes: '',
        rideType: 'Convencional',
      });
      setOriginPosition(null);
      setDestinationPosition(null);
      setEstimatedPrice(null);
      setEstimatedTime(null);
      setEstimatedDistance(null);

    } catch (err: any) {
      alert(err.message || 'Erro ao solicitar viagem');
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

  const tripRoute = originPosition && destinationPosition
    ? [originPosition, destinationPosition]
    : undefined;
    
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
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Corrida
                    </label>
                    <select
                      value={formData.rideType}
                      onChange={(e) =>
                        setFormData({ ...formData, rideType: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#5a34a1] transition-colors"
                    >
                      <option value="Convencional">🚗 Convencional</option>
                      <option value="EconoComigo">💰 EconoComigo (mais barato)</option>
                      <option value="Premium">⭐ Premium (mais conforto)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Passageiros
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Ex: Tenho muitas malas, precisamos de carro grande..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#5a34a1] transition-colors resize-none h-20"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5a34a1] hover:bg-[#4a2a85] text-white font-bold py-4 rounded-lg transition-colors text-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="size-5 animate-spin" />}
                {loading ? 'Solicitando...' : userType === 'passenger' ? 'Solicitar Viagem' : 'Ativar Modo Online'}
              </button>
            </form>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 font-semibold mb-3">ATALHOS</p>
              <div className="space-y-2">
                <button 
                  onClick={() => setFormData({ ...formData, origin: 'Av. Paulista, 1000, São Paulo' })}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <MapPin className="size-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700">Av. Paulista</p>
                    <p className="text-xs text-gray-500 truncate">Av. Paulista, 1000 - Bela Vista, SP</p>
                  </div>
                </button>
                <button 
                  onClick={() => setFormData({ ...formData, destination: 'Shopping Ibirapuera, São Paulo' })}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <MapPin className="size-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700">Shopping Ibirapuera</p>
                    <p className="text-xs text-gray-500 truncate">Av. Ibirapuera, 3103 - SP</p>
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

        {userType === 'passenger' && estimatedPrice && (
          <div className="absolute bottom-6 left-6 right-6 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">PREÇO ESTIMADO</p>
                <p className="text-2xl font-bold text-[#5a34a1]">
                  R$ {estimatedPrice.toFixed(2)}
                </p>
              </div>
              <DollarSign className="size-5 text-green-600" />
            </div>
            <div className="border-t border-gray-200 pt-3 text-sm text-gray-600">
              <p>Tempo: ~{estimatedTime}</p>
              <p>Distância: ~{estimatedDistance}</p>
            </div>
          </div>
        )}

        {userType === 'driver' && (
          <div className="absolute top-6 right-6 z-10 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-3 bg-green-600 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-gray-700">Você está online</span>
            </div>
            <p className="text-xs text-gray-600">Aguardando solicitações próximas...</p>
          </div>
        )}
      </div>

      {/* Modal de Aguardando Motorista */}
      {aguardandoCorrida.ativo && aguardandoCorrida.id && (
        <AguardandoMotorista
          corridaId={aguardandoCorrida.id}
          origem={formData.origin}
          destino={formData.destination}
          preco={estimatedPrice ?? 0}
          onCancelar={() => {
            if (pollingInterval) clearInterval(pollingInterval);
            setAguardandoCorrida({ ativo: false, id: null });
          }}
        />
      )}
    </div>
  );
}