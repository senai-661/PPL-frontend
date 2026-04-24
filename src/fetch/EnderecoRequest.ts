const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const ENDERECO_SUGESTOES_PATH = "/api/autocomplete/enderecos";

export interface EnderecoSugestaoResponse {
  display_name: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  lat: number;
  lon: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
  };
}

interface BuscarSugestoesResponse {
  sugestoes?: EnderecoSugestaoResponse[];
}

export class EnderecoRequest {
  static async buscarSugestoes(
    query: string,
    limit: number = 5,
  ): Promise<EnderecoSugestaoResponse[]> {
    try {
      const termo = query.trim();

      if (termo.length < 2) {
        return [];
      }

      const searchParams = new URLSearchParams();
      searchParams.set("q", termo);
      searchParams.set("limit", limit.toString());

      const response = await fetch(
        `${API_BASE_URL}${ENDERECO_SUGESTOES_PATH}?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        console.error(`Erro ao buscar sugestoes: ${response.status}`);
        return [];
      }

      const data = (await response.json()) as BuscarSugestoesResponse;
      return data.sugestoes || [];
    } catch (error) {
      console.error("Erro na busca de sugestoes:", error);
      return [];
    }
  }
}
