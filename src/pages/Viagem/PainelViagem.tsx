import { MapPin, Clock, DollarSign, User, Navigation } from 'lucide-react';

export function TripDashboard() {
  const activeTrip = {
    id: '1234',
    status: 'em_andamento',
    driver: {
      name: 'João Silva',
      rating: 4.9,
      photo: null,
      vehicle: 'Fiat Ducato Branca - ABC-1234',
    },
    from: 'Av. Paulista, 1000',
    to: 'Shopping Eldorado',
    estimatedValue: 'R$ 28,00',
    estimatedTime: '15 min',
    estimatedDistance: '8.5 km',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Trip Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Viagem #{activeTrip.id}</p>
                <h1 className="text-3xl">Viagem em Andamento</h1>
              </div>
              <div className="text-right">
                <p className="text-2xl">{activeTrip.estimatedValue}</p>
                <p className="text-sm text-white/80">Valor estimado</p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="relative h-96 bg-gray-200 flex items-center justify-center">
            <Navigation className="size-24 text-gray-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 text-lg">Mapa da rota seria exibido aqui</p>
            </div>
          </div>

          {/* Trip Details */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-2">Origem</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="size-5 text-green-600 mt-1" />
                  <p className="text-gray-900">{activeTrip.from}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-2">Destino</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="size-5 text-red-600 mt-1" />
                  <p className="text-gray-900">{activeTrip.to}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-[#5a34a1]" />
                <div>
                  <p className="text-sm text-gray-500">Tempo estimado</p>
                  <p className="text-gray-900">{activeTrip.estimatedTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="size-5 text-[#5a34a1]" />
                <div>
                  <p className="text-sm text-gray-500">Distância</p>
                  <p className="text-gray-900">{activeTrip.estimatedDistance}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="size-5 text-[#5a34a1]" />
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="text-gray-900">{activeTrip.estimatedValue}</p>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg mb-4">Informações do Motorista</h3>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-[#5a34a1] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl">
                  {activeTrip.driver.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-lg">{activeTrip.driver.name}</p>
                  <p className="text-sm text-gray-600">⭐ {activeTrip.driver.rating}</p>
                  <p className="text-sm text-gray-600">{activeTrip.driver.vehicle}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-[#5a34a1] text-white px-4 py-2 rounded-lg hover:bg-[#4a2891] transition-colors text-sm">
                    Ligar
                  </button>
                  <button className="border-2 border-[#5a34a1] text-[#5a34a1] px-4 py-2 rounded-lg hover:bg-[#5a34a1] hover:text-white transition-colors text-sm">
                    Mensagem
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                Compartilhar Viagem
              </button>
              <button className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors">
                Emergência SOS
              </button>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg mb-3 text-blue-900">Dicas de Segurança</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Verifique se a placa do veículo corresponde à informação no app</li>
            <li>• Compartilhe sua viagem com um contato de confiança</li>
            <li>• Use sempre o cinto de segurança</li>
            <li>• Em caso de emergência, pressione o botão SOS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
