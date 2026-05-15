import { Target, Eye, Award, Heart } from 'lucide-react';
import { ImageWithFallback } from '../../Components/Elementos/figma/ImagemComFallback';

export function About() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Sobre a OpenLine</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Acreditamos que mobilidade é um direito fundamental. Nossa missão é tornar o transporte urbano verdadeiramente acessível e inclusivo para todos.
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl mb-6">Nossa História</h2>
              <p className="text-lg text-gray-700 mb-4">
                A OpenLine nasceu da necessidade real de criar um serviço de transporte urbano que verdadeiramente atendesse às necessidades de todas as pessoas, especialmente aquelas que historicamente foram excluídas ou marginalizadas.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Fundada em 2024, rapidamente nos tornamos referência em transporte acessível, oferecendo não apenas veículos adaptados, mas uma experiência completa de respeito, dignidade e inclusão.
              </p>
              <p className="text-lg text-gray-700">
                Hoje, operamos em diversas cidades brasileiras, conectando milhares de pessoas aos seus destinos diariamente, sempre com o compromisso de fazer a diferença na vida de cada passageiro.
              </p>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1754847307406-1efd32d0365c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcGVvcGxlJTIwY2l0eSUyMHVyYmFufGVufDF8fHx8MTc3MTAxMDYwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Diversidade urbana"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Target className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">Missão</h3>
              <p className="text-gray-700">
                Promover mobilidade urbana acessível, segura e inclusiva, garantindo que todas as pessoas, independentemente de suas condições físicas, sociais ou econômicas, tenham acesso a transporte digno e de qualidade.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Eye className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">Visão</h3>
              <p className="text-gray-700">
                Ser a principal referência em transporte urbano acessível no Brasil, transformando a forma como a sociedade pensa e pratica a inclusão e a mobilidade para todos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Award className="size-8" />
              </div>
              <h3 className="text-2xl mb-4">Valores</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Inclusão e Acessibilidade</li>
                <li>• Respeito e Dignidade</li>
                <li>• Excelência no Atendimento</li>
                <li>• Inovação Constante</li>
                <li>• Responsabilidade Social</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nosso Compromisso */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heart className="size-16 text-[#5a34a1] mx-auto mb-4" />
            <h2 className="text-4xl mb-4">Nosso Compromisso com Você</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Na OpenLine, cada viagem é uma oportunidade de fazer a diferença
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-8 rounded-lg">
              <h3 className="text-2xl mb-4">Para Pessoas com Deficiência</h3>
              <p className="mb-4">
                Oferecemos veículos 100% adaptados, motoristas treinados em acessibilidade e tecnologia assistiva integrada ao nosso aplicativo.
              </p>
              <p>
                Libras, audiodescrição e interface adaptável fazem parte da nossa plataforma.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-8 rounded-lg">
              <h3 className="text-2xl mb-4">Para Idosos</h3>
              <p className="mb-4">
                Assistência personalizada, tempo adequado para embarque e desembarque, e motoristas capacitados para atendimento à terceira idade.
              </p>
              <p>
                Interface simplificada e suporte por telefone disponível.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-8 rounded-lg">
              <h3 className="text-2xl mb-4">Para Comunidade LGBTQIA+</h3>
              <p className="mb-4">
                Ambiente seguro e respeitoso, com política de tolerância zero contra qualquer tipo de discriminação.
              </p>
              <p>
                Treinamento de motoristas em diversidade e inclusão.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-8 rounded-lg">
              <h3 className="text-2xl mb-4">Para Todos</h3>
              <p className="mb-4">
                Preços justos, transparência total, e compromisso com a qualidade do serviço prestado a cada pessoa.
              </p>
              <p>
                Porque mobilidade é direito de todos, sem exceção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-6">Nossa Equipe</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Formada por profissionais apaixonados por inclusão e inovação, nossa equipe trabalha diariamente para transformar a mobilidade urbana em algo verdadeiramente acessível para todos.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md inline-block">
            <p className="text-lg text-gray-700">
              Mais de <span className="text-[#5a34a1]">500 motoristas parceiros</span> capacitados<br />
              <span className="text-[#5a34a1]">50+ colaboradores</span> dedicados à excelência<br />
              <span className="text-[#5a34a1]">100%</span> comprometidos com a inclusão
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
