import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Lock, Mail, Phone, User } from 'lucide-react';
import PassageiroRequest from '../../fetch/PassageiroRequest';

const necessidadesDisponiveis = [
  'Cadeirante',
  'Deficiencia visual',
  'Deficiencia auditiva',
  'Acompanhamento no embarque',
];

const formatCelular = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
};

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
      const jaSelected = prev.necessidades.includes(necessidade);
      return {
        ...prev,
        necessidades: jaSelected
          ? prev.necessidades.filter((item) => item !== necessidade)
          : [...prev.necessidades, necessidade],
          celular: formData.celular.replace(/\D/g, ''),
      };
    });
  };

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
    tipo: 'passageiro',
    cpf: formData.cpf.replace(/\D/g, ''),
    nome: formData.nomePassageiro,        // ✅ "nome" em vez de "nomePassageiro"
    sobrenome: formData.sobrenomePassageiro, // ✅ "sobrenome" em vez de "sobrenomePassageiro"
    dataNascimento: formData.dataNascimento,
    email: formData.email,
    celular: formData.celular,
    necessidades: formData.necessidades,
    tipoViagem: formData.tipoViagem || 'Convencional',
    preferenciaClima: formData.preferenciaClima || 'Não Importa',
    senha: formData.senha,
};

    try {
      const ok = await PassageiroRequest.enviaFormularioPassageiro(JSON.stringify(payload));
      if (ok) {
        alert('Cadastro realizado com sucesso!');
        navigate('/passageiro/painel');
      } else {
        setError('Erro ao cadastrar passageiro. Tente novamente.');
      }
    } catch (err: any) {
      setError('Erro ao cadastrar passageiro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4">Cadastro de Passageiro</h1>
          <p className="text-gray-600">Preencha os dados obrigatórios para criar sua conta</p>
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
                    onChange={(e) => setFormData({ ...formData, celular: formatCelular(e.target.value)})}
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
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, '') })}
                  maxLength={11}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="Somente números"
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
                  <option value="Convencional">Convencional</option>
                  <option value="EconoComigo">EconoComigo</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Preferência de Clima *</label>
                <select
                  required
                  value={formData.preferenciaClima}
                  onChange={(e) => setFormData({ ...formData, preferenciaClima: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1] bg-white"
                >
                  <option value="">Selecione</option>
                  <option value="Silencioso">Silencioso</option>
                  <option value="Com Música">Com Música</option>
                  <option value="Não Importa">Não Importa</option>
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
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
            </div>

            {error && (
              <div className="rounded bg-red-100 text-red-700 px-3 py-2 text-sm mb-2 border border-red-200">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-[#5a34a1] text-white py-3 rounded-lg  transition-colors"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
