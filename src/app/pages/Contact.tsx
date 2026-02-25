import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Aqui seria a integração com backend
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Entre em Contato</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Estamos aqui para ajudar. Entre em contato conosco ou solicite sua viagem.
          </p>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="size-8" />
              </div>
              <h3 className="text-xl mb-2">Telefone</h3>
              <p className="text-gray-700">0800 123 4567</p>
              <p className="text-gray-600 text-sm">(Ligação gratuita)</p>
            </div>

            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="size-8" />
              </div>
              <h3 className="text-xl mb-2">WhatsApp</h3>
              <p className="text-gray-700">(11) 98765-4321</p>
              <p className="text-gray-600 text-sm">Atendimento via chat</p>
            </div>

            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="size-8" />
              </div>
              <h3 className="text-xl mb-2">E-mail</h3>
              <p className="text-gray-700">contato@openline.com.br</p>
              <p className="text-gray-600 text-sm">Resposta em 24h</p>
            </div>

            <div className="text-center">
              <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="size-8" />
              </div>
              <h3 className="text-xl mb-2">Horário</h3>
              <p className="text-gray-700">24 horas por dia</p>
              <p className="text-gray-600 text-sm">7 dias por semana</p>
            </div>
          </div>

          {/* Formulário e Mapa */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Formulário */}
            <div>
              <h2 className="text-3xl mb-6">Envie sua Mensagem</h2>
              
              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6">
                  <p>Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2">
                    Assunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="viagem">Solicitar Viagem</option>
                    <option value="duvida">Dúvidas Gerais</option>
                    <option value="acessibilidade">Questões de Acessibilidade</option>
                    <option value="motorista">Quero ser Motorista</option>
                    <option value="parceria">Parcerias Corporativas</option>
                    <option value="reclamacao">Reclamação</option>
                    <option value="elogio">Elogio/Sugestão</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1] resize-none"
                    placeholder="Digite sua mensagem aqui..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#5a34a1] text-white px-6 py-4 rounded-lg hover:bg-[#4a2891] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="size-5" />
                  Enviar Mensagem
                </button>
              </form>
            </div>

            {/* Informações Adicionais */}
            <div>
              <h2 className="text-3xl mb-6">Outras Formas de Contato</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <MapPin className="size-6 text-[#5a34a1]" />
                  Escritório Central
                </h3>
                <p className="text-gray-700 mb-2">
                  Avenida Paulista, 1000<br />
                  Bela Vista, São Paulo - SP<br />
                  CEP 01310-100
                </p>
                <p className="text-gray-600 text-sm">
                  Segunda a Sexta: 9h às 18h<br />
                  Sábados: 9h às 13h
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-6 rounded-lg mb-6">
                <h3 className="text-xl mb-4">Central de Atendimento 24/7</h3>
                <p className="mb-4">
                  Para emergências durante viagens ou suporte urgente:
                </p>
                <p className="text-2xl mb-2">0800 123 4567</p>
                <p className="text-white/80 text-sm">
                  Disponível 24 horas, 7 dias por semana
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl mb-4">Acessibilidade no Atendimento</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#5a34a1] mt-1">✓</span>
                    <span>Atendimento em Libras via videochamada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5a34a1] mt-1">✓</span>
                    <span>Chat online acessível</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5a34a1] mt-1">✓</span>
                    <span>Atendimento telefônico para pessoas com dificuldade de leitura</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5a34a1] mt-1">✓</span>
                    <span>E-mail com respostas em formato acessível</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Rápido */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">Perguntas Frequentes</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl mb-3 text-[#5a34a1]">Como solicitar uma viagem?</h3>
              <p className="text-gray-700">
                Baixe nosso app, faça seu cadastro, insira o destino e confirme. Você também pode ligar para 0800 123 4567.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl mb-3 text-[#5a34a1]">Todos os veículos são acessíveis?</h3>
              <p className="text-gray-700">
                Sim! 100% da nossa frota é adaptada com rampas, elevadores e espaço adequado para cadeiras de rodas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl mb-3 text-[#5a34a1]">Posso viajar com acompanhante?</h3>
              <p className="text-gray-700">
                Sim! Acompanhantes viajam sem custo adicional em todas as nossas modalidades de serviço.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl mb-3 text-[#5a34a1]">Como me tornar motorista parceiro?</h3>
              <p className="text-gray-700">
                Entre em contato através do formulário acima selecionando "Quero ser Motorista" ou ligue para nossa central.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Download */}
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-6">Baixe Nosso App</h2>
          <p className="text-xl mb-8 text-white/90">
            Disponível para iOS e Android
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#5a34a1] px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
              Download na App Store
            </button>
            <button className="bg-white text-[#5a34a1] px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
              Download no Google Play
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
