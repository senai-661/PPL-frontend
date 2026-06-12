import { type JSX } from "react";
import DetalhesPassageiro from "@/Components/Listagens/DetalhesPassageiro/DetalhesPassageiro";
import { useParams } from "react-router-dom";

function PDetalhesPassageiro(): JSX.Element {
    const { id_passageiro } = useParams();  // Recebe o ID do registro acessado

    return (
        <div className="min-h-screen flex flex-col">
            <DetalhesPassageiro id_passageiro={Number(id_passageiro)} />  {/* Envia o ID para o componente */}
        </div>
    );
}

export default PDetalhesPassageiro;