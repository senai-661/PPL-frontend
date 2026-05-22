import { useEffect, useState, type JSX } from "react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Chip } from "primereact/chip";
import PassageiroRequest from "@/fetch/PassageiroRequest";
import type { PassageiroDTO } from "@/interface/PassageiroDTO";
import { useNavigate } from "react-router-dom";

interface DetalhesPassageiroProps {
    id_passageiro: number;
}

/**
 * Componente que exibe os detalhes de um passageiro.
 * Faz a consulta à API com base no ID fornecido e monta a visualização.
 */
function DetalhesPassageiro({ id_passageiro }: DetalhesPassageiroProps): JSX.Element {
    const [passageiro, setPassageiro] = useState<PassageiroDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function buscarDados() {
            setLoading(true);
            setError(null);

            try {
                const dados = await PassageiroRequest.obterPassageiroPorId(id_passageiro);
                if (dados) {
                    setPassageiro(dados);
                } else {
                    setError("Passageiro não encontrado.");
                }
            } catch (err) {
                console.error("Erro ao carregar detalhes do passageiro:", err);
                setError("Ocorreu um erro ao buscar as informações do passageiro.");
            } finally {
                setLoading(false);
            }
        }

        buscarDados();
    }, [id_passageiro]);

    // Renderização do estado de carregamento (Skeleton)
    if (loading) {
        return (
            <Card className="shadow-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton shape="circle" size="4rem"></Skeleton>
                        <div className="flex-1">
                            <Skeleton width="60%" height="2rem" className="mb-2"></Skeleton>
                            <Skeleton width="40%"></Skeleton>
                        </div>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i}>
                                <Skeleton width="30%" className="mb-2"></Skeleton>
                                <Skeleton width="80%" height="1.5rem"></Skeleton>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    // Renderização do estado de erro
    if (error || !passageiro) {
        return (
            <div className="flex justify-center p-4">
                <Message severity="error" text={error || "Erro desconhecido."} />
            </div>
        );
    }

    // Renderização dos detalhes do passageiro
    return (
        <main className="bg-gray-200 flex-1 py-6 sm:py-10 px-4 overflow-y-auto">
            <Card title={`${passageiro.nome} ${passageiro.sobrenome}`} className="shadow-lg animate-fade-in transition-all duration-300 w-full max-w-4xl p-4 sm:p-6 md:p-8 mx-auto font-bold text-xl">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-gray-500 font-medium tracking-tight">CPF</span>
                        <Tag value={passageiro.cpf} severity="info" className="px-3 py-1" />
                    </div>

                    <Divider />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                        {/* Seção de Informações Pessoais */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-semibold text-primary-700 flex items-center gap-2">
                                <i className="pi pi-user text-blue-500"></i> Informações Pessoais
                            </h3>
                            <div className="flex flex-col gap-3 ml-1 border-l-2 border-blue-50 relative pl-4">
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Data de Nascimento</span>
                                    <span className="text-gray-700 font-medium">{new Date(passageiro.dataNascimento).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">E-mail</span>
                                    <span className="text-gray-700 font-medium break-all">{passageiro.email}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Data de Cadastro</span>
                                    <span className="text-gray-700 font-medium">
                                        {passageiro.criadoEm ? new Date(passageiro.criadoEm).toLocaleDateString('pt-BR') : "Não informado"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Seção de Contato e Necessidades Especiais */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-semibold text-primary-700 flex items-center gap-2">
                                <i className="pi pi-phone text-orange-500"></i> Contato e Necessidades
                            </h3>
                            <div className="flex flex-col gap-3 ml-1 border-l-2 border-orange-50 relative pl-4">
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Celular / Telefone</span>
                                    <span className="text-gray-700 font-medium">
                                        {passageiro.celular ? passageiro.celular : "Não informado"}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Necessidades Especiais</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {passageiro.necessidades && passageiro.necessidades.length > 0 ? (
                                            passageiro.necessidades.map((necessidade, index) => (
                                                <Chip key={index} label={necessidade} className="bg-blue-100 text-blue-800" />
                                            ))
                                        ) : (
                                            <span className="text-gray-500 italic">Nenhuma necessidade especial registrada</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            </Card>
            <div className="w-full max-w-4xl mx-auto mt-6 sm:mt-8">
                <button
                    className="w-full bg-slate-700 hover:bg-slate-500 text-white px-4 py-3 md:mb-2 rounded-md font-bold transition-all shadow-md active:scale-95"
                    onClick={() => navigate(`/atualizar/passageiro/${passageiro.idPassageiro}`)}
                >
                    Editar Passageiro
                </button>
                <button
                    className="w-full bg-white text-black hover:bg-slate-500 px-4 py-3 rounded-md font-bold transition-all shadow-md active:scale-95"
                    onClick={() => navigate(`/lista/passageiros`)}
                >
                    Voltar
                </button>
            </div>
        </main>
    );
}

export default DetalhesPassageiro;