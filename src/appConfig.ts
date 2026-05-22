
export const APP_ROUTES = {
    ROUTE_HOME: '/',
    ROUTE_LOGIN: '/login',

    ROUTE_LISTAGEM_PASSAGEIRO: '/api/passageiros',
    ROUTE_LISTAGEM_CARROS: '/api/veiculos',
    ROUTE_LISTAGEM_MOTORISTA: '/api/motoristas',

    ROUTE_CADASTRO_PASSAGEIRO: '/api/registrar',
    ROUTE_CADASTRO_CARROS: '/api/cadastro/veiculos',
    ROUTE_CADASTRO_MOTORISTA: '/api/registrar',

    ROUTE_ATUALIZACAO_PASSAGEIRO: '/api/passageiro/perfil',
    ROUTE_ATUALIZACAO_MOTORISTA: '/api/motorista/perfil',
}

/**
 * Configurações referente ao servidor da API
 */
export const SERVER_CFG = {

    SERVER_URL: 'http://localhost:3333',

    // PASSAGEIRO
    ENDPOINT_LISTAR_PASSAGEIRO: '/api/passageiros',
    ENDPOINT_CADASTRAR_PASSAGEIRO: '/api/registrar',
    ENDPOINT_ATUALIZAR_PASSAGEIRO: '/api/passageiro/perfil',
    ENDPOINT_REMOVER_PASSAGEIRO: '/api/passageiro/delete',

    // MOTORISTA
    ENDPOINT_LISTAR_MOTORISTA: '/api/motoristas',
    ENDPOINT_CADASTRAR_MOTORISTA: '/api/registrar',
    ENDPOINT_ATUALIZAR_MOTORISTA: '/api/motorista/perfil',
    ENDPOINT_REMOVER_MOTORISTA: '/api/motorista/delete',

    // CARRO
    ENDPOINT_LISTAR_CARRO: '/api/veiculos',
    ENDPOINT_CADASTRAR_CARRO: '/api/cadastro/veiculos',
    ENDPOINT_ATUALIZAR_CARRO: '/api/carro/update',
    ENDPOINT_REMOVER_CARRO: '/api/carro/delete',

    // LOGIN
    ENDPOINT_AUTH_LOGIN: '/api/login',
}

/** Enumeração dos status */
export const STATUS_CARRO = {
    STATUS_EM_ANDAMENTO: 'Em andamento',
    STATUS_CONCLUIDO: 'Concluído',
    STATUS_ATRASADO: 'Atrasado'
}