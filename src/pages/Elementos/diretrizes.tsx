import { Shield, AlertCircle } from 'lucide-react';

export function Guidelines() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Diretrizes da Comunidade</h1>
          <p className="text-xl text-white/90">
            Regras e boas praticas para uma experiencia segura e respeitosa para todos
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Shield className="size-16 text-[#5a34a1] mb-4" />
            <h2 className="text-3xl mb-4">Compromisso com a Seguranca</h2>
            <p className="text-lg text-gray-700">
              A OpenLine e uma plataforma inclusiva que conecta pessoas. Para manter nossa comunidade
              segura e respeitosa, estabelecemos diretrizes claras que todos devem seguir.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl mb-4 text-[#5a34a1]">Respeito e Dignidade</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Trate todos com respeito, independentemente de raca, genero, orientacao sexual ou deficiencia</li>
                <li>• Nao toleramos qualquer forma de discriminacao ou assedio</li>
                <li>• Use linguagem respeitosa em todas as interacoes</li>
                <li>• Respeite o espaco pessoal e os limites de cada pessoa</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl mb-4 text-[#5a34a1]">Seguranca</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Use sempre o cinto de seguranca</li>
                <li>• Nao compartilhe informacoes pessoais sensiveis</li>
                <li>• Reporte qualquer comportamento inadequado imediatamente</li>
                <li>• Motoristas: dirija com seguranca e siga todas as leis de transito</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl mb-4 text-[#5a34a1]">Acessibilidade</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Motoristas devem auxiliar passageiros com necessidades especiais</li>
                <li>• Respeite o tempo necessario para embarque e desembarque</li>
                <li>• Aceite caes-guia e animais de suporte emocional</li>
                <li>• Mantenha os veiculos em condicoes ideais de acessibilidade</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl mb-4 text-[#5a34a1]">Proibicoes</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Consumo de alcool ou drogas durante viagens</li>
                <li>• Comportamento violento ou ameacador</li>
                <li>• Contato fisico nao consensual</li>
                <li>• Danos a propriedade</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <AlertCircle className="size-8 text-red-600 mb-4" />
              <h3 className="text-xl mb-3 text-red-900">Consequencias</h3>
              <p className="text-red-800">
                Violacoes destas diretrizes podem resultar em suspensao temporaria ou banimento
                permanente da plataforma. Casos graves serao reportados as autoridades competentes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
