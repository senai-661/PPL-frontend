import { Heart, Users, Shield, Award } from 'lucide-react';

export function Diversity() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Diversidade e Inclusão</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Na OpenLine, a diversidade não é apenas valorizada - ela é essencial para quem somos
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <Heart className="size-16 text-[#5a34a1] mb-6" />
            <h2 className="text-4xl mb-6">Nosso Compromisso</h2>
            <p className="text-lg text-gray-700 mb-4">
              A OpenLine foi fundada com a missão de servir a todos, especialmente aqueles que 
              historicamente foram excluídos ou marginalizados no acesso ao transporte urbano.
            </p>
            <p className="text-lg text-gray-700">
              Acreditamos que a verdadeira inovação acontece quando abraçamos a diversidade 
              em todas as suas formas - de raça, gênero, orientação sexual, idade, capacidade física e mental.
            </p>
          </div>

          <div className="space-y-12">
            <div>
              <Users className="size-12 text-[#5a34a1] mb-4" />
              <h3 className="text-2xl mb-4">Equidade e Representatividade</h3>
              <p className="text-gray-700 mb-4">
                Nossa equipe reflete a diversidade das comunidades que servimos. Buscamos ativamente 
                contratar e promover pessoas de grupos sub-representados em todos os níveis da organização.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• 45% de nossa liderança é composta por mulheres</li>
                <li>• 60% dos funcionários se identificam como parte de minorias</li>
                <li>• 30% dos motoristas parceiros têm alguma deficiência</li>
                <li>• Programa ativo de inclusão LGBTQIA+</li>
              </ul>
            </div>

            <div>
              <Shield className="size-12 text-[#5a34a1] mb-4" />
              <h3 className="text-2xl mb-4">Ambiente Seguro</h3>
              <p className="text-gray-700 mb-4">
                Mantemos política de tolerância zero contra discriminação, assédio ou preconceito 
                de qualquer tipo. Todos os motoristas passam por treinamento obrigatório em:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Diversidade e inclusão</li>
                <li>• Acessibilidade e assistência a pessoas com deficiência</li>
                <li>• Respeito ao nome social e identidade de gênero</li>
                <li>• Combate ao racismo e discriminação</li>
                <li>• Atendimento humanizado a idosos</li>
              </ul>
            </div>

            <div>
              <Award className="size-12 text-[#5a34a1] mb-4" />
              <h3 className="text-2xl mb-4">Iniciativas e Programas</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong className="text-[#5a34a1]">OpenLine Pride:</strong> Programa de apoio 
                  à comunidade LGBTQIA+ com viagens seguras durante eventos e conscientização contínua
                </li>
                <li>
                  <strong className="text-[#5a34a1]">Mulheres ao Volante:</strong> Incentivo e 
                  suporte especial para motoristas mulheres
                </li>
                <li>
                  <strong className="text-[#5a34a1]">Capacita+:</strong> Programa de capacitação 
                  profissional para pessoas em situação de vulnerabilidade
                </li>
                <li>
                  <strong className="text-[#5a34a1]">Idosos Conectados:</strong> Assistência 
                  especial e tarifa social para terceira idade
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-8 rounded-lg">
              <h3 className="text-2xl mb-4">Denúncias e Suporte</h3>
              <p className="mb-4">
                Qualquer pessoa que experiencie ou testemunhe discriminação deve reportar 
                imediatamente através de nossos canais:
              </p>
              <ul className="space-y-2">
                <li>• Chat no app (opção "Reportar Discriminação")</li>
                <li>• E-mail: diversidade@openline.com.br</li>
                <li>• Telefone: 0800 123 4567 (opção 9)</li>
              </ul>
              <p className="mt-4 text-sm text-white/80">
                Todas as denúncias são tratadas com confidencialidade e seriedade.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
