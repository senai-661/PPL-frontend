import { SERVER_CFG } from '../appConfig';
import { PassageiroDTO } from '../interface/PassageiroDTO';

class PassageiroRequests {

    private serverURL: string;
    private routeListaPassageiros: string;
    private routeCadastraPassageiro: string;
    private routeAtualizaPassageiro: string;
    private routeRemovePassageiro: string;

    constructor() {
        this.serverURL = SERVER_CFG.SERVER_URL;
        this.routeListaPassageiros = SERVER_CFG.ENDPOINT_LISTAR_PASSAGEIRO;
        this.routeCadastraPassageiro = SERVER_CFG.ENDPOINT_CADASTRAR_PASSAGEIRO;
        this.routeAtualizaPassageiro = SERVER_CFG.ENDPOINT_ATUALIZAR_PASSAGEIRO;
        this.routeRemovePassageiro = SERVER_CFG.ENDPOINT_REMOVER_PASSAGEIRO;
    }

    private getAuthHeader() {
        const token = localStorage.getItem('token');
        return { 'Authorization': `Bearer ${token}` };
    }

    // O backend retorna: { id, nome, sobrenome, cpf, dataNascimento, celular, email, necessidades, tipoViagem, preferenciaClima }
    // Aqui mapeamos para o formato que o DTO e os componentes esperam
    private mapPassageiro(p: any): PassageiroDTO {
        return {
            idPassageiro: p.id,
            nome: p.nome,
            sobrenome: p.sobrenome,
            cpf: p.cpf,
            dataNascimento: p.dataNascimento,
            celular: p.celular,
            email: p.email,
            necessidades: p.necessidades ?? [],
            senha: '',
        };
    }

    async listarPassageiros(): Promise<PassageiroDTO[] | null> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaPassageiros}`, {
                headers: this.getAuthHeader()
            });

            if (respostaAPI.ok) {
                const lista: any[] = await respostaAPI.json();
                return lista.map(this.mapPassageiro);
            } else {
                throw new Error("Não foi possível listar os Passageiros");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de Passageiros: ${error}`);
            return null;
        }
    }

    async consultarPassageiro(idPassageiro: number): Promise<PassageiroDTO | null> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaPassageiros}?idPassageiro=${idPassageiro}`, {
                headers: this.getAuthHeader()
            });

            if (respostaAPI.ok) {
                const passageiro: any = await respostaAPI.json();
                return this.mapPassageiro(passageiro);
            } else {
                throw new Error("Não foi possível consultar o Passageiro");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de Passageiro: ${error}`);
            return null;
        }
    }

    async enviaFormularioPassageiro(formPassageiro: string): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeCadastraPassageiro}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: formPassageiro
            });

            if (!respostaAPI.ok) throw new Error('Erro ao fazer requisição com o servidor.');
            return true;
        } catch (error) {
            console.error(`Erro ao enviar o formulário. ${error}`);
            return false;
        }
    }

    async removerPassageiro(idPassageiro: number): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeRemovePassageiro}?idPassageiro=${idPassageiro}`, {
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

    async enviarFormularioAtualizacaoPassageiro(formPassageiro: PassageiroDTO): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeAtualizaPassageiro}?idPassageiro=${formPassageiro.idPassageiro}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(formPassageiro)
            });

            if (!respostaAPI.ok) throw new Error('Erro ao fazer requisição com o servidor.');
            return true;
        } catch (error) {
            console.error(`Erro ao enviar requisição. ${error}`);
            return false;
        }
    }
}

export default new PassageiroRequests();