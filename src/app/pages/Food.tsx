import { UtensilsCrossed, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router';

export function Food() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">OpenLine Eats</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Entrega de comida acessível com os mesmos padrões de qualidade e inclusão
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <UtensilsCrossed className="size-16 text-[#5a34a1] mx-auto mb-6" />
            <h2 className="text-4xl mb-6">Em Breve: OpenLine Eats</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Estamos trabalhando para trazer o mesmo padrão de acessibilidade e inclusão 
              para o serviço de entrega de comida. Em breve você poderá pedir suas refeições 
              favoritas com a qualidade OpenLine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Clock className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Entrega Rápida</h3>
              <p className="text-gray-600">Suas refeições no tempo certo</p>
            </div>
            <div className="text-center p-6">
              <Shield className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Qualidade Garantida</h3>
              <p className="text-gray-600">Restaurantes verificados e seguros</p>
            </div>
            <div className="text-center p-6">
              <UtensilsCrossed className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Variedade</h3>
              <p className="text-gray-600">Milhares de opções de restaurantes</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contato"
              className="inline-block bg-[#5a34a1] text-white px-8 py-4 rounded-full hover:bg-[#4a2891] transition-colors"
            >
              Cadastre-se para Receber Novidades
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
