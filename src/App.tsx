import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './Components/Cabecalho/Cabecalho';
import { Footer } from './Components/Rodape/Rodape';
import { Home } from './Components/Inicio/Inicio';

// Importacoes temporarias das paginas antigas (serao migradas gradualmente)
import { About } from './pages/Elementos/Sobre';
import { Services } from './pages/Elementos/Servicos';
import { Accessibility } from './pages/Elementos/Acessibilidade';
import { Contact } from './pages/Elementos/Contato';
import { Airports } from './pages/Elementos/aeroportos';
import { Help } from './pages/Elementos/ajuda';
import { Careers } from './pages/Elementos/carreiras';
import { Cities } from './pages/Elementos/cidades';
import { Food } from './pages/Elementos/comida';
import { Ride } from './pages/Elementos/corrida';
import { Guidelines } from './pages/Elementos/diretrizes';
import { Drive } from './pages/Elementos/dirigir';
import { Diversity } from './pages/Elementos/diversidade';
import { Business } from './pages/Elementos/empresas';
import { Delivery } from './pages/Elementos/entrega';
import { Press } from './pages/Elementos/imprensa';
import { Login } from './pages/Elementos/login';
import { Van } from './pages/Elementos/OpenlineVan';
import { SafetyResources } from './pages/Elementos/RecursosSeguranca';
import { Safety } from './pages/Elementos/seguranca';
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
import { GuestRoute } from './Components/Autenticacao/ProtectedRoute/ProtectedRoute';
import { ToastProvider, useToast } from './context/ToastContext';
import { ToastContainer } from './Components/Elementos/ToastContainer';

type AuthenticatedUserType = 'passenger' | 'driver' | 'admin';

const dashboardByUserType: Record<AuthenticatedUserType, string> = {
  passenger: '/passageiro/painel',
  driver: '/motorista/painel',
  admin: '/administrador/painel',
};

function AuthProtectedRouteWithType({
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
  const { toasts, removeToast } = useToast();

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
              <AuthProtectedRouteWithType allowedUserType="admin">
                <AdminLayout />
              </AuthProtectedRouteWithType>
            )}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="painel" element={<AdminDashboard />} />
            <Route path="tabela-carros" element={<CarsTable />} />
            <Route path="tabela-motoristas" element={<DriversTable />} />
            <Route path="tabela-passageiros" element={<PassengersTable />} />
          </Route>

          {/* Passenger Pages */}
          <Route path="/passageiro/cadastro" element={
            <GuestRoute>
              <PassengerRegistration />
            </GuestRoute>
          } />

          <Route
            path="/passageiro/painel"
            element={(
              <AuthProtectedRouteWithType allowedUserType="passenger">
                <PassengerDashboard />
              </AuthProtectedRouteWithType>
            )}
          />

          <Route
            path="/passageiro/perfil"
            element={(
              <AuthProtectedRouteWithType allowedUserType="passenger">
                <PassengerProfile />
              </AuthProtectedRouteWithType>
            )}
          />

          {/* Driver Pages */}
          <Route path="/motorista/cadastro" element={
            <GuestRoute>
              <DriverRegistration />
            </GuestRoute>
          } />

          <Route path="/motorista/cadastro-carro" element={
            <AuthProtectedRouteWithType allowedUserType="driver">
              <CarRegistration />
            </AuthProtectedRouteWithType>
          } />
          
          <Route path="/motorista/cadastro-dirigir" element={<DriveRegistration />} />

          <Route
            path="/motorista/painel"
            element={(
              <AuthProtectedRouteWithType allowedUserType="driver">
                <DriverDashboard />
              </AuthProtectedRouteWithType>
            )}
          />

          <Route
            path="/motorista/perfil"
            element={(
              <AuthProtectedRouteWithType allowedUserType="driver">
                <DriverProfile />
              </AuthProtectedRouteWithType>
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
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
}