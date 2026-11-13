export type DashboardMapStyle =
  | 'street'
  | 'dark'
  | 'light'
  | 'humanitarian'
  | 'topographic'
  | 'satellite'
  | 'contrast'
  | 'grayscale'
  | 'warm'
  | 'nature'
  | 'places';
export type DashboardLocationIcon = 'pin' | 'car' | 'person' | 'accessible';
export type DashboardLanguage = 'pt-BR' | 'en' | 'es';

export interface DashboardPreferences {
  mapStyle: DashboardMapStyle;
  locationIcon: DashboardLocationIcon;
  language: DashboardLanguage;
}

const STORAGE_KEY = 'openline_dashboard_preferences';

export const DEFAULT_DASHBOARD_PREFERENCES: DashboardPreferences = {
  mapStyle: 'street',
  locationIcon: 'pin',
  language: 'pt-BR',
};

const validMapStyles: DashboardMapStyle[] = [
  'street', 'dark', 'light', 'humanitarian', 'topographic', 'satellite',
  'contrast', 'grayscale', 'warm', 'nature', 'places',
];
const validLocationIcons: DashboardLocationIcon[] = ['pin', 'car', 'person', 'accessible'];
const validLanguages: DashboardLanguage[] = ['pt-BR', 'en', 'es'];

export function loadDashboardPreferences(): DashboardPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_DASHBOARD_PREFERENCES;

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_DASHBOARD_PREFERENCES;

    const values = parsed as Partial<DashboardPreferences>;
    return {
      mapStyle: validMapStyles.includes(values.mapStyle as DashboardMapStyle)
        ? values.mapStyle as DashboardMapStyle
        : DEFAULT_DASHBOARD_PREFERENCES.mapStyle,
      locationIcon: validLocationIcons.includes(values.locationIcon as DashboardLocationIcon)
        ? values.locationIcon as DashboardLocationIcon
        : DEFAULT_DASHBOARD_PREFERENCES.locationIcon,
      language: validLanguages.includes(values.language as DashboardLanguage)
        ? values.language as DashboardLanguage
        : DEFAULT_DASHBOARD_PREFERENCES.language,
    };
  } catch {
    return DEFAULT_DASHBOARD_PREFERENCES;
  }
}

