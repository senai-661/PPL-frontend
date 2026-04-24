import { useState } from 'react';
import { User, Mail, Phone, FileText, Lock } from 'lucide-react';
import MotoristaRequest from '../../fetch/MotoristaRequest';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';

export function DriverRegistration() {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
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

  // ✅ NOVO: Função para formatar celular enquanto digita
  const formatarCelular = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  };

  // ✅ NOVO: Validação do celular
  const validarCelular = (celular: string): boolean => {
    const regex = /^\([1-9]{2}\) 9[0-9]{4}-[0-9]{4}$/;
    return regex.test(celular);
  };

  // ✅ ALTERADO: Adicionado formatação do celular
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'celular') {
      const formatado = formatarCelular(value);
      setFormData({ ...formData, [name]: formatado });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // ✅ NOVO: Validação do celular antes de enviar
    if (!validarCelular(formData.celular)) {
      setError('Celular inválido. Use o formato (XX) 9XXXX-XXXX');
      setLoading(false);
      return;
    }

    // ✅ NOVO: Validação do CPF
    if (formData.cpf.replace(/\D/g, '').length !== 11) {
      setError('CPF deve conter 11 dígitos');
      setLoading(false);
      return;
    }

    // ✅ NOVO: Validação da CNH
    if (formData.cnh.replace(/\D/g, '').length !== 11) {
      setError('CNH deve conter 11 dígitos');
      setLoading(false);
      return;
    }

    const payload = {
      tipo: 'motorista',
      nome: formData.nomeMotorista,
      sobrenome: formData.sobrenomeMotorista,
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
<<<<<<< HEAD
<<<<<<< HEAD
      await MotoristaRequest.enviaFormularioMotorista(JSON.stringify(payload));
      alert('Cadastro realizado com sucesso!');
      navigate('/motorista/painel');
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar motorista.');
=======
=======
>>>>>>> 31c1b6b0eecf85c438617563a6d5c437200d224a
      const ok = await MotoristaRequest.enviaFormularioMotorista(JSON.stringify(payload));
      if (ok) {
        success('Cadastro realizado com sucesso!');
        navigate('/motorista/painel');
      } else {
        showError('Erro ao cadastrar motorista. Tente novamente.');
      }
    } catch (err: any) {
      showError('Erro ao cadastrar motorista.');
<<<<<<< HEAD
>>>>>>> c6188fadb4e6dff1572bb3d345378b69d640f80d
=======
>>>>>>> 31c1b6b0eecf85c438617563a6d5c437200d224a
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
                    name="nomeMotorista"
                    value={formData.nomeMotorista}
                    onChange={handleChange}
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
                    name="sobrenomeMotorista"
                    value={formData.sobrenomeMotorista}
                    onChange={handleChange}
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
                    name="cpf"
                    maxLength={11}
                    value={formData.cpf}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="12345678901"
                  />
                </div>
                <small className="text-gray-500 text-xs">Apenas números, 11 dígitos</small>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">CNH *</label>
                <input
                  type="text"
                  required
                  name="cnh"
                  maxLength={11}
                  value={formData.cnh}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="00000000000"
                />
                <small className="text-gray-500 text-xs">Apenas números, 11 dígitos</small>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Data de Nascimento *</label>
                <input
                  type="date"
                  required
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
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
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="(11) 98765-4321"
                  />
                </div>
                <small className="text-gray-500 text-xs">Formato: (DD) 9XXXX-XXXX</small>
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                  name="antecedentesCriminais"
                  value={formData.antecedentesCriminais}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="Nada consta"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Especialização</label>
                <select
                  name="especializacao"
                  value={formData.especializacao}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                >
                  <option value="">Selecione...</option>
                  <option value="CADEIRANTE">Cadeirante</option>
                  <option value="VISUAL">Deficiência Visual</option>
                  <option value="AUDITIVA">Deficiência Auditiva</option>
                  <option value="COGNITIVA">Deficiência Cognitiva</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="password"
                    required
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
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
              className="w-full bg-[#5a34a1] text-white py-3 rounded-lg transition-colors disabled:opacity-50"
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
