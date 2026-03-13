import { Briefcase, Heart, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Careers() {
  const positions = [
    { title: 'Desenvolvedor Full Stack', dept: 'Tecnologia', location: 'São Paulo - SP', type: 'CLT' },
    { title: 'Designer UX/UI', dept: 'Design', location: 'Remoto', type: 'CLT' },
    { title: 'Analista de Dados', dept: 'Analytics', location: 'São Paulo - SP', type: 'CLT' },
    { title: 'Gerente de Operações', dept: 'Operações', location: 'Rio de Janeiro - RJ', type: 'CLT' },
    { title: 'Especialista em Acessibilidade', dept: 'Produto', location: 'Híbrido', type: 'CLT' },
  ];

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Carreiras na OpenLine</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Junte-se a nós na missão de tornar a mobilidade acessível para todos
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">Por que trabalhar na OpenLine?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <Heart className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-2">Propósito</h3>
              <p className="text-gray-600">Faça parte de uma missão que transforma vidas</p>
            </div>
            <div className="text-center">
              <Users className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-2">Diversidade</h3>
              <p className="text-gray-600">Ambiente inclusivo e diverso</p>
            </div>
            <div className="text-center">
              <TrendingUp className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-2">Crescimento</h3>
              <p className="text-gray-600">Desenvolvimento contínuo e plano de carreira</p>
            </div>
            <div className="text-center">
              <Briefcase className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-2">Benefícios</h3>
              <p className="text-gray-600">Pacote completo de benefícios</p>
            </div>
          </div>

          <h2 className="text-3xl mb-8">Vagas Abertas</h2>
          <div className="space-y-4">
            {positions.map((position, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg flex items-center justify-between hover:shadow-lg transition-shadow">
                <div>
                  <h3 className="text-xl mb-2">{position.title}</h3>
                  <p className="text-gray-600">{position.dept} • {position.location} • {position.type}</p>
                </div>
                <Link
                  to="/contato"
                  className="bg-[#5a34a1] text-white px-6 py-3 rounded-full hover:bg-[#4a2891] transition-colors"
                >
                  Candidatar-se
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
