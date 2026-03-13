import { Car, DollarSign, Calendar, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Drive() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Dirija com a OpenLine</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Seja um motorista parceiro e ajude a transformar a mobilidade urbana
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">Por que dirigir com a OpenLine?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6">
              <DollarSign className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Ganhos Competitivos</h3>
              <p className="text-gray-600">Tarifas justas e bonificações frequentes</p>
            </div>

            <div className="text-center p-6">
              <Calendar className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Flexibilidade</h3>
              <p className="text-gray-600">Defina seus próprios horários</p>
            </div>

            <div className="text-center p-6">
              <Shield className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Segurança</h3>
              <p className="text-gray-600">Seguro completo durante as corridas</p>
            </div>

            <div className="text-center p-6">
              <Car className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Suporte Total</h3>
              <p className="text-gray-600">Equipe disponível 24/7</p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <h3 className="text-2xl mb-6">Requisitos para ser Motorista</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3 text-gray-700">
                <li>✓ Ter mais de 21 anos</li>
                <li>✓ CNH categoria B ou superior válida</li>
                <li>✓ Veículo próprio ano 2015 ou superior</li>
                <li>✓ Documentação do veículo regularizada</li>
              </ul>
              <ul className="space-y-3 text-gray-700">
                <li>✓ Certidão de antecedentes criminais</li>
                <li>✓ Treinamento de acessibilidade (fornecido por nós)</li>
                <li>✓ Aprovação em verificação de segurança</li>
                <li>✓ Smartphone Android ou iOS</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/motorista/cadastro"
              className="inline-block bg-[#5a34a1] text-white px-8 py-4 rounded-full hover:bg-[#4a2891] transition-colors"
            >
              Cadastre-se como Motorista
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
