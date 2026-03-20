import { User, Mail, Phone, Car, Star, MapPin, Edit } from 'lucide-react';
import { useState } from 'react';

export function DriverProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    cnh: '12345678900',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
  });

  const stats = {
    rating: 4.9,
    totalTrips: 245,
    totalEarnings: 'R$ 12.450,00',
    joinDate: 'Janeiro 2025',
  };

  const vehicle = {
    plate: 'ABC-1234',
    model: 'Fiat Ducato Adaptada',
    year: 2023,
    color: 'Branco',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="bg-white text-[#5a34a1] w-24 h-24 rounded-full flex items-center justify-center text-4xl">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl mb-2">{profile.name}</h1>
                  <p className="text-white/80">Motorista Parceiro OpenLine</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="size-5 text-yellow-300" />
                    <span className="text-xl">{stats.rating}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-[#5a34a1] px-6 py-3 rounded-lg  transition-colors flex items-center gap-2"
              >
                <Edit className="size-4" />
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 p-8 border-b">
            <div className="text-center">
              <p className="text-3xl text-[#5a34a1] mb-1">{stats.rating}</p>
              <p className="text-gray-600 text-sm">Avaliação</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-[#5a34a1] mb-1">{stats.totalTrips}</p>
              <p className="text-gray-600 text-sm">Viagens</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-[#5a34a1] mb-1">{stats.totalEarnings}</p>
              <p className="text-gray-600 text-sm">Ganhos Totais</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-[#5a34a1] mb-1">{stats.joinDate}</p>
              <p className="text-gray-600 text-sm">Desde</p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="p-8 border-b">
            <h2 className="text-2xl mb-6">Informações Pessoais</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User className="size-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nome Completo</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 mt-1"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="size-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 mt-1"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="size-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 mt-1"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="text-gray-900">{profile.address}</p>
                </div>
              </div>
            </div>

            {isEditing && (
              <button className="mt-6 bg-[#5a34a1] text-white px-6 py-3 rounded-lg  transition-colors">
                Salvar Alterações
              </button>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="p-8">
            <h2 className="text-2xl mb-6 flex items-center gap-2">
              <Car className="size-6 text-[#5a34a1]" />
              Veículo Cadastrado
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Placa</p>
                  <p className="text-gray-900 text-lg">{vehicle.plate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Modelo</p>
                  <p className="text-gray-900 text-lg">{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ano</p>
                  <p className="text-gray-900 text-lg">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cor</p>
                  <p className="text-gray-900 text-lg">{vehicle.color}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
