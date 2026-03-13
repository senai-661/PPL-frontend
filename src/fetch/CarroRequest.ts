import { SERVER_CFG } from '../appConfig';
import { VeiculoDTO } from '../interface/VeiculoDTO';

/**
 * Classe com a coleção de funções que farão as requisições à API
 * Esta classe representa apenas as requisições da entidade Carro
 */
class CarroRequests {

    private serverURL: string;          // Variável para o endereço do servidor
    private routeListaCarros: string;   // Variável para a rota de listagem de Carros
    private routeListaCarro: string;   // Variável para a rota de listagem de Carro
    private routeCadastraCarro: string; // Variável para a rota de cadastro de Carro
    private routeAtualizaCarro: string; // Variável para a rota de atualiação de Carro
    private routeRemoveCarro: string;   // Variável para a rota de remoção do Carro

    /**
     * O construtor é chamado automaticamente quando criamos uma nova instância da classe.
     * Ele define os valores iniciais das variáveis com base nas configurações da API.
     */
    constructor() {
        this.serverURL = SERVER_CFG.SERVER_URL;     // Endereço do servidor web
        this.routeListaCarros = SERVER_CFG.ENDPOINT_LISTAR_CARRO;    // Rota configurada na API
        this.routeListaCarro = SERVER_CFG.ENDPOINT_LISTAR_CARRO;    // Rota configurada na API
        this.routeCadastraCarro = SERVER_CFG.ENDPOINT_CADASTRAR_CARRO;    // Rota configurada na API
        this.routeAtualizaCarro = SERVER_CFG.ENDPOINT_ATUALIZAR_CARRO; // Rota configurada na API
        this.routeRemoveCarro = SERVER_CFG.ENDPOINT_REMOVER_CARRO;    // Rota configurada na API
    }

    /**
     * Método que faz uma requisição à API para buscar a lista de Carros cadastrados
     * @returns Retorna um JSON com a lista de Carros ou null em caso de erro
     */
    async listarCarros(): Promise<VeiculoDTO | null> {
        const token = localStorage.getItem('token'); // recupera o token do localStorage
        try {
            // faz a requisição no servidor
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaCarros}`, {
                headers: {
                    'ladygagasenha': `${token}`
                }
            });

            // Verifica se a resposta foi bem-sucedida (status HTTP 200-299)
            if (respostaAPI.ok) {
                // converte a reposta para um JSON
                const listaDeCarros: VeiculoDTO = await respostaAPI.json();
                // retorna a resposta
                return listaDeCarros;
            } else {
                throw new Error("Não foi possível listar os Carros");
            }
        } catch (error) {
            // exibe detalhes do erro no console
            console.error(`Erro ao fazer a consulta de Carros: ${error}`);
            // retorna um valor nulo
            return null;
        }
    }

    async consultarCarro(idVeiculo: number): Promise<VeiculoDTO | null> {
        const token = localStorage.getItem('token');

        try {
            console.log('fazendo consulta');
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaCarro}?idVeiculo=${idVeiculo}`, {
                headers: {
                    'ladygagasenha': `${token}`
                }
            });

            console.log('resposta: ' + JSON.stringify(respostaAPI));

            // Verifica se a resposta foi bem-sucedida (status HTTP 200-299)
            if (respostaAPI.ok) {
                // converte a reposta para um JSON
                const Carro: VeiculoDTO = await respostaAPI.json();
                // retorna a resposta
                return Carro;
            } else {
                throw new Error("Não foi possível listar os Carros");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de Carro: ${error}`);
            return null;
        }
    }

    /**
     * Envia os dados do formulário Carro para a API
     * @param formCarro Objeto com os valores do formulário
     * @returns **true** se cadastro com sucesso, **false** se falha
     */
    async enviaFormularioCarro(formCarro: string): Promise<boolean> {
        const token = localStorage.getItem('token'); // recupera o token do localStorage
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeCadastraCarro}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ladygagasenha': `${token}`
                },
                body: formCarro
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

    async removerCarro(idVeiculo: number): Promise<boolean> {
        const token = localStorage.getItem('token');
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeRemoveCarro}?idVeiculo=${idVeiculo}`, {
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

    async enviarFormularioAtualizacaoCarro(formCarro: VeiculoDTO): Promise<boolean> {
        const token = localStorage.getItem('token');

        try {
            const respostaAPI = 
            await fetch(`${this.serverURL}${this.routeAtualizaCarro}?idVeiculo=${formCarro.idVeiculo}`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'ladygagasenha': `${token}`
                    },
                    body: JSON.stringify(formCarro)
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
export default new CarroRequests();