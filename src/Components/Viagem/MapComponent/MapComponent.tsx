import 'leaflet/dist/leaflet.css';

import L, { type LatLngTuple } from 'leaflet';
import { LoaderCircle, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import {
  getDashboardText,
  type DashboardLanguage,
  type DashboardLocationIcon,
  type DashboardMapStyle,
} from '@/utils/dashboardPreferences';

export interface MapPoint {
  id: string;
  label: string;
  position: LatLngTuple;
  color?: string;
  description?: string;
  radius?: number;
  isLocation?: boolean;
}

interface MapComponentProps {
  center: LatLngTuple;
  zoom?: number;
  points?: MapPoint[];
  route?: LatLngTuple[];
  loading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  mapStyle?: DashboardMapStyle;
  locationIcon?: DashboardLocationIcon;
  language?: DashboardLanguage;
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
  mapStyle = 'street',
  locationIcon = 'pin',
  language = 'pt-BR',
}: MapComponentProps) {
  const hasMapData = points.length > 0 || (route?.length ?? 0) > 0;
  const text = getDashboardText(language);
  const osmTiles = {
    attribution: '&copy; OpenStreetMap contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
  };

  const tileLayers: Record<DashboardMapStyle, {
    attribution: string;
    url: string;
    subdomains?: string[];
  }> = {
    street: osmTiles,
    dark: osmTiles,
    light: osmTiles,
    humanitarian: {
      ...osmTiles,
    },
    topographic: {
      attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c'],
    },
    satellite: {
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    },
    places: {
      attribution: 'Tiles &copy; Esri | Map data &copy; OpenStreetMap contributors',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    },
    contrast: osmTiles,
    grayscale: osmTiles,
    warm: osmTiles,
    nature: osmTiles,
  };
  const activeTileLayer = tileLayers[mapStyle];
  const tileThemeClasses: Partial<Record<DashboardMapStyle, string>> = {
    dark: 'openline-dark-map-tiles',
    light: 'openline-light-map-tiles',
    humanitarian: 'openline-humanitarian-map-tiles',
    contrast: 'openline-contrast-map-tiles',
    grayscale: 'openline-grayscale-map-tiles',
    warm: 'openline-warm-map-tiles',
    nature: 'openline-nature-map-tiles',
  };
  const tileThemeClass = tileThemeClasses[mapStyle];

  const createLocationMarker = (color: string) => {
    const glyphs: Record<DashboardLocationIcon, string> = {
      pin: '📍',
      car: '🚗',
      person: '👤',
      accessible: '♿',
    };
    return L.divIcon({
      className: 'openline-location-marker',
      html: `<span style="display:flex;width:38px;height:38px;align-items:center;justify-content:center;border:3px solid ${color};border-radius:50% 50% 50% 10%;background:#fff;box-shadow:0 3px 12px rgba(15,23,42,.35);font-size:20px;transform:rotate(-45deg)"><span style="transform:rotate(45deg)">${glyphs[locationIcon]}</span></span>`,
      iconSize: [38, 38],
      iconAnchor: [19, 34],
      popupAnchor: [0, -32],
    });
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution={activeTileLayer.attribution}
          url={activeTileLayer.url}
          subdomains={activeTileLayer.subdomains ?? ['a', 'b', 'c']}
          className={tileThemeClass}
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

        {points.map((point) => {
          const color = point.color ?? '#5a34a1';
          const popup = (
            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">{point.label}</p>
                {point.description && <p className="text-xs text-slate-600">{point.description}</p>}
              </div>
            </Popup>
          );

          return point.isLocation ? (
            <Marker key={point.id} position={point.position} icon={createLocationMarker(color)}>
              {popup}
            </Marker>
          ) : (
            <CircleMarker
              key={point.id}
              center={point.position}
              radius={point.radius ?? 9}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.92, weight: 2 }}
            >
              {popup}
            </CircleMarker>
          );
        })}
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
            {text.mapLoading}
          </div>
        </div>
      )}
    </div>
  );
}
