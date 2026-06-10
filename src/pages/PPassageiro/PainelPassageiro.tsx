import { Link } from 'react-router-dom';

export function PassengerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4">Painel do Passageiro</h1>
          <p className="text-gray-600">Bem-vindo à sua área exclusiva</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold mb-4">Olá, Passageiro!</h2>
            <p className="text-gray-600 mb-6">Aqui você pode gerenciar suas viagens.</p>
            
            <div className="flex flex-col gap-3">
              <Link to="/" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                📍 Solicitar Nova Viagem
              </Link>
              <Link to="/passageiro/historico" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                📋 Ver Histórico de Corridas
              </Link>
              <Link to="/passageiro/notificacoes" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                🔔 Ver Notificações
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PassengerDashboard;