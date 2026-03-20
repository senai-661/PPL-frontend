import { User, Mail, Phone, MapPin, Edit, CreditCard } from 'lucide-react';
import { useState } from 'react';

export function PassengerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 91234-5678',
    cpf: '123.456.789-00',
    address: 'Rua das Flores, 123 - Vila Mariana, São Paulo - SP',
    hasSpecialNeeds: true,
    specialNeedsDescription: 'Uso cadeira de rodas',
  });

  const stats = {
    totalTrips: 45,
    totalSpent: 'R$ 1.245,00',
    favoriteDestination: 'Shopping Center',
    joinDate: 'Janeiro 2025',
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
                  <p className="text-white/80">Passageiro OpenLine</p>
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
              <p className="text-3xl text-[#5a34a1] mb-1">{stats.totalTrips}</p>
              <p className="text-gray-600 text-sm">Viagens</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-[#5a34a1] mb-1">{stats.totalSpent}</p>
              <p className="text-gray-600 text-sm">Total Gasto</p>
            </div>
            <div className="text-center">
              <p className="text-xl text-[#5a34a1] mb-1">{stats.favoriteDestination}</p>
              <p className="text-gray-600 text-sm">Destino Favorito</p>
            </div>
            <div className="text-center">
              <p className="text-xl text-[#5a34a1] mb-1">{stats.joinDate}</p>
              <p className="text-gray-600 text-sm">Desde</p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="p-8 border-b">
            <h2 className="text-2xl mb-6">Informações Pessoais</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User className="size-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Nome Completo</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="size-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">E-mail</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="size-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Telefone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="text-gray-900 text-sm">{profile.address}</p>
                </div>
              </div>
            </div>

            {profile.hasSpecialNeeds && (
              <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-900 mb-1">Necessidades Especiais:</p>
                <p className="text-blue-800">{profile.specialNeedsDescription}</p>
              </div>
            )}

            {isEditing && (
              <button className="mt-6 bg-[#5a34a1] text-white px-6 py-3 rounded-lg  transition-colors">
                Salvar Alterações
              </button>
            )}
          </div>

          {/* Payment Methods */}
          <div className="p-8">
            <h2 className="text-2xl mb-6 flex items-center gap-2">
              <CreditCard className="size-6 text-[#5a34a1]" />
              Métodos de Pagamento
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900">**** **** **** 1234</p>
                    <p className="text-sm text-gray-500">Cartão de Crédito - Principal</p>
                  </div>
                </div>
                <button className="text-blue-600  text-sm">Editar</button>
              </div>
              
              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600   transition-colors">
                + Adicionar Método de Pagamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

