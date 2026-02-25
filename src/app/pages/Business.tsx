import { Briefcase, Users, BarChart, CreditCard } from 'lucide-react';
import { Link } from 'react-router';

export function Business() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">OpenLine para Empresas</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Soluções corporativas de mobilidade acessível e inclusiva
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6">
              <Briefcase className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Gestão Centralizada</h3>
              <p className="text-gray-600">Controle total das viagens corporativas</p>
            </div>

            <div className="text-center p-6">
              <BarChart className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Relatórios Detalhados</h3>
              <p className="text-gray-600">Analytics e insights de mobilidade</p>
            </div>

            <div className="text-center p-6">
              <CreditCard className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Faturamento Unificado</h3>
              <p className="text-gray-600">Uma fatura para todas as viagens</p>
            </div>

            <div className="text-center p-6">
              <Users className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Suporte Prioritário</h3>
              <p className="text-gray-600">Gerente de conta dedicado</p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <h2 className="text-3xl mb-6">Planos Corporativos</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-2xl mb-4">Starter</h3>
                <p className="text-3xl text-[#5a34a1] mb-6">Sob consulta</p>
                <ul className="space-y-3 text-gray-700">
                  <li>✓ Até 50 colaboradores</li>
                  <li>✓ Relatórios mensais</li>
                  <li>✓ Faturamento centralizado</li>
                  <li>✓ Suporte por email</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-6 rounded-lg">
                <h3 className="text-2xl mb-4">Business</h3>
                <p className="text-3xl mb-6">Sob consulta</p>
                <ul className="space-y-3">
                  <li>✓ Até 200 colaboradores</li>
                  <li>✓ Analytics em tempo real</li>
                  <li>✓ Gerente de conta dedicado</li>
                  <li>✓ Suporte prioritário 24/7</li>
                  <li>✓ API de integração</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-2xl mb-4">Enterprise</h3>
                <p className="text-3xl text-[#5a34a1] mb-6">Personalizado</p>
                <ul className="space-y-3 text-gray-700">
                  <li>✓ Colaboradores ilimitados</li>
                  <li>✓ Solução customizada</li>
                  <li>✓ SLA garantido</li>
                  <li>✓ Treinamento e onboarding</li>
                  <li>✓ Consultoria de mobilidade</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/contato"
              className="inline-block bg-[#5a34a1] text-white px-8 py-4 rounded-full hover:bg-[#4a2891] transition-colors"
            >
              Solicitar Proposta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
