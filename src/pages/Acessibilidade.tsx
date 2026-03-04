import { Accessibility as AccessibilityIcon, Ear, Eye, Heart, Brain, Users2 } from 'lucide-react';
import { ImageWithFallback } from '../app/components/figma/ImagemComFallback';

export function Accessibility() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Acessibilidade para Todos</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Nosso compromisso é garantir que cada pessoa, independentemente de suas necessidades, 
            tenha acesso a transporte digno, seguro e confortável.
          </p>
        </div>
      </section>

      {/* Introdução */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl mb-6">Mobilidade é um Direito Universal</h2>
              <p className="text-lg text-gray-700 mb-4">
                Na OpenLine, acessibilidade não é um diferencial – é o nosso padrão. Cada veículo, 
                cada motorista e cada recurso do nosso aplicativo foi pensado para atender a todos.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Trabalhamos em parceria com organizações de defesa dos direitos das pessoas com 
                deficiência e minorias para garantir que nossas soluções realmente atendam às 
                necessidades de quem mais precisa.
              </p>
              <p className="text-lg text-gray-700">
                Porque acreditamos que a verdadeira inclusão acontece quando todos podem ir e vir 
                com autonomia, segurança e dignidade.
              </p>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1531620748188-d0587af4287e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjBoZWxwaW5nJTIwcGFzc2VuZ2VyfGVufDF8fHx8MTc3MTAxMDYwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Atendimento inclusivo"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recursos de Acessibilidade */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">Recursos de Acessibilidade</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mobilidade Reduzida */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <AccessibilityIcon className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">Mobilidade Reduzida</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Veículos com rampas e elevadores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Espaço adequado para cadeiras de rodas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Sistemas de fixação seguros</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Motoristas treinados em assistência</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Tempo adequado para embarque</span>
                </li>
              </ul>
            </div>

            {/* Deficiência Auditiva */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Ear className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">Deficiência Auditiva</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Comunicação por chat no app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Interface visual clara e intuitiva</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Notificações visuais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Motoristas com conhecimento básico de Libras</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Vídeos com legenda e Libras</span>
                </li>
              </ul>
            </div>

            {/* Deficiência Visual */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Eye className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">Deficiência Visual</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>App compatível com leitores de tela</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Audiodescrição completa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Comandos de voz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Assistência para cães-guia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Alto contraste e fonte ajustável</span>
                </li>
              </ul>
            </div>

            {/* Terceira Idade */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Heart className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">Terceira Idade</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Interface simplificada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Opção de solicitação por telefone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Paciência e tempo adequado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Assistência para embarque/desembarque</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Motorista preferencial</span>
                </li>
              </ul>
            </div>

            {/* Neurodivergência */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Brain className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">Neurodivergência</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Ambiente calmo e respeitoso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Motoristas sensibilizados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Comunicação clara e objetiva</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Flexibilidade no atendimento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Opção de viagem sem conversação</span>
                </li>
              </ul>
            </div>

            {/* Comunidade LGBTQIA+ */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users2 className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">Comunidade LGBTQIA+</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Ambiente seguro e respeitoso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Política anti-discriminação rígida</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Respeito ao nome social</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Treinamento em diversidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5a34a1] mt-1">✓</span>
                  <span>Canal de denúncia ágil</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tecnologia Assistiva */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">Tecnologia Assistiva no App</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-8 rounded-lg">
              <h3 className="text-2xl mb-4">Para Todos os Usuários</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>Interface responsiva e adaptável</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>Tamanho de fonte ajustável</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>Modo alto contraste</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>Navegação por teclado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>Compatibilidade com tecnologias assistivas</span>
                </li>
              </ul>
            </div>

            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1554260570-83dc2f46ef79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBwaG9uZSUyMHRyYW5zcG9ydGF0aW9ufGVufDF8fHx8MTc3MTAxMDYwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="App acessível"
                className="rounded-lg shadow-xl h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Certificações */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-6">Certificações e Parcerias</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Trabalhamos em conformidade com as normas de acessibilidade nacionais e internacionais
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700">NBR 9050 - Acessibilidade</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700">WCAG 2.1 - Conteúdo Web</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700">Lei Brasileira de Inclusão</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700">ISO 9001 - Qualidade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">O que dizem nossos usuários</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4 italic">
                "Finalmente um serviço que me trata com dignidade. Não preciso mais depender de favores para ir e vir."
              </p>
              <p className="text-[#5a34a1]">- Maria S., usuária de cadeira de rodas</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4 italic">
                "O app com audiodescrição mudou minha vida. Consigo solicitar viagens com total autonomia."
              </p>
              <p className="text-[#5a34a1]">- João P., pessoa com deficiência visual</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4 italic">
                "Me sinto segura e respeitada em todas as viagens. É um alívio ter esse serviço disponível."
              </p>
              <p className="text-[#5a34a1]">- Ana L., pessoa trans</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
