import { BrowserRouter, Routes, Route } from 'react-router';
import { Header } from './Components/Cabecalho/Cabecalho';
import { Footer } from './Components/Rodapé/Rodape';
import { Home } from './Components/Inicio/Inicio';

// Importações temporárias das páginas antigas (serão migradas gradualmente)
import { About } from './pages/Sobre';
import { Services } from './pages/Servicos';
import { Accessibility } from './pages/Acessibilidade';
import { Contact } from './pages/Contato';
import { Airports } from './pages/Aeroportos';
import { Help } from './pages/Ajuda';
import { Careers } from './pages/Carreiras';
import { Cities } from './pages/Cidades';
import { Food } from './pages/Comida';
import { Ride } from './pages/Corrida';
import { Guidelines } from './pages/Diretrizes';
import { Drive } from './pages/Dirigir';
import { Diversity } from './pages/Diversidade';
import { Business } from './pages/Empresas';
import { Delivery } from './pages/Entrega';
import { Press } from './pages/Imprensa';
import { Login } from './pages/Login';
import { Van } from './pages/OpenlineVan';
import { SafetyResources } from './pages/RecursosSeguranca';
import { Safety } from './pages/Seguranca';
import { AdminDashboard } from './pages/Administrador/PainelAdministrador';
import { CarsTable } from './pages/Administrador/TabelaCarros';
import { DriversTable } from './pages/Administrador/TabelaMotoristas';
import { PassengersTable } from './pages/Administrador/TabelaPassageiros';
import { DriverRegistration } from './pages/Motorista/CadastroMotorista';
import { CarRegistration } from './pages/Motorista/CadastroCarro';
import { DriveRegistration } from './pages/Motorista/CadastroDirigir';
import { DriverDashboard } from './pages/Motorista/PainelMotorista';
import { DriverProfile } from './pages/Motorista/PerfilMotorista';
import { PassengerRegistration } from './pages/Passageiro/CadastroPassageiro';
import { PassengerDashboard } from './pages/Passageiro/PainelPassageiro';
import { PassengerProfile } from './pages/Passageiro/PerfilPassageiro';
import { TripRating } from './pages/Viagem/AvaliacaoViagem';
import { TripDashboard } from './pages/Viagem/PainelViagem';
import { TripList } from './pages/Viagem/ListaViagens';
import { NewTrip } from './pages/Viagem/NovaViagem';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell min-h-screen flex flex-col">
        <Header />
        <main className="app-main flex-1">
          <Routes>
            {/* General Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/acessibilidade" element={<Accessibility />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/aeroportos" element={<Airports />} />
            <Route path="/ajuda" element={<Help />} />
            <Route path="/carreiras" element={<Careers />} />
            <Route path="/cidades" element={<Cities />} />
            <Route path="/comida" element={<Food />} />
            <Route path="/corrida" element={<Ride />} />
            <Route path="/diretrizes" element={<Guidelines />} />
            <Route path="/dirigir" element={<Drive />} />
            <Route path="/diversidade" element={<Diversity />} />
            <Route path="/empresas" element={<Business />} />
            <Route path="/entrega" element={<Delivery />} />
            <Route path="/imprensa" element={<Press />} />
            <Route path="/login" element={<Login />} />
            <Route path="/openline-van" element={<Van />} />
            <Route path="/recursos-seguranca" element={<SafetyResources />} />
            <Route path="/seguranca" element={<Safety />} />
            <Route path="/sobre-nos" element={<About />} />

            {/* Admin Pages */}
            <Route path="/administrador/painel" element={<AdminDashboard />} />
            <Route path="/administrador/tabela-carros" element={<CarsTable />} />
            <Route path="/administrador/tabela-motoristas" element={<DriversTable />} />
            <Route path="/administrador/tabela-passageiros" element={<PassengersTable />} />

            {/* Driver Pages */}
            <Route path="/motorista/cadastro-carro" element={<CarRegistration />} />
            <Route path="/motorista/cadastro-dirigir" element={<DriveRegistration />} />
            <Route path="/motorista/cadastro" element={<DriverRegistration />} />
            <Route path="/motorista/painel" element={<DriverDashboard />} />
            <Route path="/motorista/perfil" element={<DriverProfile />} />

            {/* Passenger Pages */}
            <Route path="/passageiro/cadastro" element={<PassengerRegistration />} />
            <Route path="/passageiro/painel" element={<PassengerDashboard />} />
            <Route path="/passageiro/perfil" element={<PassengerProfile />} />

            {/* Trip Pages */}
            <Route path="/viagem/avaliacao" element={<TripRating />} />
            <Route path="/viagem/painel" element={<TripDashboard />} />
            <Route path="/viagem/lista" element={<TripList />} />
            <Route path="/viagem/nova" element={<NewTrip />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
