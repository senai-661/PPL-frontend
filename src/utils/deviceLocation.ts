export interface DeviceLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

export function getCurrentDeviceLocation(options?: PositionOptions): Promise<DeviceLocation> {
  if (!('geolocation' in navigator)) {
    return Promise.reject(new Error('Este navegador não oferece geolocalização.'));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        lat: coords.latitude,
        lng: coords.longitude,
        accuracy: coords.accuracy,
      }),
      (error) => {
        const messages: Record<number, string> = {
          1: 'Permita o acesso à localização nas configurações do navegador ou dispositivo.',
          2: 'Não foi possível determinar sua localização. Verifique o GPS e a conexão do dispositivo.',
          3: 'A localização demorou demais. Tente novamente em um local aberto.',
        };
        reject(new Error(messages[error.code] ?? 'Não foi possível obter sua localização.'));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
        ...options,
      },
    );
  });
}
