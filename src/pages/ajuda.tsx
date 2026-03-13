import { Search, MessageCircle, Book, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Help() {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: 'Conta e Pagamento',
      questions: [
        { q: 'Como criar uma conta?', a: 'Baixe o app OpenLine e siga as instruções de cadastro.' },
        { q: 'Quais formas de pagamento são aceitas?', a: 'Aceitamos cartão de crédito, débito, PIX e dinheiro.' },
        { q: 'Como adicionar um método de pagamento?', a: 'Acesse Perfil > Pagamentos no app.' },
      ],
    },
    {
      category: 'Viagens',
      questions: [
        { q: 'Como solicitar uma viagem?', a: 'Abra o app, insira o destino e confirme a solicitação.' },
        { q: 'Posso agendar uma viagem?', a: 'Sim! Use a opção OpenLine Schedule para agendar até 30 dias antes.' },
        { q: 'Como cancelar uma viagem?', a: 'Acesse a viagem ativa e clique em Cancelar. Verifique a política de cancelamento.' },
      ],
    },
    {
      category: 'Acessibilidade',
      questions: [
        { q: 'Todos os carros são acessíveis?', a: 'Sim! 100% da nossa frota possui adaptações de acessibilidade.' },
        { q: 'Posso viajar com acompanhante?', a: 'Sim, acompanhantes não pagam taxa adicional.' },
        { q: 'Como solicito um carro com rampa?', a: 'Todos os nossos veículos possuem rampa ou elevador.' },
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Central de Ajuda</h1>
          <p className="text-xl text-white/90 max-w-3xl mb-8">
            Encontre respostas para suas dúvidas ou entre em contato conosco
          </p>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              placeholder="Buscar ajuda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Link to="/contato" className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow text-center">
              <MessageCircle className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-2">Chat ao Vivo</h3>
              <p className="text-gray-600">Fale com nossa equipe agora</p>
            </Link>

            <a href="tel:08001234567" className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow text-center">
              <Phone className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-2">Ligue para Nós</h3>
              <p className="text-gray-600">0800 123 4567</p>
            </a>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Book className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-2">Guias e Tutoriais</h3>
              <p className="text-gray-600">Aprenda a usar o app</p>
            </div>
          </div>

          <h2 className="text-4xl mb-12 text-center">Perguntas Frequentes</h2>
          
          {faqs.map((category, idx) => (
            <div key={idx} className="mb-12">
              <h3 className="text-2xl mb-6 text-[#5a34a1]">{category.category}</h3>
              <div className="space-y-4">
                {category.questions.map((item, qIdx) => (
                  <details key={qIdx} className="bg-gray-50 p-6 rounded-lg">
                    <summary className="cursor-pointer text-lg hover:text-[#5a34a1] transition-colors">
                      {item.q}
                    </summary>
                    <p className="mt-4 text-gray-700">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
