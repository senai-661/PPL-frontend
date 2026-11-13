import { SERVER_CFG } from '../appConfig';

export interface AvaliacaoDTO {
  idAvaliacao?: number;
  idCorrida: number;
  nota: number;
  comentario?: string;
  criadoEm?: string;
}

class AvaliacaoRequests {
  private serverURL: string;

  constructor() {
    this.serverURL = SERVER_CFG.SERVER_URL;
  }

  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async listarAvaliacoes(): Promise<any[] | null> {
    try {
      const res = await fetch(`${this.serverURL}/api/avaliacoes`, {
        headers: this.getAuthHeader(),
      });
      if (!res.ok) throw new Error('Não foi possível listar as avaliações.');
      return await res.json();
    } catch (error) {
      console.error('Erro ao listar avaliações:', error);
      return null;
    }
  }

  async consultarAvaliacao(idAvaliacao: number): Promise<any | null> {
    try {
      const res = await fetch(`${this.serverURL}/api/avaliacoes/${idAvaliacao}`, {
        headers: this.getAuthHeader(),
      });
      if (!res.ok) throw new Error('Não foi possível consultar a avaliação.');
      return await res.json();
    } catch (error) {
      console.error('Erro ao consultar avaliação:', error);
      return null;
    }
  }

  async criarAvaliacao(dados: { idCorrida: number; nota: number; comentario?: string }): Promise<boolean> {
    try {
      const res = await fetch(`${this.serverURL}/api/avaliacoes`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(dados),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensagem || 'Erro ao registrar avaliação.');
      }
      return true;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  }

  async minhasAvaliacoes(): Promise<any | null> {
    try {
      const res = await fetch(`${this.serverURL}/api/avaliacoes/minhas`, {
        headers: this.getAuthHeader(),
      });
      if (!res.ok) throw new Error('Não foi possível carregar as avaliações.');
      return await res.json();
    } catch (error) {
      console.error('Erro ao carregar minhas avaliações:', error);
      return null;
    }
  }

  async atualizarAvaliacao(idAvaliacao: number, dados: { nota: number; comentario?: string }): Promise<boolean> {
    try {
      const res = await fetch(`${this.serverURL}/api/avaliacoes/${idAvaliacao}`, {
        method: 'PATCH',
        headers: this.getAuthHeader(),
        body: JSON.stringify(dados),
      });
      return res.ok;
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      return false;
    }
  }

  async removerAvaliacao(idAvaliacao: number): Promise<boolean> {
    try {
      const res = await fetch(`${this.serverURL}/api/avaliacoes/${idAvaliacao}`, {
        method: 'DELETE',
        headers: this.getAuthHeader(),
      });
      return res.ok;
    } catch (error) {
      console.error('Erro ao remover avaliação:', error);
      return false;
    }
  }
}

export default new AvaliacaoRequests();
