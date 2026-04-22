import { useState } from 'react';
import { Car, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SERVER_CFG } from '../../appConfig';

export function CarRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    placa: '',
    tipoVeiculo: '',
    modeloVeiculo: '',
  });

  const token = localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validações
    if (!formData.placa || formData.placa.length < 7) {
      setError('Placa inválida');
      setLoading(false);
      return;
    }

    if (!formData.tipoVeiculo) {
      setError('Selecione o tipo do veículo');
      setLoading(false);
      return;
    }

    if (!formData.modeloVeiculo) {
      setError('Informe o modelo do veículo');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${SERVER_CFG.SERVER_URL}/api/cadastro/veiculos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          placa: formData.placa.toUpperCase(),
          tipoVeiculo: formData.tipoVeiculo,
          modeloVeiculo: formData.modeloVeiculo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || 'Erro ao cadastrar veículo');
      }

      alert('Veículo cadastrado com sucesso!');
      navigate('/motorista/painel');
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar veículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <Car className="size-16 text-[#5a34a1] mx-auto mb-4" />
          <h1 className="text-4xl mb-4">Cadastrar Veículo</h1>
          <p className="text-gray-600">Adicione um veículo à sua conta de motorista</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="size-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Placa *</label>
              <input
                type="text"
                required
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                placeholder="ABC-1234 ou ABC1D23"
              />
              <small className="text-gray-500 text-xs">Formato: ABC-1234 ou ABC1D23 (Mercosul)</small>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tipo do Veículo *</label>
              <select
                required
                value={formData.tipoVeiculo}
                onChange={(e) => setFormData({ ...formData, tipoVeiculo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
              >
                <option value="">Selecione...</option>
                <option value="CONVENCIONAL">Convencional</option>
                <option value="ADAPTADO">Adaptado (com rampa/elevador)</option>
                <option value="VAN">Van Acessível</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Modelo do Veículo *</label>
              <input
                type="text"
                required
                value={formData.modeloVeiculo}
                onChange={(e) => setFormData({ ...formData, modeloVeiculo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                placeholder="Fiat Ducato 2023"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Importante:</strong> O veículo deve estar em boas condições e possuir 
                adaptações de acessibilidade (rampa ou elevador) para ser aprovado na plataforma OpenLine.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5a34a1] text-white py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="size-5 animate-spin" />}
              {loading ? 'Cadastrando...' : 'Cadastrar Veículo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}