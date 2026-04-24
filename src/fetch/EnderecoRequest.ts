const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export class EnderecoRequest {
  static async buscarSugestoes(query: string): Promise<any[]> {
    try {
      const searchUrl = new URL(NOMINATIM_URL);
      searchUrl.searchParams.set('q', query);
      searchUrl.searchParams.set('format', 'jsonv2');
      searchUrl.searchParams.set('addressdetails', '1');
      searchUrl.searchParams.set('limit', '5');
      searchUrl.searchParams.set('countrycodes', 'br');

      const response = await fetch(searchUrl.toString(), {
        headers: {
          'Accept-Language': 'pt-BR',
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar sugestões");
      }
      const data = await response.json();
      return data.map((item: any) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        address: item.address,
      }));
    } catch (error) {
      console.error("Erro na busca de sugestões:", error);
      return [];
    }
  }
}