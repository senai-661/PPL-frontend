import { Car, MapPin, CreditCard, Star } from 'lucide-react';
import { Link } from 'react-router';

export function Ride() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Solicite uma Corrida</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Vá para onde quiser com segurança, conforto e acessibilidade total
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">Como Funciona</h2>
          
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">1</div>
              <MapPin className="size-8 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-2">Escolha o Destino</h3>
              <p className="text-gray-600">Informe para onde deseja ir</p>
            </div>

            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">2</div>
              <Car className="size-8 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-2">Encontre um Motorista</h3>
              <p className="text-gray-600">Conectamos você ao motorista mais próximo</p>
            </div>

            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">3</div>
              <CreditCard className="size-8 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-2">Pague com Facilidade</h3>
              <p className="text-gray-600">Cartão, PIX ou dinheiro</p>
            </div>

            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">4</div>
              <Star className="size-8 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-2">Avalie sua Viagem</h3>
              <p className="text-gray-600">Sua opinião nos ajuda a melhorar</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/passageiro/painel"
              className="inline-block bg-[#5a34a1] text-white px-8 py-4 rounded-full hover:bg-[#4a2891] transition-colors"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
