import { Car, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function CarsTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const cars = [
    { id: '001', plate: 'ABC-1234', model: 'Fiat Ducato Adaptada', year: 2023, driver: 'João Silva', status: 'Ativo' },
    { id: '002', plate: 'DEF-5678', model: 'Volkswagen Caddy', year: 2022, driver: 'Maria Santos', status: 'Ativo' },
    { id: '003', plate: 'GHI-9012', model: 'Renault Master', year: 2024, driver: 'Carlos Oliveira', status: 'Manutenção' },
    { id: '004', plate: 'JKL-3456', model: 'Fiat Ducato Adaptada', year: 2023, driver: 'Ana Costa', status: 'Ativo' },
    { id: '005', plate: 'MNO-7890', model: 'Mercedes Sprinter', year: 2024, driver: 'Pedro Alves', status: 'Ativo' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl mb-2">Gerenciamento de Veículos</h1>
          <p className="text-white/80">Controle total da frota</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Buscar por placa, modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
              />
            </div>
            <button className="bg-[#5a34a1] text-white px-6 py-2 rounded-lg hover:bg-[#4a2891] transition-colors flex items-center gap-2">
              <Plus className="size-5" />
              Adicionar Veículo
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">ID</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Placa</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Modelo</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Ano</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Motorista</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.plate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.driver}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        car.status === 'Ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="size-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="size-4" />
                        </button>
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
