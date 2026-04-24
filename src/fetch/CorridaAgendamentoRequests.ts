import { SERVER_CFG } from '../appConfig';
import { CorridaAgendamentoDTO } from '../interface/CorridaAgendamentoDTO';

class CorridaAgendamentoRequests {

  private serverURL: string;
  private routeAgendarCorrida: string;

  constructor() {
    this.serverURL = SERVER_CFG.SERVER_URL;
    this.routeAgendarCorrida = SERVER_CFG.ENDPOINT_AGENDAR_CORRIDA;
  }

  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return { 'Authorization': `Bearer ${token}` };
  }

  async agendarCorrida(dados: CorridaAgendamentoDTO): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.serverURL}${this.routeAgendarCorrida}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeader()
          },
          body: JSON.stringify(dados)
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao agendar corrida');
      }

      return true;

    } catch (error) {
      console.error('Erro ao agendar corrida:', error);
      return false;
    }
  }
}

export default new CorridaAgendamentoRequests();