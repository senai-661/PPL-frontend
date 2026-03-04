import { Shield, Users, AlertCircle, Heart } from 'lucide-react';

export function Guidelines() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Diretrizes da Comunidade</h1>
          <p className="text-xl text-white/90">
            Regras e boas práticas para uma experiência segura e respeitosa para todos
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Shield className="size-16 text-[#5a34a1] mb-4" />
            <h2 className="text-3xl mb-4">Compromisso com a Segurança</h2>
            <p className="text-lg text-gray-700">
              A OpenLine é uma plataforma inclusiva que conecta pessoas. Para manter nossa comunidade 
              segura e respeitosa, estabelecemos diretrizes claras que todos devem seguir.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl mb-4 text-[#5a34a1]">Respeito e Dignidade</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Trate todos com respeito, independentemente de raça, gênero, orientação sexual ou deficiência</li>
                <li>• Não toleramos qualquer forma de discriminação ou assédio</li>
                <li>• Use linguagem respeitosa em todas as interações</li>
                <li>• Respeite o espaço pessoal e os limites de cada pessoa</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl mb-4 text-[#5a34a1]">Segurança</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Use sempre o cinto de segurança</li>
                <li>• Não compartilhe informações pessoais sensíveis</li>
                <li>• Reporte qualquer comportamento inadequado imediatamente</li>
                <li>• Motoristas: dirija com segurança e siga todas as leis de trânsito</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl mb-4 text-[#5a34a1]">Acessibilidade</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Motoristas devem auxiliar passageiros com necessidades especiais</li>
                <li>• Respeite o tempo necessário para embarque e desembarque</li>
                <li>• Aceite cães-guia e animais de suporte emocional</li>
                <li>• Mantenha os veículos em condições ideais de acessibilidade</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl mb-4 text-[#5a34a1]">Proibições</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Consumo de álcool ou drogas durante viagens</li>
                <li>• Comportamento violento ou ameaçador</li>
                <li>• Contato físico não consensual</li>
                <li>• Danos à propriedade</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <AlertCircle className="size-8 text-red-600 mb-4" />
              <h3 className="text-xl mb-3 text-red-900">Consequências</h3>
              <p className="text-red-800">
                Violações destas diretrizes podem resultar em suspensão temporária ou banimento 
                permanente da plataforma. Casos graves serão reportados às autoridades competentes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
