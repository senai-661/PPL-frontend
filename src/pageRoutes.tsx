import AdministradorHomepageAdministradorPage from "./pages/Administrador/homepage-administrador";
import AdministradorTabelaCarrosPage from "./pages/Administrador/tabela-carros";
import AdministradorTabelaMotoristasPage from "./pages/Administrador/tabela-motoristas";
import AdministradorTabelaPassageirosPage from "./pages/Administrador/tabela-passageiros";
import AeroportosPage from "./pages/aeroportos";
import AjudaPage from "./pages/ajuda";
import CarreirasPage from "./pages/carreiras";
import CidadesPage from "./pages/cidades";
import ComidaPage from "./pages/comida";
import CorridaPage from "./pages/corrida";
import DiretrizesPage from "./pages/diretrizes";
import DirigirPage from "./pages/dirigir";
import DiversidadePage from "./pages/diversidade";
import EmpresasPage from "./pages/empresas";
import EntregaPage from "./pages/entrega";
import ImprensaPage from "./pages/imprensa";
import LoginPage from "./pages/login";
import MotoristaCadastroCarroPage from "./pages/Motorista/cadastro-carro";
import MotoristaCadastroDirigirPage from "./pages/Motorista/cadastro-dirigir";
import MotoristaCadastroMotoristaPage from "./pages/Motorista/cadastro-motorista";
import MotoristaHomepageMotoristaPage from "./pages/Motorista/homepage-motorista";
import MotoristaPerfilMotoristaPage from "./pages/Motorista/perfil-motorista";
import OpenlineVanPage from "./pages/openline-van";
import PassageiroCadastroPassageiroPage from "./pages/Passageiro/cadastro-passageiro";
import PassageiroHomepagePassageiroPage from "./pages/Passageiro/homepage-passageiro";
import PassageiroPerfilPassageiroPage from "./pages/Passageiro/perfil-passageiro";
import RecursosSegurancaPage from "./pages/recursos-seguranca";
import SegurancaPage from "./pages/seguranca";
import SobreNosPage from "./pages/sobre-nos";
import ViagemAvaliacaoViagemPage from "./pages/Viagem/avaliacao-viagem";
import ViagemDashboardViagemPage from "./pages/Viagem/dashboard-viagem";
import ViagemListaViagensPage from "./pages/Viagem/lista-viagens";
import ViagemNovaViagemPage from "./pages/Viagem/nova-viagem";

export type PageRoute = {
  routePath: string;
  legacyRoutePath: string;
  Component: () => JSX.Element;
};

