import type { JSX } from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "../Components/Administrador/AdminLayout";
import { AdminDashboard } from "../Components/Administrador/PainelAdministrador";
import CarsTable from "../Components/Administrador/TabelaCarros";
import DriversTable from "../Components/Administrador/TabelaMotoristas";
import PassengersTable from "../Components/Administrador/TabelaPassageiros";

function PAdministrador(): JSX.Element {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="painel" element={<AdminDashboard />} />
                <Route path="tabela-carros" element={<CarsTable />} />
                <Route path="tabela-motoristas" element={<DriversTable />} />
                <Route path="tabela-passageiros" element={<PassengersTable />} />
            </Route>
        </Routes>
    );
}

export default PAdministrador;
