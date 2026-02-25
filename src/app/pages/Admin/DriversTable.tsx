import { Search, Plus, Edit, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export function DriversTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const drivers = [
    { id: '001', name: 'João Silva', email: 'joao@email.com', phone: '(11) 98765-4321', rating: 4.9, trips: 245, status: 'Aprovado' },
    { id: '002', name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 98765-1234', rating: 4.8, trips: 189, status: 'Aprovado' },
    { id: '003', name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '(11) 98765-5678', rating: 4.7, trips: 312, status: 'Aprovado' },
    { id: '004', name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 98765-9012', rating: 5.0, trips: 421, status: 'Aprovado' },
    { id: '005', name: 'Pedro Alves', email: 'pedro@email.com', phone: '(11) 98765-3456', rating: 0, trips: 0, status: 'Pendente' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl mb-2">Gerenciamento de Motoristas</h1>
          <p className="text-white/80">Aprovar e gerenciar motoristas parceiros</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Buscar motorista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Avaliação</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Viagens</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{driver.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{driver.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {driver.rating > 0 ? `⭐ ${driver.rating}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.trips}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        driver.status === 'Aprovado' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {driver.status === 'Pendente' ? (
                          <>
                            <button className="text-green-600 hover:text-green-800" title="Aprovar">
                              <CheckCircle className="size-5" />
                            </button>
                            <button className="text-red-600 hover:text-red-800" title="Rejeitar">
                              <XCircle className="size-5" />
                            </button>
                          </>
                        ) : (
                          <button className="text-blue-600 hover:text-blue-800" title="Editar">
                            <Edit className="size-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
