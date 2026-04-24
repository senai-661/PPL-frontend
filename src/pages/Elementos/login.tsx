import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, LogIn, Mail, UserRound } from 'lucide-react';
import { SERVER_CFG } from '../../appConfig';

type UserType = 'passenger' | 'driver' | 'admin';

const dashboardByUserType: Record<UserType, string> = {
  passenger: '/passageiro/painel',
  driver: '/motorista/painel',
  admin: '/administrador/painel',
};

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const url = `${SERVER_CFG.SERVER_URL}${SERVER_CFG.ENDPOINT_AUTH_LOGIN}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.password,
          // ✅ NÃO envia 'tipo' - o backend descobre automaticamente
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensagem || 'Falha no login');
      }

      if (!data?.token) {
        throw new Error('Resposta de login sem token.');
      }

      // Mapeia o tipo que veio do backend para o formato do frontend
      const usuarioLogado = data?.usuario ?? data?.passageiro ?? data?.motorista ?? data?.admin ?? null;
      const tipoBackend = usuarioLogado?.tipo ?? data?.tipo ?? null;
      let userType: UserType | null = null;
      
      if (tipoBackend === 'passageiro') userType = 'passenger';
      else if (tipoBackend === 'motorista') userType = 'driver';
      else if (tipoBackend === 'admin') userType = 'admin';

      if (!userType) {
        throw new Error('Perfil de usuário inválido retornado pelo servidor.');
      }

      const normalizedUser = {
        ...usuarioLogado,
        email: usuarioLogado?.email ?? formData.email,
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      localStorage.setItem('userEmail', normalizedUser.email ?? formData.email);

      navigate(dashboardByUserType[userType]);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page-surface min-h-[80vh] px-4 py-12">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40 lg:grid-cols-[1.05fr_1fr]">
        <aside className="flex flex-col justify-between bg-[#4a2c86] p-8 text-white dark:bg-gradient-to-br dark:from-[#251444] dark:to-[#130b26] sm:p-10">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1 text-sm">
              <LogIn className="size-4" />
              Acesso OpenLine
            </p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Entre na sua conta e continue sua jornada.
            </h1>
            <p className="mt-4 text-sm text-white/85 sm:text-base">
              Acesse o maior site de acessibilidade para transporte público do Brasil. Faça login para explorar rotas, horários e muito mais!
            </p>
          </div>
          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/90 dark:bg-white/5">
            O sistema identifica automaticamente seu perfil ao fazer login.
          </div>
        </aside>

        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Entrar</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Informe e-mail e senha para acessar sua área.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {error && (
              <div className="mb-2 rounded border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700 dark:border-red-500/60 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  required
                  placeholder="seu@email.com"
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-slate-900 outline-none transition focus:border-[#4a2c86] focus:ring-2 focus:ring-[#4a2c86]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  required
                  placeholder="Digite sua senha"
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-slate-900 outline-none transition focus:border-[#4a2c86] focus:ring-2 focus:ring-[#4a2c86]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(event) =>
                    setFormData({ ...formData, rememberMe: event.target.checked })
                  }
                  className="size-4 rounded border-slate-300 text-[#4a2c86] focus:ring-[#4a2c86] dark:border-slate-600 dark:bg-slate-800"
                />
                Lembrar de mim
              </label>
              <button type="button" className="font-medium text-[#4a2c86] dark:text-[#b9a8e8]">
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="lift-on-hover inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#4a2c86] py-3 font-semibold text-white transition disabled:opacity-50"
            >
              <UserRound className="size-4" />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            Não possui conta?{' '}
            <Link
              to="/cadastro"
              className="lift-on-hover inline-flex items-center rounded-md bg-[#ede7ff] px-2.5 py-1 font-semibold text-[#4a2c86] dark:bg-[#2a1e48] dark:text-[#d8cfff]"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
