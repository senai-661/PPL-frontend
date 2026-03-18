import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, LogIn, Mail, UserRound } from 'lucide-react';
import { SERVER_CFG } from '../appConfig';

type UserType = 'passenger' | 'driver' | 'admin';
type ApiUserType = 'passageiro' | 'motorista' | 'admin';

const dashboardByUserType: Record<UserType, string> = {
  passenger: '/passageiro/painel',
  driver: '/motorista/painel',
  admin: '/administrador/painel',
};

const registerByUserType: Record<Exclude<UserType, 'admin'>, string> = {
  passenger: '/passageiro/cadastro',
  driver: '/motorista/cadastro',
};

const mapApiUserTypeToFrontend = (apiUserType?: ApiUserType): UserType | null => {
  if (apiUserType === 'passageiro') return 'passenger';
  if (apiUserType === 'motorista') return 'driver';
  if (apiUserType === 'admin') return 'admin';
  return null;
};

const mapFrontendUserTypeToApi = (frontendUserType: UserType): ApiUserType => {
  if (frontendUserType === 'passenger') return 'passageiro';
  if (frontendUserType === 'driver') return 'motorista';
  return 'admin';
};

export function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('passenger');
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });

  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const url = `${SERVER_CFG.SERVER_URL}${SERVER_CFG.ENDPOINT_AUTH_LOGIN}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.password,
          tipo: mapFrontendUserTypeToApi(userType),
        }),
      });
      const responseText = await res.text();
      const responseTrimmed = responseText.trim();

      let data: any = {};
      if (responseTrimmed) {
        try {
          data = JSON.parse(responseTrimmed);
        } catch {
          if (responseTrimmed.startsWith('<!DOCTYPE') || responseTrimmed.startsWith('<html')) {
            throw new Error('A API retornou HTML em vez de JSON. Verifique a URL/rota do backend.');
          }
          throw new Error('Resposta invalida do servidor. Nao foi possivel ler o JSON.');
        }
      }

      if (!res.ok) throw new Error(data?.mensagem || 'Falha no login');
      if (!data?.token) throw new Error('Resposta de login sem token.');

      const userTypeFromApi = mapApiUserTypeToFrontend(data?.usuario?.tipo as ApiUserType);
      if (!userTypeFromApi) {
        throw new Error('Resposta de login sem perfil de usuario valido.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', userTypeFromApi);
      localStorage.setItem('user', JSON.stringify(data.usuario || data.admin || {}));
      navigate(dashboardByUserType[userTypeFromApi]);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <section className="min-h-[80vh] bg-slate-100 px-4 py-12">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/10 lg:grid-cols-[1.05fr_1fr]">
        <aside className="flex flex-col justify-between bg-[#4a2c86] p-8 text-white sm:p-10">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1 text-sm">
              <LogIn className="size-4" />
              Acesso OpenLine
            </p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Entre na sua conta e continue sua jornada.
            </h1>
            <p className="mt-4 text-sm text-white/85 sm:text-base">
              Escolha seu perfil e acesse seus recursos de viagem, motorista ou administracao.
            </p>
          </div>
          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/90">
            Use este login como simulacao de acesso para navegar pelos paineis.
          </div>
        </aside>

        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-slate-900">Entrar</h2>
          <p className="mt-2 text-sm text-slate-600">
            Informe e-mail e senha para acessar sua area.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setUserType('passenger')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                userType === 'passenger'
                  ? 'bg-white text-[#4a2c86] shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Passageiro
            </button>
            <button
              type="button"
              onClick={() => setUserType('driver')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                userType === 'driver'
                  ? 'bg-white text-[#4a2c86] shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Motorista
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                userType === 'admin'
                  ? 'bg-white text-[#4a2c86] shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {error && (
              <div className="rounded bg-red-100 text-red-700 px-3 py-2 text-sm mb-2 border border-red-200">{error}</div>
            )}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  required
                  placeholder="seu@email.com"
                  className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-3 text-slate-900 outline-none transition focus:border-[#4a2c86] focus:ring-2 focus:ring-[#4a2c86]/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  required
                  placeholder="Digite sua senha"
                  className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-3 text-slate-900 outline-none transition focus:border-[#4a2c86] focus:ring-2 focus:ring-[#4a2c86]/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(event) =>
                    setFormData({ ...formData, rememberMe: event.target.checked })
                  }
                  className="size-4 rounded border-slate-300 text-[#4a2c86] focus:ring-[#4a2c86]"
                />
                Lembrar de mim
              </label>
              <button type="button" className="font-medium text-[#4a2c86] hover:underline">
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#4a2c86] py-3 font-semibold text-white transition hover:bg-[#3f2570]"
            >
              <UserRound className="size-4" />
              Entrar
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            {userType === 'admin' ? (
              'Acesso administrativo interno.'
            ) : (
              <>
                Nao possui conta?{' '}
                <Link to={registerByUserType[userType]} className="font-semibold text-[#4a2c86] hover:underline">
                  Criar conta
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
