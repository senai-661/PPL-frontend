import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, FileText, Lock, Mail, Phone, User } from 'lucide-react';

type PassengerRegistrationPayload = {
  cpf: string;
  nomePassageiro: string;
  sobrenomePassageiro: string;
  dataNascimento: Date;
  email: string;
  celular: string;
  necessidades: string[];
  tipoViagem: string;
  preferenciaClima: string;
  senha: string;
};

const necessidadesDisponiveis = [
  'Cadeirante',
  'Deficiencia visual',
  'Deficiencia auditiva',
  'Acompanhamento no embarque',
];

export function PassengerRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cpf: '',
    nomePassageiro: '',
    sobrenomePassageiro: '',
    dataNascimento: '',
    email: '',
    celular: '',
    necessidades: [] as string[],
    tipoViagem: '',
    preferenciaClima: '',
    senha: '',
  });

  const toggleNecessidade = (necessidade: string) => {
    setFormData((prev) => {
      const necessidadeSelecionada = prev.necessidades.includes(necessidade);
      const necessidades = necessidadeSelecionada
        ? prev.necessidades.filter((item) => item !== necessidade)
        : [...prev.necessidades, necessidade];

      return { ...prev, necessidades };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: PassengerRegistrationPayload = {
      cpf: formData.cpf,
      nomePassageiro: formData.nomePassageiro,
      sobrenomePassageiro: formData.sobrenomePassageiro,
      dataNascimento: new Date(`${formData.dataNascimento}T00:00:00`),
      email: formData.email,
      celular: formData.celular,
      necessidades: formData.necessidades,
      tipoViagem: formData.tipoViagem,
      preferenciaClima: formData.preferenciaClima,
      senha: formData.senha,
    };

    console.log('Payload de cadastro do passageiro:', payload);
    alert('Cadastro realizado com sucesso!');
    navigate('/passageiro/painel');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4">Cadastro de Passageiro</h1>
          <p className="text-gray-600">Preencha os dados obrigatorios para criar sua conta</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Nome *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="text"
                    required
                    value={formData.nomePassageiro}
                    onChange={(e) => setFormData({ ...formData, nomePassageiro: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Sobrenome *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="text"
                    required
                    value={formData.sobrenomePassageiro}
                    onChange={(e) => setFormData({ ...formData, sobrenomePassageiro: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="Seu sobrenome"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">CPF *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Data de Nascimento *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="date"
                  required
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">E-mail *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Celular *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="tel"
                  required
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="(11) 98765-4321"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="block text-gray-700 mb-3">Necessidades</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {necessidadesDisponiveis.map((necessidade) => (
                  <label key={necessidade} className="flex items-center gap-3 cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.necessidades.includes(necessidade)}
                      onChange={() => toggleNecessidade(necessidade)}
                      className="w-4 h-4 text-[#5a34a1]"
                    />
                    <span>{necessidade}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Tipo de Viagem *</label>
                <select
                  required
                  value={formData.tipoViagem}
                  onChange={(e) => setFormData({ ...formData, tipoViagem: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1] bg-white"
                >
                  <option value="">Selecione</option>
                  <option value="urbana">Urbana</option>
                  <option value="intermunicipal">Intermunicipal</option>
                  <option value="recorrente">Recorrente</option>
                  <option value="eventual">Eventual</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Preferencia de Clima *</label>
                <select
                  required
                  value={formData.preferenciaClima}
                  onChange={(e) => setFormData({ ...formData, preferenciaClima: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1] bg-white"
                >
                  <option value="">Selecione</option>
                  <option value="frio">Frio</option>
                  <option value="ameno">Ameno</option>
                  <option value="quente">Quente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Senha *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="password"
                  required
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="Minimo 8 caracteres"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5a34a1] text-white py-3 rounded-lg hover:bg-[#4a2891] transition-colors"
            >
              Criar Conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
