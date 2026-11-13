import { ArrowLeft, Check, Circle, Contrast, Heart, Languages, Leaf, Map, MapPin, Mountain, Save, Satellite, Sparkles, Sun, Tags } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import {
  DEFAULT_DASHBOARD_PREFERENCES,
  LOCATION_ICON_OPTIONS,
  loadDashboardPreferences,
  saveDashboardPreferences,
  type DashboardLanguage,
  type DashboardMapStyle,
  type DashboardPreferences,
} from '../../utils/dashboardPreferences';

type PanelUserType = 'passenger' | 'driver';

const MAP_STYLES: {
  value: DashboardMapStyle;
  label: string;
  description: string;
  icon: typeof Map;
  previewClass: string;
}[] = [
  {
    value: 'street',
    label: 'Ruas (OpenStreetMap)',
    description: 'Mapa clássico e detalhado. Sem chave de API.',
    icon: Map,
    previewClass: 'bg-[linear-gradient(35deg,transparent_42%,#fff_43%,#fff_49%,transparent_50%),linear-gradient(135deg,transparent_28%,#d9c9ad_29%,#d9c9ad_34%,transparent_35%),linear-gradient(90deg,#dcebd7_0_22%,#eef1df_22%_48%,#d5e6d3_48%_70%,#ece7d9_70%)]',
  },
  {
    value: 'dark',
    label: 'Escuro (sem chave)',
    description: 'OpenStreetMap com tema escuro aplicado localmente; sem chave de API.',
    icon: Sparkles,
    previewClass: 'bg-[linear-gradient(35deg,transparent_42%,#64748b_43%,#64748b_49%,transparent_50%),linear-gradient(135deg,transparent_28%,#475569_29%,#475569_34%,transparent_35%),linear-gradient(90deg,#1e293b_0_22%,#334155_22%_48%,#273449_48%_70%,#1e293b_70%)]',
  },
  {
    value: 'light',
    label: 'Claro suave (OSM)',
    description: 'OpenStreetMap com cores suaves; sem chave de API.',
    icon: Sun,
    previewClass: 'bg-[linear-gradient(35deg,transparent_42%,#fff_43%,#fff_49%,transparent_50%),linear-gradient(135deg,transparent_28%,#e6d9c8_29%,#e6d9c8_34%,transparent_35%),linear-gradient(90deg,#f1f3eb_0_22%,#fbfaf6_22%_48%,#eaf0e8_48%_70%,#f8f6f1_70%)]',
  },
  {
    value: 'humanitarian',
    label: 'Humanitário (OSM)',
    description: 'Paleta suave inspirada em mapas humanitários; sem chave.',
    icon: Heart,
    previewClass: 'bg-[linear-gradient(35deg,transparent_42%,#fff_43%,#fff_49%,transparent_50%),linear-gradient(135deg,transparent_28%,#e3b87c_29%,#e3b87c_34%,transparent_35%),linear-gradient(90deg,#e7edd8_0_22%,#f7eee1_22%_48%,#e8e4d0_48%_70%,#f4e3d6_70%)]',
  },
  {
    value: 'topographic',
    label: 'Topográfico (OpenTopoMap)',
    description: 'Relevo e curvas de nível. Sem chave de API.',
    icon: Mountain,
    previewClass: 'bg-[linear-gradient(35deg,transparent_42%,#fff_43%,#fff_49%,transparent_50%),linear-gradient(135deg,transparent_28%,#a7c58d_29%,#a7c58d_34%,transparent_35%),repeating-radial-gradient(ellipse at 70% 40%,#d8c99a_0_2px,#e9e1c4 3px_8px,#bad0a4 9px_14px)]',
  },
  {
    value: 'satellite',
    label: 'Satélite (Esri)',
    description: 'Imagens aéreas. Camada pública sem chave de API.',
    icon: Satellite,
    previewClass: 'bg-[linear-gradient(35deg,transparent_42%,#b5a77f_43%,#b5a77f_49%,transparent_50%),linear-gradient(135deg,transparent_28%,#637b49_29%,#637b49_34%,transparent_35%),linear-gradient(90deg,#314a35_0_22%,#64734c_22%_48%,#405a3d_48%_70%,#7c7551_70%)]',
  },
  {
    value: 'places',
    label: 'Ruas e pontos de interesse',
    description: 'Ruas, bairros, parques e locais marcados. Esri, sem chave.',
    icon: Tags,
    previewClass: 'bg-[linear-gradient(35deg,transparent_42%,#fff_43%,#fff_49%,transparent_50%),linear-gradient(135deg,transparent_28%,#d7c7a8_29%,#d7c7a8_34%,transparent_35%),linear-gradient(90deg,#cbe5c1_0_22%,#f3edda_22%_48%,#d7e8d1_48%_70%,#e9dfc8_70%)]',
  },
  {
    value: 'contrast',
    label: 'Alto contraste',
    description: 'Vias, áreas e rótulos mais destacados. Sem chave.',
    icon: Contrast,
    previewClass: 'bg-[linear-gradient(35deg,transparent_42%,#fff_43%,#fff_50%,transparent_51%),linear-gradient(135deg,transparent_28%,#b18c5a_29%,#b18c5a_36%,transparent_37%),linear-gradient(90deg,#a8cb9d_0_22%,#f2e7a5_22%_48%,#9dc997_48%_70%,#e8cba1_70%)]',
  },
  {
    value: 'grayscale',
    label: 'Monocromático',
    description: 'Mapa neutro em tons de cinza. Sem chave.',
    icon: Circle,
    previewClass: 'bg-[linear-gradient(35deg,transparent_42%,#fff_43%,#fff_49%,transparent_50%),linear-gradient(135deg,transparent_28%,#b8b8b8_29%,#b8b8b8_34%,transparent_35%),linear-gradient(90deg,#c9c9c9_0_22%,#ededed_22%_48%,#bcbcbc_48%_70%,#e1e1e1_70%)]',
  },
  {
    value: 'warm',
    label: 'Tons quentes',
    description: 'Paleta suave em tons de areia. Sem chave.',
    icon: Sun,
    previewClass: 'bg-[linear-gradient(35deg,transparent_42%,#fff_43%,#fff_49%,transparent_50%),linear-gradient(135deg,transparent_28%,#c9a477_29%,#c9a477_34%,transparent_35%),linear-gradient(90deg,#e4d6bd_0_22%,#f6ead8_22%_48%,#ded0b3_48%_70%,#edddc5_70%)]',
  },
  {
    value: 'nature',
    label: 'Natureza',
    description: 'Realça áreas verdes e parques. Sem chave.',
    icon: Leaf,
    previewClass: 'bg-[linear-gradient(35deg,transparent_42%,#fff_43%,#fff_49%,transparent_50%),linear-gradient(135deg,transparent_28%,#c4b38d_29%,#c4b38d_34%,transparent_35%),linear-gradient(90deg,#96bd8b_0_22%,#e6edcc_22%_48%,#83af7c_48%_70%,#ece5cc_70%)]',
  },
];

