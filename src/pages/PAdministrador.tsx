import type { JSX } from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "../Components/Administrador/AdminLayout";
import { AdminDashboard } from "../Components/Administrador/PainelAdministrador";
import CarsTable from "../Components/Administrador/TabelaCarros";
import DriversTable from "../Components/Administrador/TabelaMotoristas";
import PassengersTable from "../Components/Administrador/TabelaPassageiros";
import { DetalhesCarro } from "../Components/Administrador/Detalhes/DetalhesCarro";
import { DetalhesMotorista } from "../Components/Administrador/Detalhes/DetalhesMotorista";
import { DetalhesPassageiro } from "../Components/Administrador/Detalhes/DetalhesPassageiro";

function PAdministrador(): JSX.Element {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="painel" element={<AdminDashboard />} />
                <Route path="tabela-carros" element={<CarsTable />} />
                <Route path="tabela-carros/:id" element={<DetalhesCarro />} />
                <Route path="tabela-motoristas" element={<DriversTable />} />
                <Route path="tabela-motoristas/:id" element={<DetalhesMotorista />} />
                <Route path="tabela-passageiros" element={<PassengersTable />} />
                <Route path="tabela-passageiros/:id" element={<DetalhesPassageiro />} />
            </Route>
        </Routes>
    );
}

export default PAdministrador;
