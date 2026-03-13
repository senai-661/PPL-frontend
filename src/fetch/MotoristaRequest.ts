import { SERVER_CFG } from '../appConfig';
import { MotoristaDTO } from '../interface/MotoristaDTO';


/**
 * Classe com a coleção de funções que farão as requisições à API
 * Esta classe representa apenas as requisições da entidade Motorista
 */
class MotoristaRequests {

    private serverURL: string;          // Variável para o endereço do servidor
    private routeListaMotoristas: string;   // Variável para a rota de listagem de Motoristas
    private routeCadastraMotorista: string; // Variável para a rota de cadastro de Motorista
    private routeAtualizaMotorista: string; // Variável para a rota de atualização de Motorista
    private routeRemoveMotorista: string;   // Variável para a rota de remoção do Motorista

    /**
     * O construtor é chamado automaticamente quando criamos uma nova instância da classe.
     * Ele define os valores iniciais das variáveis com base nas configurações da API.
     */
    constructor() {
        this.serverURL = SERVER_CFG.SERVER_URL;     // Endereço do servidor web
        this.routeListaMotoristas = SERVER_CFG.ENDPOINT_LISTAR_MOTORISTA;    // Rota configurada na API
        this.routeCadastraMotorista = SERVER_CFG.ENDPOINT_CADASTRAR_MOTORISTA;    // Rota configurada na API
        this.routeAtualizaMotorista = SERVER_CFG.ENDPOINT_ATUALIZAR_MOTORISTA; // Rota configurada na API
        this.routeRemoveMotorista = SERVER_CFG.ENDPOINT_REMOVER_MOTORISTA;    // Rota configurada na API
    }

    /**
     * Método que faz uma requisição à API para buscar a lista de Motoristas cadastrados
     * @returns Retorna um JSON com a lista de Motoristas ou null em caso de erro
     */
    async listarMotoristas(): Promise<MotoristaDTO[] | null> {
        const token = localStorage.getItem('token'); // recupera o token do localStorage
        try {
            // faz a requisição no servidor
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaMotoristas}`, {
                headers: {
                    'ladygagasenha': `${token}`
                }
            });

            // Verifica se a resposta foi bem-sucedida (status HTTP 200-299)
            if (respostaAPI.ok) {
                // converte a reposta para um JSON
                const listaDeMotoristas: MotoristaDTO[] = await respostaAPI.json();
                // retorna a resposta
                return listaDeMotoristas;
            } else {
                throw new Error("Não foi possível listar os Motoristas");
            }
        } catch (error) {
            // exibe detalhes do erro no console
            console.error(`Erro ao fazer a consulta de Motoristas: ${error}`);
            // retorna um valor nulo
            return null;
        }
    }

    async consultarMotorista(idMotorista: number): Promise<MotoristaDTO | null> {
        const token = localStorage.getItem('token');

        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaMotoristas}?idMotorista=${idMotorista}`, {
                headers: {
                    'ladygagasenha': `${token}`
                }
            });

            // Verifica se a resposta foi bem-sucedida (status HTTP 200-299)
            if (respostaAPI.ok) {
                // converte a reposta para um JSON
                const motorista: MotoristaDTO = await respostaAPI.json();
                // retorna a resposta
                return motorista;
            } else {
                throw new Error("Não foi possível consultar o Motorista");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de Motorista: ${error}`);
            return null;
        }
    }

    /**
     * Envia os dados do formulário Motorista para a API
     * @param formMotorista Objeto com os valores do formulário
     * @returns **true** se cadastro com sucesso, **false** se falha
     */
    async enviaFormularioMotorista(formMotorista: string): Promise<boolean> {
        const token = localStorage.getItem('token'); // recupera o token do localStorage
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeCadastraMotorista}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ladygagasenha': `${token}`
                },
                body: formMotorista
            });

            if(!respostaAPI.ok) {
                throw new Error('Erro ao fazer requisição com o servidor.');
            }

            return true;
        } catch (error) {
            console.error(`Erro ao enviar o formulário. ${error}`);
            return false;
        }
    }

    async removerMotorista(idMotorista: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeRemoveMotorista}?idMotorista=${idMotorista}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'ladygagasenha': `${token}`
                }
            });

            if(!respostaAPI.ok) {
                throw new Error('Erro ao fazer requisição à API.');
            }

            return true;
        } catch (error) {
            console.error(`Erro ao fazer solicitação. ${error}`);
            return false;
        }
    }

    async enviarFormularioAtualizacaoMotorista(formMotorista: MotoristaDTO): Promise<boolean> {
        const token = localStorage.getItem('token');

        try {
            const respostaAPI = 
            await fetch(`${this.serverURL}${this.routeAtualizaMotorista}?idMotorista=${formMotorista.idMotorista}`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'ladygagasenha': `${token}`
                    },
                    body: JSON.stringify(formMotorista)
                });

            if(!respostaAPI.ok) {
                throw new Error('Erro ao fazer requisição com o servidor.');
            }

            return true;
        } catch (error) {
            console.error(`Erro ao enviar requisição. ${error}`);
            return false;
        }
    }
}

// Exporta a classe já instanciando um objeto da mesma
export default new MotoristaRequests();
