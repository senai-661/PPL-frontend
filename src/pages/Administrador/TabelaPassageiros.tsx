import { Ban, Edit, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export function PassengersTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const passengers = [
    { id: '001', name: 'Roberto Lima', email: 'roberto@email.com', phone: '(11) 91234-5678', trips: 45, status: 'Ativo' },
    { id: '002', name: 'Julia Fernandes', email: 'julia@email.com', phone: '(11) 92345-6789', trips: 78, status: 'Ativo' },
    { id: '003', name: 'Marcos Pereira', email: 'marcos@email.com', phone: '(11) 93456-7890', trips: 23, status: 'Ativo' },
    { id: '004', name: 'Claudia Souza', email: 'claudia@email.com', phone: '(11) 94567-8901', trips: 156, status: 'Ativo' },
    { id: '005', name: 'Felipe Rocha', email: 'felipe@email.com', phone: '(11) 95678-9012', trips: 12, status: 'Ativo' },
    { id: '006', name: 'Patricia Almeida', email: 'patricia@email.com', phone: '(11) 96789-0123', trips: 8, status: 'Suspenso' },
  ];

  const filteredPassengers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return passengers;
    }

    return passengers.filter((passenger) => {
      const searchableFields = [
        passenger.id,
        passenger.name,
        passenger.email,
        passenger.phone,
      ];

      return searchableFields.some((field) => field.toLowerCase().includes(normalizedSearch));
    });
  }, [passengers, searchTerm]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              placeholder="Buscar passageiro..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Nome</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">E-mail</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Telefone</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Viagens</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Acoes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPassengers.map((passenger) => (
                <tr key={passenger.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{passenger.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{passenger.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{passenger.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{passenger.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{passenger.trips}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      passenger.status === 'Ativo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {passenger.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Editar">
                        <Edit className="size-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Suspender">
                        <Ban className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filteredPassengers.length && (
            <p className="text-center text-gray-500 py-6">Nenhum passageiro encontrado.</p>
          )}
        </div>
      </div>
    </section>
  );
}
