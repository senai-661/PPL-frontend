export interface CorridaAgendamentoDTO {
  idAgendamento?: number;
  idPassageiro: number;
  origemCorrida: string;
  destinoCorrida: string;
  tipoCorrida: string;
  dataAgendada: Date | string;
  statusAgendamento: string;
  preco: number;
  criadoEm?: Date;
}