export const pageRoutes: PageRoute[] = [
  {
    routePath: "/administrador/homepage-administrador",
    legacyRoutePath: "/pages/Administrador/homepage-administrador.html",
    Component: AdministradorHomepageAdministradorPage
  },
  {
    routePath: "/administrador/tabela-carros",
    legacyRoutePath: "/pages/Administrador/tabela-carros.html",
    Component: AdministradorTabelaCarrosPage
  },
  {
    routePath: "/administrador/tabela-motoristas",
    legacyRoutePath: "/pages/Administrador/tabela-motoristas.html",
    Component: AdministradorTabelaMotoristasPage
  },
  {
    routePath: "/administrador/tabela-passageiros",
    legacyRoutePath: "/pages/Administrador/tabela-passageiros.html",
    Component: AdministradorTabelaPassageirosPage
  },
  {
    routePath: "/aeroportos",
    legacyRoutePath: "/pages/aeroportos.html",
    Component: AeroportosPage
  },
  {
    routePath: "/ajuda",
    legacyRoutePath: "/pages/ajuda.html",
    Component: AjudaPage
  },
  {
    routePath: "/carreiras",
    legacyRoutePath: "/pages/carreiras.html",
    Component: CarreirasPage
  },
  {
    routePath: "/cidades",
    legacyRoutePath: "/pages/cidades.html",
    Component: CidadesPage
  },
  {
    routePath: "/comida",
    legacyRoutePath: "/pages/comida.html",
    Component: ComidaPage
  },
  {
    routePath: "/corrida",
    legacyRoutePath: "/pages/corrida.html",
    Component: CorridaPage
  },
  {
    routePath: "/diretrizes",
    legacyRoutePath: "/pages/diretrizes.html",
    Component: DiretrizesPage
  },
  {
    routePath: "/dirigir",
    legacyRoutePath: "/pages/dirigir.html",
    Component: DirigirPage
  },
  {
    routePath: "/diversidade",
    legacyRoutePath: "/pages/diversidade.html",
    Component: DiversidadePage
  },
  {
    routePath: "/empresas",
    legacyRoutePath: "/pages/empresas.html",
    Component: EmpresasPage
  },
  {
    routePath: "/entrega",
    legacyRoutePath: "/pages/entrega.html",
    Component: EntregaPage
  },
  {
    routePath: "/imprensa",
    legacyRoutePath: "/pages/imprensa.html",
    Component: ImprensaPage
  },
  {
    routePath: "/login",
    legacyRoutePath: "/pages/login.html",
    Component: LoginPage
  },
  {
    routePath: "/motorista/cadastro-carro",
    legacyRoutePath: "/pages/Motorista/cadastro-carro.html",
    Component: MotoristaCadastroCarroPage
  },
  {
    routePath: "/motorista/cadastro-dirigir",
    legacyRoutePath: "/pages/Motorista/cadastro-dirigir.html",
    Component: MotoristaCadastroDirigirPage
  },
  {
    routePath: "/motorista/cadastro-motorista",
    legacyRoutePath: "/pages/Motorista/cadastro-motorista.html",
    Component: MotoristaCadastroMotoristaPage
  },
  {
    routePath: "/motorista/homepage-motorista",
    legacyRoutePath: "/pages/Motorista/homepage-motorista.html",
    Component: MotoristaHomepageMotoristaPage
  },
  {
    routePath: "/motorista/perfil-motorista",
    legacyRoutePath: "/pages/Motorista/perfil-motorista.html",
    Component: MotoristaPerfilMotoristaPage
  },
  {
    routePath: "/openline-van",
    legacyRoutePath: "/pages/openline-van.html",
    Component: OpenlineVanPage
  },
  {
    routePath: "/passageiro/cadastro-passageiro",
    legacyRoutePath: "/pages/Passageiro/cadastro-passageiro.html",
    Component: PassageiroCadastroPassageiroPage
  },
  {
    routePath: "/passageiro/homepage-passageiro",
    legacyRoutePath: "/pages/Passageiro/homepage-passageiro.html",
    Component: PassageiroHomepagePassageiroPage
  },
  {
    routePath: "/passageiro/perfil-passageiro",
    legacyRoutePath: "/pages/Passageiro/perfil-passageiro.html",
    Component: PassageiroPerfilPassageiroPage
  },
  {
    routePath: "/recursos-seguranca",
    legacyRoutePath: "/pages/recursos-seguranca.html",
    Component: RecursosSegurancaPage
  },
  {
    routePath: "/seguranca",
    legacyRoutePath: "/pages/seguranca.html",
    Component: SegurancaPage
  },
  {
    routePath: "/sobre-nos",
    legacyRoutePath: "/pages/sobre-nos.html",
    Component: SobreNosPage
  },
  {
    routePath: "/viagem/avaliacao-viagem",
    legacyRoutePath: "/pages/Viagem/avaliacao-viagem.html",
    Component: ViagemAvaliacaoViagemPage
  },
  {
    routePath: "/viagem/dashboard-viagem",
    legacyRoutePath: "/pages/Viagem/dashboard-viagem.html",
    Component: ViagemDashboardViagemPage
  },
  {
    routePath: "/viagem/lista-viagens",
    legacyRoutePath: "/pages/Viagem/lista-viagens.html",
    Component: ViagemListaViagensPage
  },
  {
    routePath: "/viagem/nova-viagem",
    legacyRoutePath: "/pages/Viagem/nova-viagem.html",
    Component: ViagemNovaViagemPage
  }
];
