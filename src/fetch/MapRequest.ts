export interface MapCoordinateDTO {
  lat: number;
  lng: number;
  label: string;
}

interface NominatimSearchResponse {
  lat: string;
  lon: string;
  display_name: string;
}

class MapRequests {
  private readonly baseUrl = 'https://nominatim.openstreetmap.org/search';
  private readonly cache = new Map<string, MapCoordinateDTO | null>();

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
}

export default new MapRequests();
