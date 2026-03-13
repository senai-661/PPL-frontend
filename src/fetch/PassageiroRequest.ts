import { SERVER_CFG } from '../appConfig';
import { PassageiroDTO } from '../interface/PassageiroDTO';

/**
 * Classe com a coleção de funções que farão as requisições à API
 * Esta classe representa apenas as requisições da entidade Passageiro
 */
class PassageiroRequests {

    private serverURL: string;          // Variável para o endereço do servidor
    private routeListaPassageiros: string;   // Variável para a rota de listagem de Passageiros
    private routeCadastraPassageiro: string; // Variável para a rota de cadastro de Passageiro
    private routeAtualizaPassageiro: string; // Variável para a rota de atualização de Passageiro
    private routeRemovePassageiro: string;   // Variável para a rota de remoção do Passageiro

    /**
     * O construtor é chamado automaticamente quando criamos uma nova instância da classe.
     * Ele define os valores iniciais das variáveis com base nas configurações da API.
     */
    constructor() {
        this.serverURL = SERVER_CFG.SERVER_URL;     // Endereço do servidor web
        this.routeListaPassageiros = SERVER_CFG.ENDPOINT_LISTAR_PASSAGEIRO;    // Rota configurada na API
        this.routeCadastraPassageiro = SERVER_CFG.ENDPOINT_CADASTRAR_PASSAGEIRO;    // Rota configurada na API
        this.routeAtualizaPassageiro = SERVER_CFG.ENDPOINT_ATUALIZAR_PASSAGEIRO; // Rota configurada na API
        this.routeRemovePassageiro = SERVER_CFG.ENDPOINT_REMOVER_PASSAGEIRO;    // Rota configurada na API
    }

    /**
     * Método que faz uma requisição à API para buscar a lista de Passageiros cadastrados
     * @returns Retorna um JSON com a lista de Passageiros ou null em caso de erro
     */
    async listarPassageiros(): Promise<PassageiroDTO[] | null> {
        const token = localStorage.getItem('token'); // recupera o token do localStorage
        try {
            // faz a requisição no servidor
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaPassageiros}`, {
                headers: {
                    'ladygagasenha': `${token}`
                }
            });

            // Verifica se a resposta foi bem-sucedida (status HTTP 200-299)
            if (respostaAPI.ok) {
                // converte a reposta para um JSON
                const listaDePassageiros: PassageiroDTO[] = await respostaAPI.json();
                // retorna a resposta
                return listaDePassageiros;
            } else {
                throw new Error("Não foi possível listar os Passageiros");
            }
        } catch (error) {
            // exibe detalhes do erro no console
            console.error(`Erro ao fazer a consulta de Passageiros: ${error}`);
            // retorna um valor nulo
            return null;
        }
    }

    async consultarPassageiro(idPassageiro: number): Promise<PassageiroDTO | null> {
        const token = localStorage.getItem('token');

        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaPassageiros}?idPassageiro=${idPassageiro}`, {
                headers: {
                    'ladygagasenha': `${token}`
                }
            });

            // Verifica se a resposta foi bem-sucedida (status HTTP 200-299)
            if (respostaAPI.ok) {
                // converte a reposta para um JSON
                const passageiro: PassageiroDTO = await respostaAPI.json();
                // retorna a resposta
                return passageiro;
            } else {
                throw new Error("Não foi possível consultar o Passageiro");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de Passageiro: ${error}`);
            return null;
        }
    }

    /**
     * Envia os dados do formulário Passageiro para a API
     * @param formPassageiro Objeto com os valores do formulário
     * @returns **true** se cadastro com sucesso, **false** se falha
     */
    async enviaFormularioPassageiro(formPassageiro: string): Promise<boolean> {
        const token = localStorage.getItem('token'); // recupera o token do localStorage
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeCadastraPassageiro}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ladygagasenha': `${token}`
                },
                body: formPassageiro
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

    async removerPassageiro(idPassageiro: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeRemovePassageiro}?idPassageiro=${idPassageiro}`, {
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

    async enviarFormularioAtualizacaoPassageiro(formPassageiro: PassageiroDTO): Promise<boolean> {
        const token = localStorage.getItem('token');

        try {
            const respostaAPI = 
            await fetch(`${this.serverURL}${this.routeAtualizaPassageiro}?idPassageiro=${formPassageiro.idPassageiro}`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'ladygagasenha': `${token}`
                    },
                    body: JSON.stringify(formPassageiro)
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
export default new PassageiroRequests();