import { useEffect, useState } from "react";

export default function NovaViagem() {

  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");

  const [preco, setPreco] = useState<number | null>(null);

  const calcularDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {

    const R = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  };

  const buscarCoordenadas = async (
    endereco: string
  ) => {

    try {

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(endereco)}`
      );

      const data = await response.json();

      console.log(data);

      if (!data || data.length === 0) {

        return {
          lat: -21.1775,
          lon: -47.8103,
        };
      }

      return {
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
      };

    } catch (error) {

      console.log(error);

      return {
        lat: -21.1775,
        lon: -47.8103,
      };
    }
  };

  const calcularPreco = async () => {

    try {

      const origemCoords =
        await buscarCoordenadas(origem);

      const destinoCoords =
        await buscarCoordenadas(destino);

      const distancia = calcularDistancia(
        origemCoords.lat,
        origemCoords.lon,
        destinoCoords.lat,
        destinoCoords.lon
      );

      const valor =
        8 + distancia * 2.5;

      setPreco(valor);

    } catch (error) {

      console.log(error);

      setPreco(25);
    }
  };

  useEffect(() => {

    if (
      origem.length > 5 &&
      destino.length > 5
    ) {

      calcularPreco();
    }

  }, [origem, destino]);

  return (

    <div style={{ padding: "30px" }}>

      <h1>Nova Viagem</h1>

      <input
        type="text"
        placeholder="Digite a origem"
        value={origem}
        onChange={(e) =>
          setOrigem(e.target.value)
        }
        style={{
          width: "300px",
          height: "40px",
          marginBottom: "10px",
          display: "block",
          paddingLeft: "10px"
        }}
      />

      <input
        type="text"
        placeholder="Digite o destino"
        value={destino}
        onChange={(e) =>
          setDestino(e.target.value)
        }
        style={{
          width: "300px",
          height: "40px",
          marginBottom: "10px",
          display: "block",
          paddingLeft: "10px"
        }}
      />

      <button
        onClick={calcularPreco}
        style={{
          width: "150px",
          height: "40px",
          cursor: "pointer"
        }}
      >
        Ver preço
      </button>

      {preco !== null && (

        <h2>

          Preço estimado:
          {" "}
          R$
          {preco.toFixed(2)}

        </h2>
      )}

    </div>
  );
}