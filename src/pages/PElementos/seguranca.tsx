import { Shield, Lock, Eye, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Safety() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Segurança OpenLine</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Sua segurança é nossa prioridade máxima em cada viagem
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">Comprometidos com sua Segurança</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <UserCheck className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Motoristas Verificados</h3>
              <p className="text-gray-600">Checagem rigorosa de antecedentes</p>
            </div>

            <div className="text-center">
              <Eye className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Rastreamento 24/7</h3>
              <p className="text-gray-600">Monitoramento em tempo real</p>
            </div>

            <div className="text-center">
              <Lock className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Dados Protegidos</h3>
              <p className="text-gray-600">Criptografia de ponta a ponta</p>
            </div>

            <div className="text-center">
              <Shield className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Seguro Completo</h3>
              <p className="text-gray-600">Cobertura em todas as viagens</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl mb-4 text-[#5a34a1]">Processo de Verificação de Motoristas</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ Verificação de identidade com documentos oficiais</li>
                <li>✓ Checagem de antecedentes criminais</li>
                <li>✓ Análise de histórico de direção</li>
                <li>✓ Inspeção veicular obrigatória</li>
                <li>✓ Treinamento em segurança e acessibilidade</li>
                <li>✓ Avaliação contínua baseada em feedback</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl mb-4 text-[#5a34a1]">Tecnologias de Segurança</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ GPS e rastreamento em tempo real</li>
                <li>✓ Botão de emergência SOS no app</li>
                <li>✓ Compartilhamento de viagem com contatos de confiança</li>
                <li>✓ Verificação de PIN antes de entrar no veículo</li>
                <li>✓ Gravação de rotas e horários</li>
                <li>✓ Central de segurança 24 horas</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/recursos-seguranca"
              className="inline-block bg-[#5a34a1] text-white px-8 py-4 rounded-full  transition-colors"
            >
              Conheça Todos os Recursos de Segurança
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

