import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Mail, Phone, Lock } from 'lucide-react';

export function PassengerRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    hasSpecialNeeds: false,
    specialNeedsDescription: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    // Simulação de cadastro
    alert('Cadastro realizado com sucesso!');
    navigate('/Passageiro/homepage-passageiro');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4">Criar Conta</h1>
          <p className="text-gray-600">Cadastre-se para começar a usar a OpenLine</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Nome Completo *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="Seu nome completo"
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
              <label className="block text-gray-700 mb-2">Telefone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="(11) 98765-4321"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Senha *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Confirmar Senha *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="Digite a senha novamente"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasSpecialNeeds}
                  onChange={(e) => setFormData({ ...formData, hasSpecialNeeds: e.target.checked })}
                  className="w-5 h-5 text-[#5a34a1]"
                />
                <span className="text-gray-700">Tenho necessidades especiais de acessibilidade</span>
              </label>

              {formData.hasSpecialNeeds && (
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">
                    Descreva suas necessidades (opcional)
                  </label>
                  <textarea
                    value={formData.specialNeedsDescription}
                    onChange={(e) => setFormData({ ...formData, specialNeedsDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1] resize-none"
                    rows={3}
                    placeholder="Ex: Uso cadeira de rodas, preciso de assistência para embarque, etc."
                  />
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <label className="flex items-start gap-3">
                <input type="checkbox" required className="mt-1" />
                <span className="text-sm text-gray-600">
                  Li e aceito os <a href="#" className="text-[#5a34a1] hover:underline">Termos de Uso</a> e a{' '}
                  <a href="#" className="text-[#5a34a1] hover:underline">Política de Privacidade</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5a34a1] text-white py-3 rounded-lg hover:bg-[#4a2891] transition-colors"
            >
              Criar Conta
            </button>

            <p className="text-center text-gray-600">
              Já tem uma conta?{' '}
              <a href="/login" className="text-[#5a34a1] hover:underline">
                Faça login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
