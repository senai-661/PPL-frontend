import { Package, Truck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Delivery() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">OpenLine Delivery</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Serviço de entregas rápidas e acessíveis
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Package className="size-16 text-[#5a34a1] mx-auto mb-6" />
            <h2 className="text-4xl mb-6">Em Breve: OpenLine Delivery</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos desenvolvendo um serviço de entregas que mantém os mesmos padrões de 
              acessibilidade e inclusão que nos tornaram referência no transporte de passageiros.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Truck className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Entrega Acessível</h3>
              <p className="text-gray-600">Entregadores treinados para atender a todos</p>
            </div>

            <div className="text-center p-6">
              <Clock className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Rastreamento em Tempo Real</h3>
              <p className="text-gray-600">Acompanhe sua encomenda do início ao fim</p>
            </div>

            <div className="text-center p-6">
              <Package className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Preços Justos</h3>
              <p className="text-gray-600">Tarifas transparentes e competitivas</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contato"
              className="inline-block bg-[#5a34a1] text-white px-8 py-4 rounded-full  transition-colors"
            >
              Cadastre-se para Receber Novidades
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

