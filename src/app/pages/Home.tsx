import { Link } from 'react-router';
import { Accessibility, Shield, Clock, Heart, Users, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl mb-6">
                Transporte Urbano <span className="text-yellow-300">Acessível</span> para Todos
              </h1>
              <p className="text-xl mb-8 text-white/90">
                A OpenLine conecta você ao seu destino com respeito, dignidade e total acessibilidade. 
                Porque mobilidade é um direito de todos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contato"
                  className="bg-white text-[#5a34a1] px-8 py-4 rounded-full text-center hover:bg-gray-100 transition-colors"
                >
                  Solicitar Viagem
                </Link>
                <Link
                  to="/sobre"
                  className="border-2 border-white text-white px-8 py-4 rounded-full text-center hover:bg-white/10 transition-colors"
                >
                  Saiba Mais
                </Link>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1740343705360-4e5eec55954b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2Nlc3NpYmxlJTIwdHJhbnNwb3J0YXRpb24lMjB3aGVlbGNoYWlyJTIwdmFufGVufDF8fHx8MTc3MTAxMDYwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Transporte acessível"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Por que escolher a OpenLine?</h2>
            <p className="text-xl text-gray-600">
              Nosso compromisso é com a inclusão e qualidade
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Accessibility className="size-8" />
              </div>
              <h3 className="text-xl mb-3">100% Acessível</h3>
              <p className="text-gray-600">
                Veículos adaptados com rampas, elevadores e espaço para cadeirantes
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="size-8" />
              </div>
              <h3 className="text-xl mb-3">Motoristas Treinados</h3>
              <p className="text-gray-600">
                Profissionais capacitados em atendimento humanizado e inclusivo
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="size-8" />
              </div>
              <h3 className="text-xl mb-3">Segurança Total</h3>
              <p className="text-gray-600">
                Rastreamento em tempo real e suporte 24/7 para sua tranquilidade
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="size-8" />
              </div>
              <h3 className="text-xl mb-3">Disponibilidade</h3>
              <p className="text-gray-600">
                Serviço disponível 24 horas por dia, 7 dias por semana
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="size-8" />
              </div>
              <h3 className="text-xl mb-3">Atendimento Humanizado</h3>
              <p className="text-gray-600">
                Cuidado e respeito em cada viagem, do início ao fim
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="size-8" />
              </div>
              <h3 className="text-xl mb-3">Cobertura Ampla</h3>
              <p className="text-gray-600">
                Atendimento em todas as regiões da cidade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-6">Pronto para viajar com conforto e dignidade?</h2>
          <p className="text-xl mb-8 text-white/90">
            Baixe nosso app ou entre em contato para solicitar sua primeira viagem
          </p>
          <Link
            to="/contato"
            className="inline-block bg-white text-[#5a34a1] px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
          >
            Começar Agora
          </Link>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl text-[#5a34a1] mb-2">10k+</div>
              <p className="text-gray-600">Viagens Realizadas</p>
            </div>
            <div>
              <div className="text-5xl text-[#5a34a1] mb-2">500+</div>
              <p className="text-gray-600">Motoristas Parceiros</p>
            </div>
            <div>
              <div className="text-5xl text-[#5a34a1] mb-2">4.9★</div>
              <p className="text-gray-600">Avaliação Média</p>
            </div>
            <div>
              <div className="text-5xl text-[#5a34a1] mb-2">24/7</div>
              <p className="text-gray-600">Suporte Disponível</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
