import { Plane, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ImageWithFallback } from '../../app/components/figma/ImagemComFallback';

export function Airports() {
  const airports = [
    { name: 'Aeroporto Internacional de Guarulhos (GRU)', city: 'Sao Paulo', zone: 'A partir de R$ 45' },
    { name: 'Aeroporto de Congonhas (CGH)', city: 'Sao Paulo', zone: 'A partir de R$ 35' },
    { name: 'Aeroporto Internacional do Galeao (GIG)', city: 'Rio de Janeiro', zone: 'A partir de R$ 50' },
    { name: 'Aeroporto Santos Dumont (SDU)', city: 'Rio de Janeiro', zone: 'A partir de R$ 40' },
  ];

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Viagens para Aeroportos</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Transporte acessivel e confiavel para todos os principais aeroportos do Brasil
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl mb-6">Viaje com Tranquilidade</h2>
              <p className="text-lg text-gray-700 mb-4">
                Nossas viagens para aeroportos sao planejadas para garantir que voce chegue no horario,
                com conforto e sem preocupacoes.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="size-6 text-[#5a34a1] mt-1" />
                  <div>
                    <h3 className="text-lg mb-1">Pontualidade Garantida</h3>
                    <p className="text-gray-600">Motoristas monitoram o trafego em tempo real</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="size-6 text-[#5a34a1] mt-1" />
                  <div>
                    <h3 className="text-lg mb-1">Veiculos Premium</h3>
                    <p className="text-gray-600">Frota moderna e 100% acessivel</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Plane className="size-6 text-[#5a34a1] mt-1" />
                  <div>
                    <h3 className="text-lg mb-1">Assistencia com Bagagem</h3>
                    <p className="text-gray-600">Ajuda completa do motorista</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800"
                alt="Aeroporto"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          <h2 className="text-3xl mb-8 text-center">Principais Aeroportos Atendidos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {airports.map((airport, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl mb-2">{airport.name}</h3>
                <p className="text-gray-600 mb-2">{airport.city}</p>
                <p className="text-[#5a34a1]">{airport.zone}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/viagem/nova"
              className="inline-block bg-[#5a34a1] text-white px-8 py-4 rounded-full transition-colors"
            >
              Agendar Viagem para Aeroporto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