export function saveDashboardPreferences(preferences: DashboardPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

const panelTranslations = {
  'pt-BR': {
    passengerTitle: 'Solicitar viagem', passengerSubtitle: 'Para onde você quer ir?', origin: 'Origem', destination: 'Destino',
    originPlaceholder: 'Digite sua rua, avenida ou bairro', destinationPlaceholder: 'Para onde você quer ir?', swap: 'Trocar origem e destino',
    rideType: 'Tipo de corrida', passengers: 'Número de passageiros', passenger: 'Passageiro', passengersPlural: 'Passageiros',
    conventionalRide: 'Convencional', premiumRide: 'Premium', ecoRide: 'EconoComigo', activateDriverMode: 'Ativar modo online',
    notes: 'Observações (opcional)', notesPlaceholder: 'Ex.: Tenho muitas malas, precisamos de carro grande...',
    requestRide: 'Solicitar viagem', schedule: 'Agendar', scheduling: 'Solicitando...', shortcuts: 'ATALHOS', edit: 'Editar',
    noShortcuts: 'Nenhum atalho salvo. Use “Editar” para escolher seus endereços rápidos.',
    driverTitle: 'Modo motorista', goingOffline: 'Ficando offline...', goingOnline: 'Ficando online...', online: 'Online', offline: 'Offline',
    available: 'Você está disponível para receber solicitações.', activateOnline: 'Clique no botão acima para ativar o modo online.',
    currentRide: 'CORRIDA ATUAL', destinationPrefix: 'Destino:', startRide: 'Iniciar corrida', finishRide: 'Finalizar corrida',
    driverLocation: 'Sua localização', estimatedPosition: 'Posição estimada', locationShared: 'Sua posição atual está sendo compartilhada.', locationNotShared: 'Ative o modo online para compartilhar sua localização.',
    today: 'HOJE', earnings: 'Ganhos:', trips: 'Viagens:', support: 'Suporte 24/7', awaitingRides: 'Aguardando solicitações próximas...',
    adapted: 'ADAPTADO', conventional: 'CONVENCIONAL', specialNeeds: 'Necessidades especiais',
    mapPassengerTitle: 'Mapa da viagem', mapPassengerSubtitle: 'Digite origem e destino para visualizar o trajeto no mapa.',
    mapDriverTitle: 'Mapa do motorista', mapDriverSubtitle: 'Sua localização e as próximas corridas aparecerão aqui.',
    mapLoading: 'Carregando mapa...',
  },
  en: {
    passengerTitle: 'Request a ride', passengerSubtitle: 'Where would you like to go?', origin: 'Pickup', destination: 'Destination',
    originPlaceholder: 'Enter a street, avenue, or neighborhood', destinationPlaceholder: 'Where would you like to go?', swap: 'Swap pickup and destination',
    rideType: 'Ride type', passengers: 'Number of passengers', passenger: 'Passenger', passengersPlural: 'Passengers',
    conventionalRide: 'Standard', premiumRide: 'Premium', ecoRide: 'Eco', activateDriverMode: 'Go online',
    notes: 'Notes (optional)', notesPlaceholder: 'e.g. I have several bags; we need a larger vehicle...',
    requestRide: 'Request ride', schedule: 'Schedule', scheduling: 'Requesting...', shortcuts: 'SHORTCUTS', edit: 'Edit',
    noShortcuts: 'No shortcuts saved. Select “Edit” to choose your quick addresses.',
    driverTitle: 'Driver mode', goingOffline: 'Going offline...', goingOnline: 'Going online...', online: 'Online', offline: 'Offline',
    available: 'You are available to receive ride requests.', activateOnline: 'Use the button above to go online.',
    currentRide: 'CURRENT RIDE', destinationPrefix: 'Destination:', startRide: 'Start ride', finishRide: 'Finish ride',
    driverLocation: 'Your location', estimatedPosition: 'Estimated position', locationShared: 'Your current position is being shared.', locationNotShared: 'Go online to share your location.',
    today: 'TODAY', earnings: 'Earnings:', trips: 'Rides:', support: '24/7 support', awaitingRides: 'Waiting for nearby requests...',
    adapted: 'ACCESSIBLE', conventional: 'STANDARD', specialNeeds: 'Accessibility needs',
    mapPassengerTitle: 'Trip map', mapPassengerSubtitle: 'Enter pickup and destination to preview the route.',
    mapDriverTitle: 'Driver map', mapDriverSubtitle: 'Your location and nearby rides will appear here.',
    mapLoading: 'Loading map...',
  },
  es: {
    passengerTitle: 'Solicitar viaje', passengerSubtitle: '¿A dónde quieres ir?', origin: 'Origen', destination: 'Destino',
    originPlaceholder: 'Escribe una calle, avenida o barrio', destinationPlaceholder: '¿A dónde quieres ir?', swap: 'Intercambiar origen y destino',
    rideType: 'Tipo de viaje', passengers: 'Número de pasajeros', passenger: 'Pasajero', passengersPlural: 'Pasajeros',
    conventionalRide: 'Convencional', premiumRide: 'Premium', ecoRide: 'Económico', activateDriverMode: 'Activar modo en línea',
    notes: 'Notas (opcional)', notesPlaceholder: 'Ej.: Tengo varias maletas; necesitamos un vehículo grande...',
    requestRide: 'Solicitar viaje', schedule: 'Programar', scheduling: 'Solicitando...', shortcuts: 'ACCESOS RÁPIDOS', edit: 'Editar',
    noShortcuts: 'No hay accesos guardados. Selecciona “Editar” para elegir tus direcciones rápidas.',
    driverTitle: 'Modo conductor', goingOffline: 'Desconectando...', goingOnline: 'Conectando...', online: 'En línea', offline: 'Desconectado',
    available: 'Estás disponible para recibir solicitudes.', activateOnline: 'Pulsa el botón para activar el modo en línea.',
    currentRide: 'VIAJE ACTUAL', destinationPrefix: 'Destino:', startRide: 'Iniciar viaje', finishRide: 'Finalizar viaje',
    driverLocation: 'Tu ubicación', estimatedPosition: 'Posición estimada', locationShared: 'Se está compartiendo tu ubicación actual.', locationNotShared: 'Activa el modo en línea para compartir tu ubicación.',
    today: 'HOY', earnings: 'Ganancias:', trips: 'Viajes:', support: 'Soporte 24/7', awaitingRides: 'Esperando solicitudes cercanas...',
    adapted: 'ADAPTADO', conventional: 'CONVENCIONAL', specialNeeds: 'Necesidades especiales',
    mapPassengerTitle: 'Mapa del viaje', mapPassengerSubtitle: 'Introduce origen y destino para ver la ruta.',
    mapDriverTitle: 'Mapa del conductor', mapDriverSubtitle: 'Tu ubicación y los próximos viajes aparecerán aquí.',
    mapLoading: 'Cargando mapa...',
  },
} as const;

export function getDashboardText(language: DashboardLanguage) {
  return panelTranslations[language];
}

export const LOCATION_ICON_OPTIONS: {
  value: DashboardLocationIcon;
  label: string;
  glyph: string;
}[] = [
  { value: 'pin', label: 'Marcador', glyph: '📍' },
  { value: 'car', label: 'Veículo', glyph: '🚗' },
  { value: 'person', label: 'Pessoa', glyph: '👤' },
  { value: 'accessible', label: 'Acessibilidade', glyph: '♿' },
];
