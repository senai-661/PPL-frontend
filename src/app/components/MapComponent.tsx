import 'leaflet/dist/leaflet.css';

import L, { type LatLngTuple } from 'leaflet';
import { LoaderCircle, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';

export interface MapPoint {
  id: string;
  label: string;
  position: LatLngTuple;
  color?: string;
  description?: string;
  radius?: number;
}

interface MapComponentProps {
  center: LatLngTuple;
  zoom?: number;
  points?: MapPoint[];
  route?: LatLngTuple[];
  loading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
}

interface FitMapToDataProps {
  center: LatLngTuple;
  zoom: number;
  points: MapPoint[];
  route?: LatLngTuple[];
}

function FitMapToData({ center, zoom, points, route }: FitMapToDataProps) {
  const map = useMap();

  useEffect(() => {
    const positions = [
      ...points.map((point) => point.position),
      ...(route ?? []),
    ];

    if (positions.length > 1) {
      map.fitBounds(L.latLngBounds(positions), {
        padding: [56, 56],
      });
      return;
    }

    if (positions.length === 1) {
      map.setView(positions[0], zoom);
      return;
    }

    map.setView(center, zoom);
  }, [center, map, points, route, zoom]);

  return null;
}

export function MapComponent({
  center,
  zoom = 13,
  points = [],
  route,
  loading = false,
  emptyTitle = 'Mapa',
  emptySubtitle = 'Nenhum ponto foi selecionado ainda.',
}: MapComponentProps) {
  const hasMapData = points.length > 0 || (route?.length ?? 0) > 0;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitMapToData
          center={center}
          zoom={zoom}
          points={points}
          route={route}
        />

        {route && route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: '#5a34a1',
              weight: 5,
              opacity: 0.85,
            }}
          />
        )}

        {points.map((point) => (
          <CircleMarker
            key={point.id}
            center={point.position}
            radius={point.radius ?? 9}
            pathOptions={{
              color: point.color ?? '#5a34a1',
              fillColor: point.color ?? '#5a34a1',
              fillOpacity: 0.92,
              weight: 2,
            }}
          >
            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">{point.label}</p>
                {point.description && (
                  <p className="text-xs text-slate-600">{point.description}</p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {!hasMapData && !loading && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]">
          <div className="rounded-2xl border border-white/25 bg-slate-950/55 px-6 py-5 text-center text-white shadow-2xl">
            <MapPin className="mx-auto mb-3 size-12 opacity-80" />
            <h3 className="text-xl font-bold">{emptyTitle}</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-100/85">{emptySubtitle}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white/55 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg">
            <LoaderCircle className="size-4 animate-spin" />
            Carregando mapa...
          </div>
        </div>
      )}
    </div>
  );
}
