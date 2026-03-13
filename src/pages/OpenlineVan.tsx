import { Users, Calendar, Shield, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Van() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">OpenLine Van</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Transporte coletivo acessível para grupos e eventos
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl mb-6">Viagens em Grupo com Acessibilidade Total</h2>
              <p className="text-lg text-gray-700 mb-6">
                O OpenLine Van oferece transporte para grupos de até 12 pessoas, com toda a 
                infraestrutura de acessibilidade que você espera da OpenLine.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Capacidade para até 12 passageiros</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Espaço para até 3 cadeiras de rodas simultaneamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Ar-condicionado e Wi-Fi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Motorista profissional com treinamento em acessibilidade</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
              <Users className="size-24 text-gray-400" />
            </div>
          </div>

          <h2 className="text-3xl mb-8 text-center">Ideal Para</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-xl mb-2">Eventos</h3>
              <p className="text-gray-600">Festas, conferências e reuniões</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-xl mb-2">Passeios</h3>
              <p className="text-gray-600">Turismo e lazer em grupo</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-xl mb-2">Instituições</h3>
              <p className="text-gray-600">Clínicas, escolas e centros de dia</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-xl mb-2">Corporativo</h3>
              <p className="text-gray-600">Transporte de equipes</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-8 rounded-lg mb-12">
            <h3 className="text-2xl mb-6 text-center">Preços e Disponibilidade</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Calendar className="size-8 mx-auto mb-3" />
                <p className="text-lg">Agendamento com antecedência</p>
              </div>
              <div>
                <DollarSign className="size-8 mx-auto mb-3" />
                <p className="text-lg">A partir de R$ 150/hora</p>
              </div>
              <div>
                <Shield className="size-8 mx-auto mb-3" />
                <p className="text-lg">Seguro completo incluso</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/contato"
              className="inline-block bg-[#5a34a1] text-white px-8 py-4 rounded-full hover:bg-[#4a2891] transition-colors"
            >
              Solicitar Orçamento
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
