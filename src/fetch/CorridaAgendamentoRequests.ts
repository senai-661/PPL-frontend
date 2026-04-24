import api from './api';

export interface CorridaAgendamentoDTO {
  idPassageiro?: number;
  origemCorrida: string;
  destinoCorrida: string;
  tipoCorrida?: string;
  dataAgendada: string;
  preco?: number;
}

class CorridaAgendamentoRequests {
  
  async criarAgendamento(data: CorridaAgendamentoDTO) {
    const response = await api.post('/api/corridas-agendadas', {
      ...data,
      statusAgendamento: 'PENDENTE',
      tipoCorrida: data.tipoCorrida || 'NORMAL'
    });
    return response.data;
  }

  async listarAgendamentos() {
    const response = await api.get('/api/corridas-agendadas');
    return response.data;
  }
}

export default new CorridaAgendamentoRequests();