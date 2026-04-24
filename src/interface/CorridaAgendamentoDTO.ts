export interface CorridaAgendamentoDTO {
  idPassageiro: number;
  origemCorrida: string;
  destinoCorrida: string;
  tipoCorrida: string;
  dataAgendada: string | null;
  statusAgendamento: string | null;
  preco: number;
}