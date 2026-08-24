import { SERVER_CFG } from '../appConfig';
import { VeiculoDTO } from '../dto/VeiculoDTO';

class CarroRequests {

    private serverURL: string;
    private routeListaCarros: string;
    private routeListaCarro: string;
    private routeCadastraCarro: string;
    private routeAtualizaCarro: string;
    private routeRemoveCarro: string;

    constructor() {
        this.serverURL = SERVER_CFG.SERVER_URL;
        this.routeListaCarros = SERVER_CFG.ENDPOINT_LISTAR_CARRO;
        this.routeListaCarro = SERVER_CFG.ENDPOINT_LISTAR_CARRO;
        this.routeCadastraCarro = SERVER_CFG.ENDPOINT_CADASTRAR_CARRO;
        this.routeAtualizaCarro = SERVER_CFG.ENDPOINT_ATUALIZAR_CARRO;
        this.routeRemoveCarro = SERVER_CFG.ENDPOINT_REMOVER_CARRO;
    }

    private getAuthHeader() {
        const token = localStorage.getItem('token');
        return { 'Authorization': `Bearer ${token}` };
    }

    // O VeiculoController retorna os objetos da classe Veiculo com os atributos privados
    // que são serializados pelo JSON.stringify como: id_veiculo, id_motorista, placa, tipo_veiculo, modelo_veiculo
    // Aqui mapeamos para o formato que o DTO e os componentes esperam
    private mapVeiculo(v: any): VeiculoDTO {
        return {
            idVeiculo: v.idVeiculo ?? v.id_veiculo,
            idMotorista: v.idMotorista ?? v.id_motorista,
            placa: v.placa,
            tipoVeiculo: v.tipoVeiculo ?? v.tipo_veiculo,
            modeloVeiculo: v.modeloVeiculo ?? v.modelo_veiculo,
        };
    }

    async listarCarros(): Promise<VeiculoDTO[] | null> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaCarros}`, {
                headers: this.getAuthHeader()
            });

            if (respostaAPI.ok) {
                const lista: any[] = await respostaAPI.json();
                return lista.map(this.mapVeiculo);
            } else {
                throw new Error("Não foi possível listar os Veículos");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de Veículos: ${error}`);
            return null;
        }
    }

    async consultarCarro(idVeiculo: number): Promise<VeiculoDTO | null> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeListaCarro}?idVeiculo=${idVeiculo}`, {
                headers: this.getAuthHeader()
            });

            if (respostaAPI.ok) {
                const veiculo: any = await respostaAPI.json();
                return this.mapVeiculo(veiculo);
            } else {
                throw new Error("Não foi possível consultar o Veículo");
            }
        } catch (error) {
            console.error(`Erro ao fazer a consulta de Veículo: ${error}`);
            return null;
        }
    }

    async enviaFormularioCarro(formCarro: string): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeCadastraCarro}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: formCarro
            });

            if (!respostaAPI.ok) throw new Error('Erro ao fazer requisição com o servidor.');
            return true;
        } catch (error) {
            console.error(`Erro ao enviar o formulário. ${error}`);
            return false;
        }
    }

    async removerCarro(idVeiculo: number): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeRemoveCarro}?idVeiculo=${idVeiculo}`, {
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

    async enviarFormularioAtualizacaoCarro(formCarro: VeiculoDTO): Promise<boolean> {
        try {
            const respostaAPI = await fetch(`${this.serverURL}${this.routeAtualizaCarro}?idVeiculo=${formCarro.idVeiculo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(formCarro)
            });

            if (!respostaAPI.ok) throw new Error('Erro ao fazer requisição com o servidor.');
            return true;
        } catch (error) {
            console.error(`Erro ao enviar requisição. ${error}`);
            return false;
        }
    }
}

export default new CarroRequests();