import {
  Accessibility,
  ArrowLeft,
  Ear,
  Eye,
  Hand,
  RotateCcw,
  Save,
  Brain,
  Info,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import {
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  loadAccessibilityPreferences,
  saveAccessibilityPreferences,
  type AccessibilityPreferences,
} from '../../utils/accessibilityPreferences';

type AccessibilityOption = {
  key: keyof AccessibilityPreferences;
  title: string;
  description: string;
};

type AccessibilityGroup = {
  title: string;
  description: string;
  icon: typeof Eye;
  options: AccessibilityOption[];
};

const GROUPS: AccessibilityGroup[] = [
  {
    title: 'Deficiências visuais',
    description: 'Ajustes de leitura, contraste e identificação visual.',
    icon: Eye,
    options: [
      { key: 'largeText', title: 'Texto ampliado', description: 'Aumenta o tamanho do texto e controles para facilitar a leitura.' },
      { key: 'highContrast', title: 'Alto contraste', description: 'Reforça contornos, cores de texto e estados interativos.' },
      { key: 'readingComfort', title: 'Leitura confortável', description: 'Aumenta o espaçamento entre linhas e limita a largura de textos longos.' },
      { key: 'audioDescriptions', title: 'Audiodescrição por voz', description: 'Permite ouvir endereços e informações da corrida por meio da voz do navegador.' },
      { key: 'voiceCommands', title: 'Comandos por voz para endereços', description: 'Use o microfone nos campos de origem e destino para ditar um endereço. Requer navegador compatível e permissão para usar o microfone.' },
    ],
  },
  {
    title: 'Deficiências auditivas',
    description: 'Prioriza informações visuais e textuais em vez de sons.',
    icon: Ear,
    options: [
      { key: 'visualAlerts', title: 'Alertas visuais reforçados', description: 'Destaca avisos na tela e mantém mensagens anunciadas por leitores de tela. O app não depende de alertas sonoros.' },
      { key: 'soundNotifications', title: 'Sinal sonoro para notificações', description: 'Emite um sinal curto quando uma notificação do app aparece. Ative apenas se sons forem úteis para você.' },
      { key: 'vibrationAlerts', title: 'Avisos por vibração', description: 'Vibra em dispositivos compatíveis quando uma notificação aparece.' },
    ],
  },
  {
    title: 'Deficiências motoras e físicas',
    description: 'Facilita o uso por toque, teclado e tecnologias assistivas.',
    icon: Hand,
    options: [
      { key: 'largeTargets', title: 'Áreas de toque maiores', description: 'Aumenta o tamanho mínimo de botões, links, campos e seletores.' },
      { key: 'visibleFocus', title: 'Foco de teclado destacado', description: 'Exibe um contorno bem visível ao navegar usando Tab e Shift+Tab.' },
      { key: 'confirmationBeforeCancel', title: 'Confirmar antes de cancelar', description: 'Pede confirmação antes de cancelar uma solicitação de corrida.' },
      { key: 'boardingAssistance', title: 'Preciso de auxílio no embarque', description: 'Adiciona essa necessidade às observações enviadas junto com a solicitação da corrida.' },
      { key: 'accessibleVehicleRequest', title: 'Solicitar veículo acessível', description: 'Inclui esse pedido nas observações para o motorista. A plataforma ainda não garante filtragem ou correspondência automática de veículos adaptados.' },
      { key: 'extraResponseTime', title: 'Mais tempo para ler avisos', description: 'Mantém notificações na tela por mais tempo antes de desaparecerem.' },
    ],
  },
  {
    title: 'Deficiências cognitivas e neurológicas',
    description: 'Reduz movimento e estímulos visuais para uma experiência mais previsível.',
    icon: Brain,
    options: [
      { key: 'reducedMotion', title: 'Reduzir animações', description: 'Desativa animações e transições não essenciais, respeitando também a preferência do sistema.' },
      { key: 'voiceRouteSummary', title: 'Ouvir resumo do trajeto', description: 'Lê em voz alta o endereço de destino e a estimativa de tempo quando uma rota é calculada. Não substitui navegação GPS passo a passo.' },
      { key: 'simplifiedInterface', title: 'Interface simplificada', description: 'Reduz opções secundárias no formulário da corrida para deixar origem, destino e solicitação em destaque.' },
    ],
  },
];

export function AccessibilitySettings() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(loadAccessibilityPreferences);
  const { success } = useToast();

  const updatePreference = (key: keyof AccessibilityPreferences, value: boolean) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveAccessibilityPreferences(preferences);
    success('Preferências de acessibilidade salvas.');
  };

  const restoreDefaults = () => {
    setPreferences(DEFAULT_ACCESSIBILITY_PREFERENCES);
    saveAccessibilityPreferences(DEFAULT_ACCESSIBILITY_PREFERENCES);
  };

  return (
    <section className="min-h-[65vh] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          to={localStorage.getItem('userType') === 'driver' ? '/motorista/painel' : '/passageiro/painel'}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Voltar
        </Link>

        <form onSubmit={handleSubmit} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="bg-gradient-to-br from-[#4a2c86] via-[#5a34a1] to-[#7653bd] px-6 py-8 text-white sm:px-8 sm:py-9">
            <span className="mb-4 inline-flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
              <Accessibility className="size-6" aria-hidden="true" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">Personalização inclusiva</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Acessibilidade</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">
              Ative os recursos que tornam a OpenLine mais confortável para você. As preferências ficam salvas neste dispositivo.
            </p>
          </div>

          <div className="space-y-5 p-4 sm:p-7">
            {GROUPS.map(({ title, description, icon: Icon, options }) => (
              <fieldset key={title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40 sm:p-5">
                <legend className="sr-only">{title}</legend>
                <div className="mb-3 flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-slate-100">{title}</h2>
                    <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{description}</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {options.map(({ key, title: optionTitle, description: optionDescription }) => (
                    <label key={key} className="flex cursor-pointer items-start gap-3 py-3.5 first:pt-2 last:pb-1">
                      <input
                        type="checkbox"
                        checked={preferences[key]}
                        onChange={(event) => updatePreference(key, event.target.checked)}
                        className="mt-1 size-5 shrink-0 accent-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{optionTitle}</span>
                        <span className="mt-0.5 block text-sm leading-5 text-slate-600 dark:text-slate-400">{optionDescription}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <aside className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-100" aria-labelledby="accessibility-integrations-title">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <h2 id="accessibility-integrations-title" className="font-bold">Recursos que ainda precisam de integração</h2>
                  <p className="mt-1 leading-6">
                    Chat e mensagens prontas, tradução em Libras, legendas de mensagens de voz, identificação de motorista surdo, suporte a acionadores externos, navegação GPS passo a passo e filtro automático de veículos adaptados dependem de serviços, dados ou dispositivos que ainda não existem nesta versão.
                    O pedido de veículo acessível e auxílio no embarque pode ser enviado nas observações, mas não garante a disponibilidade do recurso.
                  </p>
                </div>
              </div>
            </aside>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={restoreDefaults}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RotateCcw className="size-4" aria-hidden="true" /> Restaurar padrão
              </button>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5a34a1] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/15 transition hover:bg-[#4a2c86] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <Save className="size-4" aria-hidden="true" /> Salvar preferências
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
