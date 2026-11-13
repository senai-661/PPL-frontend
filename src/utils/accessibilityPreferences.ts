export interface AccessibilityPreferences {
  largeText: boolean;
  highContrast: boolean;
  visualAlerts: boolean;
  largeTargets: boolean;
  visibleFocus: boolean;
  reducedMotion: boolean;
  readingComfort: boolean;
  voiceCommands: boolean;
  audioDescriptions: boolean;
  voiceRouteSummary: boolean;
  soundNotifications: boolean;
  vibrationAlerts: boolean;
  confirmationBeforeCancel: boolean;
  boardingAssistance: boolean;
  extraResponseTime: boolean;
  accessibleVehicleRequest: boolean;
  simplifiedInterface: boolean;
}

const STORAGE_KEY = 'openline_accessibility_preferences';

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  largeText: false,
  highContrast: false,
  visualAlerts: true,
  largeTargets: false,
  visibleFocus: true,
  reducedMotion: false,
  readingComfort: false,
  voiceCommands: false,
  audioDescriptions: false,
  voiceRouteSummary: false,
  soundNotifications: false,
  vibrationAlerts: false,
  confirmationBeforeCancel: true,
  boardingAssistance: false,
  extraResponseTime: false,
  accessibleVehicleRequest: false,
  simplifiedInterface: false,
};

const preferenceClasses: Record<keyof AccessibilityPreferences, string> = {
  largeText: 'a11y-large-text',
  highContrast: 'a11y-high-contrast',
  visualAlerts: 'a11y-visual-alerts',
  largeTargets: 'a11y-large-targets',
  visibleFocus: 'a11y-visible-focus',
  reducedMotion: 'a11y-reduced-motion',
  readingComfort: 'a11y-reading-comfort',
  voiceCommands: 'a11y-voice-commands',
  audioDescriptions: 'a11y-audio-descriptions',
  voiceRouteSummary: 'a11y-voice-route-summary',
  soundNotifications: 'a11y-sound-notifications',
  vibrationAlerts: 'a11y-vibration-alerts',
  confirmationBeforeCancel: 'a11y-confirm-cancel',
  boardingAssistance: 'a11y-boarding-assistance',
  extraResponseTime: 'a11y-extra-response-time',
  accessibleVehicleRequest: 'a11y-accessible-vehicle-request',
  simplifiedInterface: 'a11y-simplified-interface',
};

export function loadAccessibilityPreferences(): AccessibilityPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_ACCESSIBILITY_PREFERENCES;

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_ACCESSIBILITY_PREFERENCES;

    const values = parsed as Partial<AccessibilityPreferences>;
    return Object.fromEntries(
      Object.keys(DEFAULT_ACCESSIBILITY_PREFERENCES).map((key) => [
        key,
        typeof values[key as keyof AccessibilityPreferences] === 'boolean'
          ? values[key as keyof AccessibilityPreferences]
          : DEFAULT_ACCESSIBILITY_PREFERENCES[key as keyof AccessibilityPreferences],
      ]),
    ) as unknown as AccessibilityPreferences;
  } catch {
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  }
}

export function applyAccessibilityPreferences(preferences: AccessibilityPreferences): void {
  const root = document.documentElement;
  Object.entries(preferenceClasses).forEach(([preference, className]) => {
    root.classList.toggle(
      className,
      preferences[preference as keyof AccessibilityPreferences],
    );
  });
}

export function saveAccessibilityPreferences(preferences: AccessibilityPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  applyAccessibilityPreferences(preferences);
}

export function speakAccessibilityText(text: string, language = 'pt-BR'): boolean {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function notifyWithAccessibilitySignals(): void {
  const preferences = loadAccessibilityPreferences();

  if (preferences.vibrationAlerts && 'vibrate' in navigator) {
    navigator.vibrate([120, 70, 120]);
  }

  if (preferences.soundNotifications && 'AudioContext' in window) {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.22);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.24);
      oscillator.onended = () => void audioContext.close();
    } catch {
      // Audio feedback remains optional; browsers may block it until user interaction.
    }
  }
}
