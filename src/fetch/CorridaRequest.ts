// PPL-frontend/src/fetch/CorridaRequest.ts
import { SERVER_CFG } from '../appConfig';

class CorridaRequest {
  private static getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Buscar histórico de corridas do motorista/passageiro logado
  static async getHistorico(): Promise<any> {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/historico`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Erro ao buscar histórico');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro em getHistorico:', error);
      throw error;
    }
  }

  // Buscar corrida por ID
  static async getCorridaById(idCorrida: number): Promise<any> {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/${idCorrida}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Erro ao buscar corrida');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro em getCorridaById:', error);
      throw error;
    }
  }

  // Buscar corrida atual do passageiro
  static async getCorridaAtualPassageiro(): Promise<any> {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/passageiro/corrida-atual`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Erro ao buscar corrida atual');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro em getCorridaAtualPassageiro:', error);
      throw error;
    }
  }

  // Buscar corrida atual do motorista
  static async getCorridaAtualMotorista(): Promise<any> {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/motorista/corrida-atual`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Erro ao buscar corrida atual');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro em getCorridaAtualMotorista:', error);
      throw error;
    }
  }

  // Solicitar nova corrida (passageiro)
  static async solicitarCorrida(data: {
    origemCorrida: string;
    destinoCorrida: string;
    latOrigem: number;
    lngOrigem: number;
    latDestino: number;
    lngDestino: number;
    tipoCorrida?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Erro ao solicitar corrida');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro em solicitarCorrida:', error);
      throw error;
    }
  }

  // Aceitar corrida (motorista)
  static async aceitarCorrida(idCorrida: number): Promise<any> {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/${idCorrida}/aceitar`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Erro ao aceitar corrida');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro em aceitarCorrida:', error);
      throw error;
    }
  }

  // Iniciar corrida (motorista)
  static async iniciarCorrida(idCorrida: number): Promise<any> {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/${idCorrida}/iniciar`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Erro ao iniciar corrida');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro em iniciarCorrida:', error);
      throw error;
    }
  }

  // Finalizar corrida (motorista)
  static async finalizarCorrida(idCorrida: number): Promise<any> {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/${idCorrida}/finalizar`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Erro ao finalizar corrida');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro em finalizarCorrida:', error);
      throw error;
    }
  }

  // Cancelar corrida
  static async cancelarCorrida(idCorrida: number, motivoCancelamento?: string): Promise<any> {
    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/corridas/${idCorrida}/cancelar`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ motivoCancelamento }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Erro ao cancelar corrida');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro em cancelarCorrida:', error);
      throw error;
    }
  }
}

export default CorridaRequest;