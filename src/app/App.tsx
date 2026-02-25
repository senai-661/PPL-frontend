import { BrowserRouter, Routes, Route } from 'react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages - General
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Accessibility } from './pages/Accessibility';
import { Contact } from './pages/Contact';
import { Airports } from './pages/Airports';
import { Help } from './pages/Help';
import { Careers } from './pages/Careers';
import { Cities } from './pages/Cities';
import { Food } from './pages/Food';
import { Ride } from './pages/Ride';
import { Guidelines } from './pages/Guidelines';
import { Drive } from './pages/Drive';
import { Diversity } from './pages/Diversity';
import { Business } from './pages/Business';
import { Delivery } from './pages/Delivery';
import { Press } from './pages/Press';
import { Login } from './pages/Login';
import { Van } from './pages/Van';
import { SafetyResources } from './pages/SafetyResources';
import { Safety } from './pages/Safety';

// Pages - Admin
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { CarsTable } from './pages/Admin/CarsTable';
import { DriversTable } from './pages/Admin/DriversTable';
import { PassengersTable } from './pages/Admin/PassengersTable';

// Pages - Driver
import { DriverRegistration } from './pages/Driver/DriverRegistration';
import { CarRegistration } from './pages/Driver/CarRegistration';
import { DriveRegistration } from './pages/Driver/DriveRegistration';
import { DriverDashboard } from './pages/Driver/DriverDashboard';
import { DriverProfile } from './pages/Driver/DriverProfile';

// Pages - Passenger
import { PassengerRegistration } from './pages/Passenger/PassengerRegistration';
import { PassengerDashboard } from './pages/Passenger/PassengerDashboard';
import { PassengerProfile } from './pages/Passenger/PassengerProfile';

// Pages - Trip
import { TripRating } from './pages/Trip/TripRating';
import { TripDashboard } from './pages/Trip/TripDashboard';
import { TripList } from './pages/Trip/TripList';
import { NewTrip } from './pages/Trip/NewTrip';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
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
            <Route path="/Administrador/homepage-administrador" element={<AdminDashboard />} />
            <Route path="/Administrador/tabela-carros" element={<CarsTable />} />
            <Route path="/Administrador/tabela-motoristas" element={<DriversTable />} />
            <Route path="/Administrador/tabela-passageiros" element={<PassengersTable />} />

            {/* Driver Pages */}
            <Route path="/Motorista/cadastro-carro" element={<CarRegistration />} />
            <Route path="/Motorista/cadastro-dirigir" element={<DriveRegistration />} />
            <Route path="/Motorista/cadastro-motorista" element={<DriverRegistration />} />
            <Route path="/Motorista/homepage-motorista" element={<DriverDashboard />} />
            <Route path="/Motorista/perfil-motorista" element={<DriverProfile />} />

            {/* Passenger Pages */}
            <Route path="/Passageiro/cadastro-passageiro" element={<PassengerRegistration />} />
            <Route path="/Passageiro/homepage-passageiro" element={<PassengerDashboard />} />
            <Route path="/Passageiro/perfil-passageiro" element={<PassengerProfile />} />

            {/* Trip Pages */}
            <Route path="/Viagem/avaliação-viagem" element={<TripRating />} />
            <Route path="/Viagem/dashboard-viagem" element={<TripDashboard />} />
            <Route path="/Viagem/lista-viagens" element={<TripList />} />
            <Route path="/Viagem/nova-viagem" element={<NewTrip />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
