import { Calendar, CreditCard, Users } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AddressAutocomplete,
  type AutocompleteAddress,
} from '../../app/components/AutocompleteEndereco';

interface TripFormData {
  origin: string;
  destination: string;
  originCoords: { lat: number | null; lon: number | null };
  destinationCoords: { lat: number | null; lon: number | null };
  scheduleDate: string;
  scheduleTime: string;
  passengers: string;
  paymentMethod: string;
  notes: string;
}

export function NewTrip() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState<TripFormData>({
    origin: '',
    destination: '',
    originCoords: { lat: null, lon: null },
    destinationCoords: { lat: null, lon: null },
    scheduleDate: '',
    scheduleTime: '',
    passengers: '1',
    paymentMethod: 'credit_card',
    notes: '',
  });

  const handleOriginSelect = (address: AutocompleteAddress) => {
    setTripData((currentData) => ({
      ...currentData,
      origin: address.display_name,
      originCoords: { lat: address.lat, lon: address.lon },
    }));
  };

  const handleDestinationSelect = (address: AutocompleteAddress) => {
    setTripData((currentData) => ({
      ...currentData,
      destination: address.display_name,
      destinationCoords: { lat: address.lat, lon: address.lon },
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulação de criação de viagem
    alert('Viagem solicitada com sucesso!');
    navigate('/viagem/painel');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4">Solicitar Nova Viagem</h1>
          <p className="text-gray-600">Preencha os detalhes da sua viagem</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AddressAutocomplete
              label="Origem *"
              value={tripData.origin}
              onChange={(value) => setTripData({ ...tripData, origin: value })}
              onSelect={handleOriginSelect}
              placeholder="Endereço de origem ou use localização atual"
              iconColor="text-green-600"
              required
            />

            <AddressAutocomplete
              label="Destino *"
              value={tripData.destination}
              onChange={(value) => setTripData({ ...tripData, destination: value })}
              onSelect={handleDestinationSelect}
              placeholder="Para onde você vai?"
              iconColor="text-red-600"
              required
            />

            <div className="border-t pt-6">
              <h3 className="text-lg mb-4">Agendar Viagem (Opcional)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Data</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                    <input
                      type="date"
                      value={tripData.scheduleDate}
                      onChange={(e) => setTripData({ ...tripData, scheduleDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Horário</label>
                  <input
                    type="time"
                    value={tripData.scheduleTime}
                    onChange={(e) => setTripData({ ...tripData, scheduleTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg mb-4">Opções Adicionais</h3>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Número de Passageiros</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <select
                    value={tripData.passengers}
                    onChange={(e) => setTripData({ ...tripData, passengers: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  >
                    <option value="1">1 passageiro</option>
                    <option value="2">2 passageiros</option>
                    <option value="3">3 passageiros</option>
                    <option value="4">4 passageiros</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Método de Pagamento</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <select
                    value={tripData.paymentMethod}
                    onChange={(e) => setTripData({ ...tripData, paymentMethod: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  >
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="debit_card">Cartão de Débito</option>
                    <option value="pix">PIX</option>
                    <option value="cash">Dinheiro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Observações (Opcional)</label>
                <textarea
                  value={tripData.notes}
                  onChange={(e) => setTripData({ ...tripData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1] resize-none"
                  rows={3}
                  placeholder="Alguma informação adicional para o motorista..."
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 mb-1">Valor Estimado</p>
                  <p className="text-3xl">R$ 28,00</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 mb-1">Tempo Estimado</p>
                  <p className="text-xl">15 min</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#5a34a1] text-white py-3 rounded-lg transition-colors"
              >
                {tripData.scheduleDate ? 'Agendar Viagem' : 'Solicitar Agora'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
