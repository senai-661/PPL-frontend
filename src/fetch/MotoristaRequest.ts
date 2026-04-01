import { SERVER_CFG } from '../appConfig';
import { MotoristaDTO } from '../interface/MotoristaDTO';

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
        return { 'Authorization': `Bearer ${token}` };
    }

    // O backend retorna: { id, nome, sobrenome, cpf, cnh, dataNascimento, celular, email, antecedentes, especializacao }
    // Aqui mapeamos para o formato que o DTO e os componentes esperam
    private mapMotorista(m: any): MotoristaDTO {
        return {
            idMotorista: m.id,
            nome: m.nome,
            sobrenome: m.sobrenome,
            cpf: m.cpf,
            cnh: m.cnh,
            dataNascimento: m.dataNascimento,
            celular: m.celular,
            email: m.email,
            antecedentesCriminais: m.antecedentes,
            especializacao: m.especializacao,
            senha: '',
        };
    }

    async listarMotoristas(): Promise<MotoristaDTO[] | null> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaMotoristas}`, {
                headers: this.getAuthHeader()
            });

            if (respostaAPI.ok) {
                const lista: any[] = await respostaAPI.json();
                return lista.map(this.mapMotorista);
            } else {
                throw new Error("Não foi possível listar os Motoristas");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de Motoristas: ${error}`);
            return null;
        }
    }

    async consultarMotorista(idMotorista: number): Promise<MotoristaDTO | null> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaMotoristas}?idMotorista=${idMotorista}`, {
                headers: this.getAuthHeader()
            });

            if (respostaAPI.ok) {
                const motorista: any = await respostaAPI.json();
                return this.mapMotorista(motorista);
            } else {
                throw new Error("Não foi possível consultar o Motorista");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de Motorista: ${error}`);
            return null;
        }
    }

    async enviaFormularioMotorista(formMotorista: string): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeCadastraMotorista}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: formMotorista
            });

            if (!respostaAPI.ok) throw new Error('Erro ao fazer requisição com o servidor.');
            return true;
        } catch (error) {
            console.error(`Erro ao enviar o formulário. ${error}`);
            return false;
        }
    }

    async removerMotorista(idMotorista: number): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeRemoveMotorista}?idMotorista=${idMotorista}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });

            if (!respostaAPI.ok) throw new Error('Erro ao fazer requisição à API.');
            return true;
        } catch (error) {
            console.error(`Erro ao fazer solicitação. ${error}`);
            return false;
        }
    }

    async enviarFormularioAtualizacaoMotorista(formMotorista: MotoristaDTO): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeAtualizaMotorista}?idMotorista=${formMotorista.idMotorista}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(formMotorista)
            });

            if (!respostaAPI.ok) throw new Error('Erro ao fazer requisição com o servidor.');
            return true;
        } catch (error) {
            console.error(`Erro ao enviar requisição. ${error}`);
            return false;
        }
    }
}

export default new MotoristaRequests();