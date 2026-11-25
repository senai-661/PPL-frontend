import { LoaderCircle, LocateFixed } from 'lucide-react';
import { useState } from 'react';

import MapRequests from '@/fetch/MapRequest';
import { getCurrentDeviceLocation, type DeviceLocation } from '@/utils/deviceLocation';

export interface CurrentPickupLocation extends DeviceLocation {
  label: string;
}

interface CurrentLocationButtonProps {
  onLocation: (location: CurrentPickupLocation) => void;
  disabled?: boolean;
}

export function CurrentLocationButton({ onLocation, disabled = false }: CurrentLocationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const useCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const location = await getCurrentDeviceLocation();
      const address = await MapRequests.reverseGeocode(location.lat, location.lng);
      const label = address?.label ?? `Localização atual (${location.lat.toFixed(5)}, ${location.lng.toFixed(5)})`;

      onLocation({ ...location, label });
      setAccuracy(location.accuracy);
    } catch (locationError) {
      setError(locationError instanceof Error ? locationError.message : 'Não foi possível obter sua localização.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => void useCurrentLocation()}
        disabled={disabled || loading}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-200 dark:hover:bg-violet-400/15"
      >
        {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <LocateFixed className="size-4" aria-hidden="true" />}
        {loading ? 'Localizando dispositivo…' : 'Usar minha localização atual'}
      </button>
      {accuracy !== null && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400" role="status">
          Localização do dispositivo definida · precisão aproximada de {Math.max(1, Math.round(accuracy))} m. Você pode digitar outro endereço acima.
        </p>
      )}
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-300" role="alert">{error}</p>}
    </div>
  );
}