const LANGUAGES: { value: DashboardLanguage; label: string; nativeName: string; flag: string }[] = [
  { value: 'pt-BR', label: 'Português', nativeName: 'Brasil', flag: '🇧🇷' },
  { value: 'en', label: 'English', nativeName: 'United States', flag: '🇺🇸' },
  { value: 'es', label: 'Español', nativeName: 'Latinoamérica', flag: '🌎' },
];

export function PanelSettings({ userType }: { userType: PanelUserType }) {
  const [preferences, setPreferences] = useState<DashboardPreferences>(loadDashboardPreferences);
  const navigate = useNavigate();
  const { success } = useToast();
  const dashboardPath = userType === 'driver' ? '/motorista/painel' : '/passageiro/painel';

  const updatePreference = <K extends keyof DashboardPreferences>(key: K, value: DashboardPreferences[K]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveDashboardPreferences(preferences);
    success('Configurações do painel salvas.');
    navigate(dashboardPath);
  };

  const restoreDefaults = () => setPreferences(DEFAULT_DASHBOARD_PREFERENCES);

  return (
    <section className="min-h-[65vh] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          to={dashboardPath}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Voltar ao painel
        </Link>

        <form onSubmit={handleSubmit} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="bg-gradient-to-br from-[#4a2c86] via-[#5a34a1] to-[#7653bd] px-6 py-8 text-white sm:px-8 sm:py-9">
            <span className="mb-4 inline-flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">Personalização</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Configurações do painel</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Ajuste a aparência do mapa, o marcador da sua localização e o idioma usado no painel.
            </p>
          </div>

          <div className="space-y-8 p-5 sm:p-8">
            <fieldset>
              <legend className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                <Map className="size-5 text-violet-600 dark:text-violet-300" aria-hidden="true" />
                Estilo do mapa
              </legend>
              <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">Escolha entre onze estilos. “Ruas e pontos de interesse” mostra nomes e locais marcados, parecido com o exemplo. Nenhum exige chave de API.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {MAP_STYLES.map(({ value, label, description, icon: Icon, previewClass }) => {
                  const selected = preferences.mapStyle === value;
                  return (
                    <label
                      key={value}
                      className={`cursor-pointer overflow-hidden rounded-2xl border transition focus-within:ring-2 focus-within:ring-violet-500 ${selected ? 'border-violet-500 ring-2 ring-violet-500/15 dark:border-violet-400' : 'border-slate-200 hover:border-violet-300 dark:border-slate-700 dark:hover:border-slate-500'}`}
                    >
                      <input
                        type="radio"
                        name="mapStyle"
                        value={value}
                        checked={selected}
                        onChange={() => updatePreference('mapStyle', value)}
                        className="sr-only"
                      />
                      <span className={`relative block h-24 ${previewClass}`} aria-hidden="true">
                        <span className="absolute bottom-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-white/90 text-violet-700 shadow dark:bg-slate-900/90 dark:text-violet-200">
                          {selected ? <Check className="size-4" /> : <Icon className="size-4" />}
                        </span>
                      </span>
                      <span className="block p-3.5">
                        <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">{label}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="border-t border-slate-200 pt-7 dark:border-slate-800">
              <legend className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                <MapPin className="size-5 text-violet-600 dark:text-violet-300" aria-hidden="true" />
                Ícone da sua localização
              </legend>
              <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">Personalize o marcador que identifica sua posição no mapa.</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {LOCATION_ICON_OPTIONS.map((option) => {
                  const selected = preferences.locationIcon === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition focus-within:ring-2 focus-within:ring-violet-500 ${selected ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500/15 dark:border-violet-400 dark:bg-violet-400/10' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'}`}
                    >
                      <input
                        type="radio"
                        name="locationIcon"
                        value={option.value}
                        checked={selected}
                        onChange={() => updatePreference('locationIcon', option.value)}
                        className="sr-only"
                      />
                      <span className="text-2xl" aria-hidden="true">{option.glyph}</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="border-t border-slate-200 pt-7 dark:border-slate-800">
              <legend className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                <Languages className="size-5 text-violet-600 dark:text-violet-300" aria-hidden="true" />
                Idioma do painel
              </legend>
              <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">O idioma selecionado será aplicado aos textos do painel de viagens e do mapa.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {LANGUAGES.map((language) => {
                  const selected = preferences.language === language.value;
                  return (
                    <label
                      key={language.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition focus-within:ring-2 focus-within:ring-violet-500 ${selected ? 'border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-400/10' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'}`}
                    >
                      <input
                        type="radio"
                        name="language"
                        value={language.value}
                        checked={selected}
                        onChange={() => updatePreference('language', language.value)}
                        className="sr-only"
                      />
                      <span className="text-2xl" aria-hidden="true">{language.flag}</span>
                      <span>
                        <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">{language.label}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{language.nativeName}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={restoreDefaults}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Restaurar padrão
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5a34a1] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/15 transition hover:bg-[#4a2c86] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <Save className="size-4" aria-hidden="true" /> Salvar configurações
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
