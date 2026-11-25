export interface MapCoordinateDTO {
  lat: number;
  lng: number;
  label: string;
}

export interface RouteData {
  coordinates: [number, number][];
  distance: number; // em metros
  duration: number; // em segundos
}

interface NominatimSearchResponse {
  lat: string;
  lon: string;
  display_name: string;
}

interface PhotonReverseResponse {
  features: Array<{
    properties: {
      name?: string;
      street?: string;
      housenumber?: string;
      district?: string;
      locality?: string;
      city?: string;
      town?: string;
      village?: string;
      state?: string;
      country?: string;
    };
  }>;
}

interface OSRMRouteResponse {
  routes: Array<{
    geometry: {
      coordinates: [number, number][];
    };
    distance: number;
    duration: number;
  }>;
  code: string;
}

class MapRequests {
  private readonly baseUrl = 'https://nominatim.openstreetmap.org/search';
  private readonly osrmUrl = 'https://router.project-osrm.org/route/v1/driving';
  private readonly cache = new Map<string, MapCoordinateDTO | null>();
  private readonly routeCache = new Map<string, RouteData>();

  async geocodeAddress(address: string): Promise<MapCoordinateDTO | null> {
    const normalizedAddress = address.trim();

    if (normalizedAddress.length < 3) {
      return null;
    }

    const cachedResponse = this.cache.get(normalizedAddress);
    if (cachedResponse !== undefined) {
      return cachedResponse;
    }

    try {
      const searchUrl = new URL(this.baseUrl);
      searchUrl.searchParams.set('q', normalizedAddress);
      searchUrl.searchParams.set('format', 'jsonv2');
      searchUrl.searchParams.set('limit', '1');
      searchUrl.searchParams.set('countrycodes', 'br');
      searchUrl.searchParams.set('addressdetails', '1');

      const response = await fetch(searchUrl.toString(), {
        headers: {
          'Accept-Language': 'pt-BR',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao consultar a API de mapas: ${response.status}`);
      }

      const [firstResult] = (await response.json()) as NominatimSearchResponse[];
      const parsedResult = firstResult
        ? {
            lat: Number(firstResult.lat),
            lng: Number(firstResult.lon),
            label: firstResult.display_name,
          }
        : null;

      this.cache.set(normalizedAddress, parsedResult);
      return parsedResult;
    } catch (error) {
      console.error('Falha ao geocodificar endereco:', error);
      this.cache.set(normalizedAddress, null);
      return null;
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<MapCoordinateDTO | null> {
    try {
      const reverseUrl = new URL('https://photon.komoot.io/reverse');
      reverseUrl.searchParams.set('lat', String(lat));
      reverseUrl.searchParams.set('lon', String(lng));

      const response = await fetch(reverseUrl.toString(), {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Erro ao identificar o endereço da localização: ${response.status}`);
      }

      const data = (await response.json()) as PhotonReverseResponse;
      const properties = data.features[0]?.properties;
      if (!properties) return null;

      const street = [properties.street ?? properties.name, properties.housenumber]
        .filter(Boolean)
        .join(', ');
      const label = [
        street || properties.name,
        properties.district,
        properties.locality ?? properties.city ?? properties.town ?? properties.village,
        properties.state,
        properties.country,
      ].filter(Boolean).join(', ');

      return label ? { lat, lng, label } : null;
    } catch (error) {
      console.error('Falha ao identificar endereço da localização atual:', error);
      return null;
    }
  }

  async calculateRoute(origin: [number, number], destination: [number, number]): Promise<RouteData | null> {
    const cacheKey = `${origin[0]},${origin[1]}-${destination[0]},${destination[1]}`;
    
    const cachedRoute = this.routeCache.get(cacheKey);
    if (cachedRoute) {
      return cachedRoute;
    }

    try {
      // Formatar coordenadas para OSRM: longitude,latitude
      const coordinates = `${origin[1]},${origin[0]};${destination[1]},${destination[0]}`;
      const url = `${this.osrmUrl}/${coordinates}?overview=full&geometries=geojson`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro ao calcular rota: ${response.status}`);
      }

      const data = (await response.json()) as OSRMRouteResponse;

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        console.error('Rota não encontrada ou inválida');
        return null;
      }

      const route = data.routes[0];
      const routeData: RouteData = {
        coordinates: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]), // Converter para [lat, lng]
        distance: Math.round(route.distance),
        duration: Math.round(route.duration),
      };

      this.routeCache.set(cacheKey, routeData);
      return routeData;
    } catch (error) {
      console.error('Falha ao calcular rota:', error);
      return null;
    }
  }

  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  }

  formatDuration(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }
}

export default new MapRequests();
