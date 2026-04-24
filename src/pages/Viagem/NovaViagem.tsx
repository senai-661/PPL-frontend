import { Calendar, CreditCard, Users } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AddressAutocomplete,
  type AutocompleteAddress,
} from '../../app/components/AddressAutocomplete';

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isScheduled = tripData.scheduleDate && tripData.scheduleTime;

    const payload = {
      idPassageiro: 1,
      origemCorrida: tripData.origin,
      destinoCorrida: tripData.destination,
      tipoCorrida: isScheduled ? 'AGENDADA' : 'NORMAL',
      dataAgendada: isScheduled
        ? `${tripData.scheduleDate}T${tripData.scheduleTime}:00`
        : null,
      statusAgendamento: isScheduled ? 'PENDENTE' : null,
      preco: 28, // temporário (backend pode calcular depois)
    };

    try {
      await axios.post(
        'http://localhost:3333/api/corridas-agendadas',
        payload
      );

      alert(
        isScheduled
          ? 'Viagem agendada com sucesso!'
          : 'Viagem solicitada com sucesso!'
      );

      navigate('/viagem/painel');
    } catch (error) {
      console.error(error);
      alert('Erro ao agendar corrida');
    }
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
              onChange={(value) =>
                setTripData({ ...tripData, origin: value })
              }
              onSelect={handleOriginSelect}
              placeholder="Endereço de origem ou use localização atual"
              iconColor="text-green-600"
              required
            />

            <AddressAutocomplete
              label="Destino *"
              value={tripData.destination}
              onChange={(value) =>
                setTripData({ ...tripData, destination: value })
              }
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
                      onChange={(e) =>
                        setTripData({
                          ...tripData,
                          scheduleDate: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Horário</label>
                  <input
                    type="time"
                    value={tripData.scheduleTime}
                    onChange={(e) =>
                      setTripData({
                        ...tripData,
                        scheduleTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg mb-4">Opções Adicionais</h3>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Número de Passageiros
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 text-gray-400 size-5" />
                  <select
                    value={tripData.passengers}
                    onChange={(e) =>
                      setTripData({
                        ...tripData,
                        passengers: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="1">1 passageiro</option>
                    <option value="2">2 passageiros</option>
                    <option value="3">3 passageiros</option>
                    <option value="4">4 passageiros</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Método de Pagamento
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 text-gray-400 size-5" />
                  <select
                    value={tripData.paymentMethod}
                    onChange={(e) =>
                      setTripData({
                        ...tripData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="debit_card">Cartão de Débito</option>
                    <option value="pix">PIX</option>
                    <option value="cash">Dinheiro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={tripData.notes}
                  onChange={(e) =>
                    setTripData({ ...tripData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-6 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p>Valor Estimado</p>
                  <p className="text-3xl">R$ 28,00</p>
                </div>
                <div>
                  <p>Tempo Estimado</p>
                  <p className="text-xl">15 min</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 bg-[#5a34a1] text-white py-3 rounded-lg"
              >
                {tripData.scheduleDate
                  ? 'Agendar Viagem'
                  : 'Solicitar Agora'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}