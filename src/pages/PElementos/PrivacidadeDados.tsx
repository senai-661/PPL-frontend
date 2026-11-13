import { ArrowRight, Database, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacyData() {
  const userType = localStorage.getItem('userType');
  const profilePath = userType === 'driver' ? '/motorista/perfil' : '/passageiro/perfil';
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <section className="min-h-[65vh] bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-950/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="bg-gradient-to-br from-[#4a2c86] via-[#5a34a1] to-[#7653bd] px-6 py-9 text-white sm:px-10 sm:py-12">
            <span className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </span>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">Sua conta OpenLine</p>
            <h1 className="text-3xl font-bold sm:text-4xl">Privacidade e dados</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Encontre atalhos para revisar seus dados e manter sua conta protegida.
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
              <span className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">
                <UserRound className="size-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Revise seus dados</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Confira as informações cadastradas na sua conta e mantenha-as atualizadas.
              </p>
              {isAuthenticated && (
                <Link
                  to={profilePath}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
                >
                  Abrir dados pessoais <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              )}
            </article>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
              <span className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-200">
                <Database className="size-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sobre suas informações</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Use os canais oficiais da OpenLine para esclarecer dúvidas ou solicitar correções relacionadas aos seus dados.
              </p>
              <a
                href="mailto:contato@openline.com.br?subject=Privacidade%20e%20dados"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
              >
                <Mail className="size-4" aria-hidden="true" /> Falar com a OpenLine
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
