import { SERVER_CFG } from '../appConfig';
import { MotoristaDTO } from '../dto/MotoristaDTO';

class MotoristaRequests {
  private serverURL: string;
  private routeListaMotoristas: string;
  private routeCadastraMotorista: string;
  private routeAtualizaMotorista: string;
  private routeRemoveMotorista: string;

  constructor() {
    this.serverURL = SERVER_CFG.SERVER_URL;
    this.routeListaMotoristas = SERVER_CFG.ENDPOINT_LISTAR_MOTORISTA;
    this.routeCadastraMotorista = SERVER_CFG.ENDPOINT_CADASTRAR_MOTORISTA;
    this.routeAtualizaMotorista = SERVER_CFG.ENDPOINT_ATUALIZAR_MOTORISTA;
    this.routeRemoveMotorista = SERVER_CFG.ENDPOINT_REMOVER_MOTORISTA;
  }

  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  private mapMotorista(m: any): MotoristaDTO {
    return {
      idMotorista: m.idMotorista ?? m.id ?? m.id_motorista,
      nome: m.nome,
      sobrenome: m.sobrenome,
      cpf: m.cpf,
      cnh: m.cnh,
      dataNascimento: m.dataNascimento ?? m.data_nascimento,
      celular: m.celular,
      email: m.email,
      antecedentesCriminais: m.antecedentes ?? m.antecedentes_criminais,
      especializacao: m.especializacao,
      senha: '',
    };
  }

  async listarMotoristas(): Promise<MotoristaDTO[] | null> {
    try {
      const respostaAPI = await fetch(`${this.serverURL}${this.routeListaMotoristas}`, {
        headers: this.getAuthHeader(),
      });

      if (!respostaAPI.ok) {
        throw new Error('Não foi possível listar os motoristas');
      }

      const lista: any[] = await respostaAPI.json();
      return lista.map(this.mapMotorista);
    } catch (error) {
      console.error(`Erro ao fazer a consulta de motoristas: ${error}`);
      return null;
    }
  }

  async consultarMotorista(idMotorista: number): Promise<MotoristaDTO | null> {
    try {
      const respostaAPI = await fetch(
        `${this.serverURL}${this.routeListaMotoristas}?idMotorista=${idMotorista}`,
        {
          headers: this.getAuthHeader(),
        },
      );

      if (!respostaAPI.ok) {
        throw new Error('Não foi possível consultar o motorista');
      }

      const motorista: any = await respostaAPI.json();
      return this.mapMotorista(motorista);
    } catch (error) {
      console.error(`Erro ao fazer a consulta de motorista: ${error}`);
      return null;
    }
  }

  async enviaFormularioMotorista(formMotorista: string): Promise<void> {
    const respostaAPI = await fetch(`${this.serverURL}${this.routeCadastraMotorista}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formMotorista,
    });

    let data: { mensagem?: string } | null = null;

    try {
      data = (await respostaAPI.json()) as { mensagem?: string };
    } catch {
      data = null;
    }

    if (!respostaAPI.ok) {
      throw new Error(data?.mensagem || 'Erro ao cadastrar motorista.');
    }
  }

  async removerMotorista(idMotorista: number): Promise<boolean> {
    try {
      const respostaAPI = await fetch(
        `${this.serverURL}${this.routeRemoveMotorista}?idMotorista=${idMotorista}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeader(),
          },
        },
      );

      if (!respostaAPI.ok) {
        throw new Error('Erro ao fazer requisição à API.');
      }
      return true;
    } catch (error) {
      console.error(`Erro ao fazer solicitação. ${error}`);
      return false;
    }
  }

  async enviarFormularioAtualizacaoMotorista(formMotorista: MotoristaDTO): Promise<boolean> {
    try {
      const respostaAPI = await fetch(
        `${this.serverURL}${this.routeAtualizaMotorista}?idMotorista=${formMotorista.idMotorista}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeader(),
          },
          body: JSON.stringify(formMotorista),
        },
      );

      if (!respostaAPI.ok) {
        throw new Error('Erro ao fazer requisição com o servidor.');
      }
      return true;
    } catch (error) {
      console.error(`Erro ao enviar requisição. ${error}`);
      return false;
    }
  }

  async atualizarMotoristaPorAdmin(idMotorista: number, dados: Partial<MotoristaDTO>): Promise<boolean> {
    try {
      const respostaAPI = await fetch(`${this.serverURL}/api/admin/motoristas/${idMotorista}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(dados),
      });

      if (!respostaAPI.ok) {
        throw new Error('Erro ao atualizar motorista por admin.');
      }
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar motorista por admin: ${error}`);
      return false;
    }
  }
}

export default new MotoristaRequests();
