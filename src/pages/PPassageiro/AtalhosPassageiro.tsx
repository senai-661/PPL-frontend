import { ArrowLeft, MapPin, Plus, Save, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import {
  DEFAULT_RIDE_SHORTCUTS,
  loadRideShortcuts,
  saveRideShortcuts,
  type RideShortcut,
} from '../../utils/rideShortcuts';

export function PassengerShortcuts() {
  const [shortcuts, setShortcuts] = useState<RideShortcut[]>(loadRideShortcuts);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const updateShortcut = (id: string, field: keyof RideShortcut, value: string) => {
    setShortcuts((current) =>
      current.map((shortcut) => (shortcut.id === id ? { ...shortcut, [field]: value } : shortcut)),
    );
  };

  const addShortcut = () => {
    if (shortcuts.length >= 4) return;
    setShortcuts((current) => [
      ...current,
      {
        id: `shortcut-${Date.now()}`,
        label: '',
        address: '',
        target: 'origin',
      },
    ]);
  };

  const removeShortcut = (id: string) => {
    setShortcuts((current) => current.filter((shortcut) => shortcut.id !== id));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hasIncompleteShortcut = shortcuts.some(
      (shortcut) => !shortcut.label.trim() || !shortcut.address.trim(),
    );

    if (hasIncompleteShortcut) {
      error('Preencha o nome e o endereço de cada atalho ou remova o atalho incompleto.');
      return;
    }

    saveRideShortcuts(
      shortcuts.map((shortcut) => ({
        ...shortcut,
        label: shortcut.label.trim(),
        address: shortcut.address.trim(),
      })),
    );
    success('Seus atalhos foram atualizados.');
    navigate('/passageiro/painel');
  };

  const restoreDefaults = () => setShortcuts(DEFAULT_RIDE_SHORTCUTS);

  return (
    <section className="min-h-[65vh] bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/passageiro/painel"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Voltar ao painel
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="bg-gradient-to-br from-[#4a2c86] via-[#5a34a1] to-[#7653bd] px-6 py-8 text-white sm:px-8">
            <span className="mb-4 inline-flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
              <MapPin className="size-5" aria-hidden="true" />
            </span>
            <h1 className="text-2xl font-bold sm:text-3xl">Escolher atalhos</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
              Personalize os endereços rápidos que aparecem no painel e escolha se cada um preenche a origem ou o destino.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-8">
            {shortcuts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                Nenhum atalho configurado. Adicione um para acessá-lo rapidamente no painel.
              </div>
            )}

            {shortcuts.map((shortcut, index) => (
              <fieldset
                key={shortcut.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50 sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <legend className="font-semibold text-slate-900 dark:text-slate-100">
                    Atalho {index + 1}
                  </legend>
                  <button
                    type="button"
                    onClick={() => removeShortcut(shortcut.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
                    aria-label={`Remover atalho ${index + 1}`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" /> Remover
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Nome do atalho
                    <input
                      value={shortcut.label}
                      onChange={(event) => updateShortcut(shortcut.id, 'label', event.target.value)}
                      placeholder="Ex.: Casa, Trabalho"
                      maxLength={40}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Usar como
                    <select
                      value={shortcut.target}
                      onChange={(event) => updateShortcut(shortcut.id, 'target', event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <option value="origin">Origem</option>
                      <option value="destination">Destino</option>
                    </select>
                  </label>

                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 sm:col-span-2">
                    Endereço
                    <input
                      value={shortcut.address}
                      onChange={(event) => updateShortcut(shortcut.id, 'address', event.target.value)}
                      placeholder="Digite um endereço completo"
                      maxLength={180}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </label>
                </div>
              </fieldset>
            ))}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={addShortcut}
                  disabled={shortcuts.length >= 4}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Plus className="size-4" aria-hidden="true" /> Adicionar atalho
                </button>
                <button
                  type="button"
                  onClick={restoreDefaults}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Restaurar padrão
                </button>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5a34a1] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/15 transition hover:bg-[#4a2c86] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <Save className="size-4" aria-hidden="true" /> Salvar atalhos
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
