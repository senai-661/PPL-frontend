import { useState } from 'react';
import { Car, Upload } from 'lucide-react';

export function CarRegistration() {
  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    renavam: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Veiculo cadastrado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <Car className="size-16 text-[#5a34a1] mx-auto mb-4" />
          <h1 className="text-4xl mb-4">Cadastrar Veiculo</h1>
          <p className="text-gray-600">Adicione um veiculo a sua conta de motorista</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Placa *</label>
                <input
                  type="text"
                  required
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="ABC-1234"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Marca *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="Fiat"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Modelo *</label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="Ducato Adaptada"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Ano *</label>
                <input
                  type="text"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="2023"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Cor *</label>
                <input
                  type="text"
                  required
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="Branco"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">RENAVAM *</label>
                <input
                  type="text"
                  required
                  value={formData.renavam}
                  onChange={(e) => setFormData({ ...formData, renavam: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                  placeholder="00000000000"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl">Documentos do Veiculo</h3>

              <div>
                <label className="block text-gray-700 mb-2">CRLV (Documento do Veiculo) *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors cursor-pointer">
                  <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Clique para fazer upload ou arraste o arquivo</p>
                  <input type="file" className="hidden" accept="image/*,.pdf" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Certificado de Vistoria *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors cursor-pointer">
                  <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Clique para fazer upload ou arraste o arquivo</p>
                  <input type="file" className="hidden" accept="image/*,.pdf" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Fotos do Veiculo (frente, traseira, laterais) *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors cursor-pointer">
                  <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Voce pode selecionar multiplas fotos</p>
                  <input type="file" multiple className="hidden" accept="image/*" />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Importante:</strong> O veiculo deve estar em boas condicoes e possuir
                adaptacoes de acessibilidade (rampa ou elevador) para ser aprovado na plataforma OpenLine.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5a34a1] text-white py-3 rounded-lg transition-colors"
            >
              Cadastrar Veiculo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
