import { Car, Users, Briefcase, Calendar, Shield, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Services() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Nossos Serviços</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Soluções de transporte acessível para todas as suas necessidades
          </p>
        </div>
      </section>

      {/* Serviços Principais */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* OpenLine Go */}
            <div className="bg-gray-50 rounded-lg p-8  transition-shadow">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Car className="size-8" />
              </div>
              <h2 className="text-3xl mb-4">OpenLine Go</h2>
              <p className="text-gray-700 text-lg mb-6">
                Nosso serviço principal de transporte urbano individual. Viagens por demanda, disponíveis 24/7, com veículos 100% acessíveis.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Veículos adaptados com rampas e elevadores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Rastreamento em tempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Pagamento via app ou dinheiro</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Motoristas capacitados</span>
                </li>
              </ul>
              <div className="text-[#5a34a1]">
                <span className="text-sm">A partir de</span>
                <div className="text-3xl">R$ 8,00</div>
              </div>
            </div>

            {/* OpenLine Share */}
            <div className="bg-gray-50 rounded-lg p-8  transition-shadow">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="size-8" />
              </div>
              <h2 className="text-3xl mb-4">OpenLine Share</h2>
              <p className="text-gray-700 text-lg mb-6">
                Viagens compartilhadas para economizar e conhecer pessoas. Mesmo conforto e acessibilidade, com custo reduzido.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Até 60% mais econômico</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Rotas otimizadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Máximo 3 passageiros por viagem</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Mesmos padrões de acessibilidade</span>
                </li>
              </ul>
              <div className="text-[#5a34a1]">
                <span className="text-sm">A partir de</span>
                <div className="text-3xl">R$ 4,50</div>
              </div>
            </div>

            {/* OpenLine Business */}
            <div className="bg-gray-50 rounded-lg p-8  transition-shadow">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="size-8" />
              </div>
              <h2 className="text-3xl mb-4">OpenLine Business</h2>
              <p className="text-gray-700 text-lg mb-6">
                Solução corporativa para empresas que valorizam a inclusão. Gestão centralizada e relatórios detalhados.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Faturamento mensal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Gestão de colaboradores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Relatórios e analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Suporte prioritário</span>
                </li>
              </ul>
              <div className="text-[#5a34a1]">
                <span className="text-sm">Planos personalizados</span>
                <div className="text-3xl">Sob consulta</div>
              </div>
            </div>

            {/* OpenLine Schedule */}
            <div className="bg-gray-50 rounded-lg p-8  transition-shadow">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Calendar className="size-8" />
              </div>
              <h2 className="text-3xl mb-4">OpenLine Schedule</h2>
              <p className="text-gray-700 text-lg mb-6">
                Agende suas viagens com antecedência. Ideal para consultas médicas, compromissos e viagens regulares.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Agendamento até 30 dias antes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Confirmação garantida</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Lembretes automáticos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span className="text-gray-700">Motorista preferencial disponível</span>
                </li>
              </ul>
              <div className="text-[#5a34a1]">
                <span className="text-sm">Mesmos valores</span>
                <div className="text-3xl">Sem taxa extra</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Adicionais */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">Serviços Adicionais Inclusos</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Shield className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Seguro Viagem</h3>
              <p className="text-gray-700">
                Todas as viagens incluem seguro contra acidentes, sem custo adicional.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Headphones className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Suporte 24/7</h3>
              <p className="text-gray-700">
                Central de atendimento disponível por telefone, chat e WhatsApp.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Users className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Acompanhante Grátis</h3>
              <p className="text-gray-700">
                Viaje com seu acompanhante sem custo adicional em todas as modalidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">Como Funciona</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                1
              </div>
              <h3 className="text-xl mb-3">Baixe o App</h3>
              <p className="text-gray-700">
                Disponível na App Store e Google Play
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                2
              </div>
              <h3 className="text-xl mb-3">Cadastre-se</h3>
              <p className="text-gray-700">
                Processo simples e rápido
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                3
              </div>
              <h3 className="text-xl mb-3">Solicite</h3>
              <p className="text-gray-700">
                Escolha seu destino e confirme
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                4
              </div>
              <h3 className="text-xl mb-3">Viaje</h3>
              <p className="text-gray-700">
                Com conforto e segurança
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-6">Pronto para começar?</h2>
          <p className="text-xl mb-8 text-white/90">
            Entre em contato e solicite sua primeira viagem
          </p>
          <Link
            to="/contato"
            className="inline-block bg-white text-[#5a34a1] px-8 py-4 rounded-full  transition-colors"
          >
            Solicitar Viagem
          </Link>
        </div>
      </section>
    </div>
  );
}

