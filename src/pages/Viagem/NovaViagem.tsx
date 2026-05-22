import { useState } from "react";

export default function NovaViagem() {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [preco, setPreco] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(false);

  // ============================================
  // VER PREÇOS
  // ============================================
  const verPrecos = () => {
    if (!origem || !destino) {
      alert("Preencha origem e destino");
      return;
    }

    // cálculo temporário funcionando
    const valor = Math.floor(Math.random() * 30) + 15;

    setPreco(valor);
  };

  // ============================================
  // SOLICITAR AGORA
  // ============================================
  const solicitarAgora = async () => {
    if (!origem || !destino) {
      alert("Preencha origem e destino");
      return;
    }

    try {
      setCarregando(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Faça login primeiro");
        return;
      }

      const response = await fetch(
        "http://localhost:1285/api/corridas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            origem_corrida: origem,
            destino_corrida: destino,
            tipo_corrida: "Convencional",
            preco: preco || 20,
            num_passageiros: 1,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.mensagem || "Erro ao solicitar corrida");
      }

      alert("Corrida solicitada com sucesso!");
    } catch (error: any) {
      console.error(error);

      alert(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex justify-center p-8">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-8 shadow-md">
        <h1 className="text-5xl font-bold leading-tight text-black">
          Vá a qualquer lugar
          <br />
          com o app da OpenLine
        </h1>

        <div className="flex flex-col gap-4 mt-8">
          <input
            type="text"
            placeholder="Digite a origem"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            className="bg-gray-100 p-4 rounded-xl outline-none"
          />

          <input
            type="text"
            placeholder="Digite o destino"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="bg-gray-100 p-4 rounded-xl outline-none"
          />

          {preco !== null && (
            <div className="text-lg font-semibold">
              Preço estimado: R$ {preco}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={verPrecos}
              className="bg-black text-white px-6 py-4 rounded-xl font-semibold"
            >
              Ver preços
            </button>

            <button
              onClick={solicitarAgora}
              disabled={carregando}
              className="bg-purple-700 text-white px-6 py-4 rounded-xl font-semibold"
            >
              {carregando ? "Solicitando..." : "Solicitar agora"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}