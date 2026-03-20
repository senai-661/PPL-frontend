import { useState } from 'react';
import { User, Mail, Phone, FileText, Lock } from 'lucide-react';
import MotoristaRequest from '../../fetch/MotoristaRequest';
import { useNavigate } from 'react-router-dom';

export function DriverRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeMotorista: '',
    sobrenomeMotorista: '',
    cpf: '',
    cnh: '',
    dataNascimento: '',
    celular: '',
    email: '',
    antecedentesCriminais: '',
    especializacao: '',
    senha: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      tipo: 'motorista',                        // ✅ obrigatório pelo UsuarioController
      nome: formData.nomeMotorista,             // ✅ banco espera "nome"
      sobrenome: formData.sobrenomeMotorista,   // ✅ banco espera "sobrenome"
      cpf: formData.cpf.replace(/\D/g, ''),
      cnh: formData.cnh,
      dataNascimento: formData.dataNascimento,
      celular: formData.celular,
      email: formData.email,
      antecedentesCriminais: formData.antecedentesCriminais,
      especializacao: formData.especializacao,
      senha: formData.senha,
    };

    try {
      const ok = await MotoristaRequest.enviaFormularioMotorista(JSON.stringify(payload));
      if (ok) {
        alert('Cadastro realizado com sucesso!');
        navigate('/motorista/painel');
      } else {
        setError('Erro ao cadastrar motorista. Tente novamente.');
      }
    } catch (err: any) {
      setError('Erro ao cadastrar motorista.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4">Cadastro de Motorista</h1>
          <p className="text-gray-600">Preencha todos os dados obrigatórios para criar sua conta de motorista</p>
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
                    value={formData.nomeMotorista}
                    onChange={(e) => setFormData({ ...formData, nomeMotorista: e.target.value })}
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
                    value={formData.sobrenomeMotorista}
                    onChange={(e) => setFormData({ ...formData, sobrenomeMotorista: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="Seu sobrenome"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
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
                <label className="block text-gray-700 mb-2">CNH *</label>
                <input
                  type="text"
                  required
                  value={formData.cnh}
                  onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="00000000000"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Data de Nascimento *</label>
                <input
                  type="date"
                  required
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                />
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
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
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
                <label className="block text-gray-700 mb-2">Antecedentes Criminais *</label>
                <input
                  type="text"
                  required
                  value={formData.antecedentesCriminais}
                  onChange={(e) => setFormData({ ...formData, antecedentesCriminais: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="Nada consta"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Especialização</label>
                <input
                  type="text"
                  value={formData.especializacao}
                  onChange={(e) => setFormData({ ...formData, especializacao: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="LIBRAS, Mobilidade Reduzida, etc."
                />
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
