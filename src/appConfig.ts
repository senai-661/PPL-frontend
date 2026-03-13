
/**
 * Configuração de todas as rotas da interface web
 * Todas os endereços das páginas devem ser inseridas em APP_ROUTES
 * Essas rotas serão refenciadas no componente AppRoutes que está no arquivo routes.tsx
 * e em qualquer página que tenha um link que faça o direcionamento para outra página ou componente
 */
export const APP_ROUTES = {
    ROUTE_HOME: '/',
    ROUTE_LOGIN: '/login',

    ROUTE_LISTAGEM_PASSAGEIRO: '/api/passageiros',
    ROUTE_LISTAGEM_CARROS: '/api/CARROs',
    ROUTE_LISTAGEM_MOTORISTA: '/api/motoristas',

    ROUTE_CADASTRO_PASSAGEIRO: '/api/passageiro/register',
    ROUTE_CADASTRO_CARROS: '/api/cadastro/veiculos',
    ROUTE_CADASTRO_MOTORISTA: '/api/motorista/register',

    ROUTE_ATUALIZACAO_PASSAGEIRO: '/api/passageiro/perfil',
    ROUTE_ATUALIZACAO_MOTORISTA: '/api/motorista/perfil',

}

/**
 * Configurações referente ao servidor da API
 * Todas as configurações referentes aos servidor web devem ser inseridas em SERVER_CFG
 * Todos os endereços configurados aqui são referentes as configurações do servidor web (backend)
 * Qualquer alteração nos endpoints, no endereço do servidor ou porta que forem feitas lá deve ser replicada aqui
 */
export const SERVER_CFG = {
    // endereço do servidor da API
    SERVER_URL: 'http://localhost:1285',
    
    // endpoints de PASSAGEIRO
    ENDPOINT_LISTAR_PASSAGEIRO: '/api/passageiros',
    ENDPOINT_CADASTRAR_PASSAGEIRO: '/api/passageiro/register',
    ENDPOINT_ATUALIZAR_PASSAGEIRO: '/api/passageiro/perfil',
    ENDPOINT_REMOVER_PASSAGEIRO: '/api/passageiro/delete',

    // endpoints de MOTORISTA
    ENDPOINT_LISTAR_MOTORISTA: '/api/motoristas',
    ENDPOINT_CADASTRAR_MOTORISTA: '/api/motorista/register',
    ENDPOINT_ATUALIZAR_MOTORISTA: '/api/motorista/perfil',
    ENDPOINT_REMOVER_MOTORISTA: '/api/motorista/delete',

    // endpoints de CARRO
    ENDPOINT_LISTAR_CARRO: '/api/veiculos',
    ENDPOINT_CADASTRAR_CARRO: '/api/cadastro/veiculos',
    ENDPOINT_ATUALIZAR_CARRO: '/api/carro/update',
    ENDPOINT_REMOVER_CARRO: '/api/carro/delete',

    // endpoint de login
    ENDPOINT_AUTH_LOGIN: '/login',

}

/** Enumeração dos status do empréstimo */
export const STATUS_CARRO = {
    STATUS_EM_ANDAMENTO: 'Em andamento',
    STATUS_CONCLUIDO: 'Concluído',
    STATUS_ATRASADO: 'Atrasado'
}