import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
// ...existing code...
import { Header } from './Components/Cabecalho/Cabecalho';
import { Footer } from './Components/Rodapé/Rodape';
import { Home } from './Components/Inicio/Inicio';

// Importacoes temporarias das paginas antigas (serao migradas gradualmente)
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
import { AdminLayout } from './pages/Administrador/AdminLayout';
import { AdminDashboard } from './pages/Administrador/PainelAdministrador';
import CarsTable from './pages/Administrador/TabelaCarros';
import DriversTable from './pages/Administrador/TabelaMotoristas';
import PassengersTable from './pages/Administrador/TabelaPassageiros';
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

type AuthenticatedUserType = 'passenger' | 'driver' | 'admin';

const dashboardByUserType: Record<AuthenticatedUserType, string> = {
  passenger: '/passageiro/painel',
  driver: '/motorista/painel',
  admin: '/administrador/painel',
};

function ProtectedRoute({
  allowedUserType,
  children,
}: {
  allowedUserType: AuthenticatedUserType;
  children: ReactNode;
}) {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType') as AuthenticatedUserType | null;

  if (!token || !userType) {
    return <Navigate to="/login" replace />;
  }

  if (userType !== allowedUserType) {
    return <Navigate to={dashboardByUserType[userType] ?? '/login'} replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/administrador');
  const isLoginRoute = location.pathname === '/login';

  return (
    <div className="app-shell min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}
      <main className={`app-main flex-1 ${isLoginRoute ? 'login-main' : ''}`.trim()}>
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
          <Route
            path="/administrador"
            element={(
              <ProtectedRoute allowedUserType="admin">
                <AdminLayout />
              </ProtectedRoute>
            )}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="painel" element={<AdminDashboard />} />
            <Route path="tabela-carros" element={<CarsTable />} />
            <Route path="tabela-motoristas" element={<DriversTable />} />
            <Route path="tabela-passageiros" element={<PassengersTable />} />
          </Route>

          {/* Driver Pages */}
          <Route path="/motorista/cadastro-carro" element={<CarRegistration />} />
          <Route path="/motorista/cadastro-dirigir" element={<DriveRegistration />} />
          <Route path="/motorista/cadastro" element={<DriverRegistration />} />
          <Route
            path="/motorista/painel"
            element={(
              <ProtectedRoute allowedUserType="driver">
                <DriverDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/motorista/perfil"
            element={(
              <ProtectedRoute allowedUserType="driver">
                <DriverProfile />
              </ProtectedRoute>
            )}
          />

          {/* Passenger Pages */}
          <Route path="/passageiro/cadastro" element={<PassengerRegistration />} />
          <Route
            path="/passageiro/painel"
            element={(
              <ProtectedRoute allowedUserType="passenger">
                <PassengerDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/passageiro/perfil"
            element={(
              <ProtectedRoute allowedUserType="passenger">
                <PassengerProfile />
              </ProtectedRoute>
            )}
          />

          {/* Trip Pages */}
          <Route path="/viagem/avaliacao" element={<TripRating />} />
          <Route path="/viagem/painel" element={<TripDashboard />} />
          <Route path="/viagem/lista" element={<TripList />} />
          <Route path="/viagem/nova" element={<NewTrip />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
