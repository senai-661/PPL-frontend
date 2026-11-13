export type RideShortcutTarget = 'origin' | 'destination';

export interface RideShortcut {
  id: string;
  label: string;
  address: string;
  target: RideShortcutTarget;
}

const STORAGE_KEY = 'openline_ride_shortcuts';

export const DEFAULT_RIDE_SHORTCUTS: RideShortcut[] = [
  {
    id: 'home-origin',
    label: 'Av. Paulista',
    address: 'Av. Paulista, 1000, Sao Paulo',
    target: 'origin',
  },
  {
    id: 'shopping-destination',
    label: 'Shopping Ibirapuera',
    address: 'Shopping Ibirapuera, Sao Paulo',
    target: 'destination',
  },
];

export function loadRideShortcuts(): RideShortcut[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_RIDE_SHORTCUTS;

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return DEFAULT_RIDE_SHORTCUTS;

    return parsed.filter(
      (shortcut): shortcut is RideShortcut =>
        typeof shortcut?.id === 'string' &&
        typeof shortcut?.label === 'string' &&
        typeof shortcut?.address === 'string' &&
        (shortcut?.target === 'origin' || shortcut?.target === 'destination'),
    );
  } catch {
    return DEFAULT_RIDE_SHORTCUTS;
  }
}

export function saveRideShortcuts(shortcuts: RideShortcut[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
}
