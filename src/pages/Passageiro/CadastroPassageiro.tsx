import { useState } from 'react';
import { User, Mail, Phone, FileText, Lock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SERVER_CFG } from '../../appConfig';

export function PassengerRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    cpf: '',
    dataNascimento: '',
    celular: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    necessidades: '', // opcional
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Formatar celular automaticamente
  const formatarCelular = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  };

  // Validação de celular
  const validarCelular = (celular: string): boolean => {
    const regex = /^\([1-9]{2}\) 9[0-9]{4}-[0-9]{4}$/;
    return regex.test(celular);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'celular') {
      setFormData({ ...formData, [name]: formatarCelular(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validações
    if (!validarCelular(formData.celular)) {
      setError('Celular inválido. Use o formato (XX) 9XXXX-XXXX');
      setLoading(false);
      return;
    }

    if (formData.cpf.replace(/\D/g, '').length !== 11) {
      setError('CPF deve conter 11 dígitos');
      setLoading(false);
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      setLoading(false);
      return;
    }

    const payload = {
      tipo: 'passageiro',
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      cpf: formData.cpf.replace(/\D/g, ''),
      dataNascimento: formData.dataNascimento,
      celular: formData.celular,
      email: formData.email,
      senha: formData.senha,
      necessidades: formData.necessidades ? [formData.necessidades] : [],
    };

    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || 'Erro ao cadastrar');
      }

      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar passageiro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4">Cadastro de Passageiro</h1>
          <p className="text-gray-600">Crie sua conta para começar a usar o OpenLine</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Nome *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="text"
                    name="nome"
                    required
                    value={formData.nome}
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
                    name="sobrenome"
                    required
                    value={formData.sobrenome}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="Seu sobrenome"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">CPF *</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="text"
                    name="cpf"
                    required
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
                <label className="block text-gray-700 mb-2">Data de Nascimento *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="date"
                    name="dataNascimento"
                    required
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Celular *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="tel"
                    name="celular"
                    required
                    value={formData.celular}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="(11) 91234-5678"
                  />
                </div>
                <small className="text-gray-500 text-xs">Formato: (DD) 9XXXX-XXXX</small>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">E-mail *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Necessidades Especiais (opcional)</label>
              <textarea
                name="necessidades"
                value={formData.necessidades}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                placeholder="Ex: Cadeirante, Deficiência visual, mobilidade reduzida, etc."
              />
              <small className="text-gray-500 text-xs">Isso ajuda os motoristas a se prepararem melhor para sua viagem</small>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="password"
                    name="senha"
                    required
                    value={formData.senha}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Confirmar Senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="password"
                    name="confirmarSenha"
                    required
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="Confirme sua senha"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5a34a1] text-white py-3 rounded-lg hover:bg-[#4a2891] transition-colors disabled:opacity-50"
            >
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Já tem uma conta?{' '}
            <a href="/login" className="text-[#5a34a1] hover:underline">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}