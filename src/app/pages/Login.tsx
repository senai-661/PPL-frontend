import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { LogIn, User, Lock } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'passenger' | 'driver' | 'admin'>('passenger');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login - em produção, isso seria uma chamada API
    if (userType === 'passenger') {
      navigate('/Passageiro/homepage-passageiro');
    } else if (userType === 'driver') {
      navigate('/Motorista/homepage-motorista');
    } else {
      navigate('/Administrador/homepage-administrador');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <LogIn className="size-16 text-[#5a34a1] mx-auto mb-4" />
          <h1 className="text-4xl mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-600">Faça login para continuar</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setUserType('passenger')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                userType === 'passenger'
                  ? 'bg-[#5a34a1] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Passageiro
            </button>
            <button
              onClick={() => setUserType('driver')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                userType === 'driver'
                  ? 'bg-[#5a34a1] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Motorista
            </button>
            <button
              onClick={() => setUserType('admin')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                userType === 'admin'
                  ? 'bg-[#5a34a1] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Lembrar-me</span>
              </label>
              <a href="#" className="text-sm text-[#5a34a1] hover:underline">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5a34a1] text-white py-3 rounded-lg hover:bg-[#4a2891] transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link
                to={
                  userType === 'driver'
                    ? '/Motorista/cadastro-motorista'
                    : '/Passageiro/cadastro-passageiro'
                }
                className="text-[#5a34a1] hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
